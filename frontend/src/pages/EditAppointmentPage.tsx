import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  getAppointmentById,
  updateAppointment,
} from '../api/appointmentsApi'
import { getClients } from '../api/clientsApi'
import { getEstheticians } from '../api/estheticiansApi'
import { getServices } from '../api/servicesApi'

import DashboardLayout from '../layouts/DashboardLayout'

import type { Appointment } from '../types/appointment'
import type { Client } from '../types/client'
import type { Service } from '../types/service'
import type { User } from '../types/user'

import Card from '../components/ui/Card'
import Select from '../components/ui/select'
import Textarea from '../components/ui/Textarea'
import AppointmentForm from '../components/appointments/AppointmentForm'

import './CreateAppointmentPage.css'

function EditAppointmentPage() {
  const { id } = useParams()

  const [appointment, setAppointment] = useState<Appointment | null>(null)

  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [estheticians, setEstheticians] = useState<User[]>([])

  const [loading, setLoading] = useState(true)

  const [selectedClient, setSelectedClient] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedEsthetician, setSelectedEsthetician] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      if (!id) return

      const [appointmentData, clientsData, servicesData, estheticiansData] =
        await Promise.all([
          getAppointmentById(id),
          getClients(),
          getServices(),
          getEstheticians(),
        ])

      setAppointment(appointmentData)

      setClients(clientsData)
      setServices(servicesData)
      setEstheticians(estheticiansData)

      setSelectedClient(String(appointmentData.client))
      setSelectedService(String(appointmentData.service))
      setSelectedEsthetician(String(appointmentData.esthetician))
      setNotes(appointmentData.notes ?? '')

      const startDate = new Date(appointmentData.start_time)

      setDate(startDate.toISOString().slice(0, 10))
      setTime(startDate.toTimeString().slice(0, 5))

      setLoading(false)
    }

    loadData()
  }, [id])

  async function handleUpdateAppointment() {
    if (!id) return

    if (!selectedClient || !selectedService || !selectedEsthetician || !date || !time) {
        setError('Debe completar cliente, servicio, esteticista, fecha y hora.')
        return
    }

    try {
        setSaving(true)
        setError('')

        await updateAppointment(id, {
        client: Number(selectedClient),
        service: Number(selectedService),
        esthetician: Number(selectedEsthetician),
        start_time: `${date}T${time}:00`,
        notes,
        })

        window.location.href = '/appointments'
    } catch {
        setError('No se pudo actualizar la cita. Revise horario, cliente, servicio o esteticista.')
    } finally {
        setSaving(false)
    }
    }

  if (loading) {
    return (
      <DashboardLayout title="Editar cita" eyebrow="Gestión de agenda">
        <p>Cargando cita...</p>
      </DashboardLayout>
    )
  }

    return (
    <DashboardLayout title="Editar cita" eyebrow="Gestión de agenda">
        <section className="create-appointment-grid">
        <Card className="appointment-form-card">
            <AppointmentForm title="Datos de la cita" subtitle="Editar reserva">
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
                onChange={(e) => setSelectedService(e.target.value)}
            />

            <Select
                label="Esteticista"
                value={selectedEsthetician}
                options={estheticians.map((esthetician) => ({
                value: esthetician.id,
                label: esthetician.full_name,
                }))}
                onChange={(e) => setSelectedEsthetician(e.target.value)}
            />

            <label className="ui-field">
                <span>Fecha</span>
                <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
            </label>

            <label className="ui-field">
                <span>Hora</span>
                <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                />
            </label>

            <Textarea
                label="Notas"
                value={notes}
                placeholder="Información adicional para la cita..."
                onChange={(e) => setNotes(e.target.value)}
            />

            <button
                className="create-appointment-button"
                type="button"
                onClick={handleUpdateAppointment}
                disabled={saving}
                >
                {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {error && <p className="create-appointment-error">{error}</p>}
            </AppointmentForm>
        </Card>

        <Card className="appointment-preview-card">
            <p className="preview-eyebrow">Resumen</p>

            <div className="appointment-summary">
            <div>
                <span>Cliente</span>
                <strong>{appointment?.client_name}</strong>
            </div>

            <div>
                <span>Servicio actual</span>
                <strong>{appointment?.service_name}</strong>
            </div>

            <div>
                <span>Estado</span>
                <strong>{appointment?.status}</strong>
            </div>

            <div>
                <span>Fecha y hora</span>
                <strong>{date && time ? `${date} ${time}` : 'Sin definir'}</strong>
            </div>
            </div>
        </Card>
        </section>
    </DashboardLayout>
    )
}

export default EditAppointmentPage