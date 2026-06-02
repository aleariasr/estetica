import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  createAppointment,
  getAvailableSlots,
} from '../api/appointmentsApi'

import { getClients } from '../api/clientsApi'
import { getEstheticians } from '../api/estheticiansApi'
import { getServices } from '../api/servicesApi'

import Card from '../components/ui/Card'
import Select from '../components/ui/select'
import Textarea from '../components/ui/Textarea'

import DashboardLayout from '../layouts/DashboardLayout'

import type { Client } from '../types/client'
import type { Service } from '../types/service'
import type { User } from '../types/user'

import AppointmentForm from '../components/appointments/AppointmentForm'

import './CreateAppointmentPage.css'

function CreateAppointmentPage() {
  const navigate = useNavigate()

  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [estheticians, setEstheticians] = useState<User[]>([])

  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [saving, setSaving] = useState(false)

  const [selectedClient, setSelectedClient] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedEsthetician, setSelectedEsthetician] = useState('')

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [clientsData, servicesData, estheticiansData] =
          await Promise.all([
            getClients(),
            getServices(),
            getEstheticians(),
          ])

        setClients(clientsData)
        setServices(servicesData)
        setEstheticians(estheticiansData)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    async function loadAvailableSlots() {
      if (!selectedService || !selectedEsthetician || !date) {
        setAvailableSlots([])
        setTime('')
        return
      }

      try {
        setLoadingSlots(true)
        setError('')

        const slots = await getAvailableSlots({
          service: selectedService,
          esthetician: selectedEsthetician,
          date,
        })

        setAvailableSlots(slots)

        if (!slots.includes(time)) {
          setTime('')
        }
      } catch {
        setAvailableSlots([])
        setTime('')
        setError('No se pudieron cargar los horarios disponibles.')
      } finally {
        setLoadingSlots(false)
      }
    }

    loadAvailableSlots()
  }, [selectedService, selectedEsthetician, date, time])

  const selectedClientData = clients.find(
    (client) => client.id === Number(selectedClient)
  )

  const selectedServiceData = services.find(
    (service) => service.id === Number(selectedService)
  )

  const selectedEstheticianData = estheticians.find(
    (esthetician) => esthetician.id === Number(selectedEsthetician)
  )

  async function handleCreateAppointment() {
    if (!selectedClient || !selectedService || !selectedEsthetician || !date || !time) {
      setError('Debe completar cliente, servicio, esteticista, fecha y hora.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await createAppointment({
        client: Number(selectedClient),
        service: Number(selectedService),
        esthetician: Number(selectedEsthetician),
        start_time: `${date}T${time}:00`,
        notes,
      })

      navigate('/appointments')
    } catch {
      setError(
        'No se pudo crear la cita. Revise horario, cliente, servicio o esteticista.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Nueva cita" eyebrow="Gestión de agenda">
        <p>Cargando...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Nueva cita" eyebrow="Gestión de agenda">
      <section className="create-appointment-grid">
        <Card className="appointment-form-card">
          <AppointmentForm
            title="Detalles de la cita"
            subtitle="Nueva reserva"
          >
            <Select
              label="Cliente"
              value={selectedClient}
              options={clients.map((client) => ({
                value: client.id,
                label: `${client.first_name} ${client.last_name}`,
              }))}
              onChange={(e) => setSelectedClient(e.target.value)}
            />

            <Select
              label="Servicio"
              value={selectedService}
              options={services.map((service) => ({
                value: service.id,
                label: `${service.name} · ₡${service.price}`,
              }))}
              onChange={(e) => {
                setSelectedService(e.target.value)
                setTime('')
              }}
            />

            <Select
              label="Esteticista"
              value={selectedEsthetician}
              options={estheticians.map((esthetician) => ({
                value: esthetician.id,
                label: esthetician.full_name,
              }))}
              onChange={(e) => {
                setSelectedEsthetician(e.target.value)
                setTime('')
              }}
            />

            <label className="ui-field">
              <span>Fecha</span>

              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setTime('')
                }}
              />
            </label>

            <Select
              label={
                loadingSlots
                  ? 'Cargando horarios...'
                  : 'Hora disponible'
              }
              value={time}
              placeholder={
                selectedService && selectedEsthetician && date
                  ? availableSlots.length > 0
                    ? 'Seleccione una hora'
                    : 'No hay horarios disponibles'
                  : 'Seleccione servicio, esteticista y fecha'
              }
              options={availableSlots.map((slot) => ({
                value: slot,
                label: slot,
              }))}
              onChange={(e) => setTime(e.target.value)}
            />

            <Textarea
              label="Notas"
              value={notes}
              placeholder="Información adicional para la cita..."
              onChange={(e) => setNotes(e.target.value)}
            />

            <button
              className="create-appointment-button"
              type="button"
              onClick={handleCreateAppointment}
              disabled={saving || loadingSlots || availableSlots.length === 0}
            >
              {saving ? 'Creando cita...' : 'Crear cita'}
            </button>

            {error && <p className="create-appointment-error">{error}</p>}
          </AppointmentForm>
        </Card>

        <Card className="appointment-preview-card">
          <p className="preview-eyebrow">Resumen</p>

          <div className="appointment-summary">
            <div>
              <span>Cliente</span>
              <strong>
                {selectedClientData
                  ? `${selectedClientData.first_name} ${selectedClientData.last_name}`
                  : 'Sin seleccionar'}
              </strong>
            </div>

            <div>
              <span>Servicio</span>
              <strong>{selectedServiceData?.name ?? 'Sin seleccionar'}</strong>
            </div>

            <div>
              <span>Precio</span>
              <strong>
                {selectedServiceData ? `₡${selectedServiceData.price}` : '—'}
              </strong>
            </div>

            <div>
              <span>Duración</span>
              <strong>
                {selectedServiceData
                  ? `${selectedServiceData.duration_minutes} min`
                  : '—'}
              </strong>
            </div>

            <div>
              <span>Esteticista</span>
              <strong>
                {selectedEstheticianData?.full_name ?? 'Sin seleccionar'}
              </strong>
            </div>

            <div>
              <span>Fecha y hora</span>
              <strong>{date && time ? `${date} ${time}` : 'Sin definir'}</strong>
            </div>

            <div>
              <span>Horarios disponibles</span>
              <strong>
                {selectedService && selectedEsthetician && date
                  ? `${availableSlots.length} horarios`
                  : 'Pendiente'}
              </strong>
            </div>
          </div>
        </Card>
      </section>
    </DashboardLayout>
  )
}

export default CreateAppointmentPage