import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getAppointmentsByClient } from '../api/appointmentsApi'
import {
  getClientById,
  updateClient,
} from '../api/clientsApi'

import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Appointment } from '../types/appointment'
import type { Client } from '../types/client'

import './ClientsPage.css'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-CR', {
    dateStyle: 'medium',
  })
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function ClientDetailPage() {
  const { id } = useParams()

  const [client, setClient] = useState<Client | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadClient() {
      if (!id) return

      const data = await getClientById(id)
      const appointmentsData = await getAppointmentsByClient(id)

      setClient(data)
      setAppointments(appointmentsData)
      setLoading(false)
    }

    loadClient()
  }, [id])

  async function handleToggleClientStatus() {
    if (!client) return

    try {
      setSaving(true)
      setError('')

      const updatedClient = await updateClient(
        String(client.id),
        {
          is_active: !client.is_active,
        }
      )

      setClient(updatedClient)
    } catch {
      setError('No se pudo actualizar el estado del cliente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Detalle de cliente" eyebrow="Gestión de clientes">
        <p>Cargando cliente...</p>
      </DashboardLayout>
    )
  }
  
  if (!client) {
    return (
      <DashboardLayout title="Detalle de cliente" eyebrow="Gestión de clientes">
        <p>Cliente no encontrado.</p>
      </DashboardLayout>
    )
  }

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'COMPLETED'
  ).length

  const canceledAppointments = appointments.filter(
    (appointment) => appointment.status === 'CANCELED'
  ).length

  const noShowAppointments = appointments.filter(
    (appointment) => appointment.status === 'NO_SHOW'
  ).length

  return (
    <DashboardLayout
      title={`${client.first_name} ${client.last_name}`}
      eyebrow="Detalle de cliente"
      actionLabel="Editar cliente"
      actionTo={`/clients/${client.id}/edit`}
    >
      <section className="create-appointment-grid">
        <Card className="appointment-form-card">
          <div className="form-heading">
            <p>Información personal</p>
            <h2>
              {client.first_name} {client.last_name}
            </h2>
          </div>

          <div className="appointment-summary">
            <div>
              <span>Estado</span>
              <strong>{client.is_active ? 'Activo' : 'Inactivo'}</strong>
            </div>

            <div>
              <span>Teléfono</span>
              <strong>{client.phone}</strong>
            </div>

            <div>
              <span>Correo</span>
              <strong>{client.email || 'Sin correo registrado'}</strong>
            </div>

            <div>
              <span>Notas</span>
              <strong>{client.notes || 'Sin notas'}</strong>
            </div>

            <div>
              <span>Fecha de registro</span>
              <strong>{formatDate(client.created_at)}</strong>
            </div>

            <div>
              <span>Última actualización</span>
              <strong>{formatDate(client.updated_at)}</strong>
            </div>
          </div>
        </Card>

        <Card className="appointment-preview-card">
          <p className="preview-eyebrow">Resumen del cliente</p>

          <div className="appointment-summary">
            <div>
              <span>Total de citas</span>
              <strong>{appointments.length}</strong>
            </div>

            <div>
              <span>Completadas</span>
              <strong>{completedAppointments}</strong>
            </div>

            <div>
              <span>Canceladas</span>
              <strong>{canceledAppointments}</strong>
            </div>

            <div>
              <span>No asistió</span>
              <strong>{noShowAppointments}</strong>
            </div>
          </div>

          <div className="appointment-actions">
            <Link
              className="create-appointment-button"
              to={`/clients/${client.id}/edit`}
            >
              Editar cliente
            </Link>

            <button
              className={
                client.is_active
                  ? 'danger-appointment-button'
                  : 'secondary-appointment-button'
              }
              type="button"
              onClick={handleToggleClientStatus}
              disabled={saving}
            >
              {saving
                ? 'Actualizando...'
                : client.is_active
                  ? 'Desactivar cliente'
                  : 'Activar cliente'}
            </button>
            {error && <p className="create-appointment-error">{error}</p>}

            <Link className="secondary-appointment-button" to="/clients">
              Volver a clientes
            </Link>
          </div>
        </Card>
      </section>

      <Card className="clients-card client-history-card">
        <div className="clients-heading">
          <div>
            <p>Historial</p>
            <h2>Citas del cliente</h2>
          </div>
        </div>

        {appointments.length === 0 && (
          <p className="clients-state">
            Este cliente todavía no tiene citas registradas.
          </p>
        )}

        {appointments.length > 0 && (
          <div className="clients-list">
            {appointments.map((appointment) => (
              <article className="client-item" key={appointment.id}>
                <div className="client-info">
                  <h3>{appointment.service_name}</h3>
                  <p>{formatDateTime(appointment.start_time)}</p>
                </div>

                <div className="client-meta">
                  <StatusBadge status={appointment.status} />

                  <div className="client-actions">
                    <Link
                      className="client-action"
                      to={`/appointments/${appointment.id}`}
                    >
                      Ver cita
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}

export default ClientDetailPage