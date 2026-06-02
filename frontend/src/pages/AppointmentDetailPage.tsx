import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  getAppointmentById,
  updateAppointment,
} from '../api/appointmentsApi'

import {
  getNotificationsByAppointment,
  sendNotificationNow,
} from '../api/notificationsApi'

import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Appointment } from '../types/appointment'
import type { Notification } from '../types/notification'

import './CreateAppointmentPage.css'

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getStatusLabel(status: Appointment['status']) {
  const labels: Record<Appointment['status'], string> = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    COMPLETED: 'Completada',
    CANCELED: 'Cancelada',
    NO_SHOW: 'No asistió',
  }

  return labels[status]
}

function AppointmentDetailPage() {
  const { id } = useParams()

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingNotificationId, setSendingNotificationId] =
    useState<number | null>(null)

  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAppointment() {
      if (!id) return

      const [appointmentData, notificationsData] = await Promise.all([
        getAppointmentById(id),
        getNotificationsByAppointment(id),
      ])

      setAppointment(appointmentData)
      setNotifications(notificationsData)
      setLoading(false)
    }

    loadAppointment()
  }, [id])

  async function handleSendNotification(notificationId: number) {
    try {
      setSendingNotificationId(notificationId)
      setError('')

      const updatedNotification =
        await sendNotificationNow(String(notificationId))

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? updatedNotification
            : notification
        )
      )
    } catch {
      setError('No se pudo enviar la notificación.')
    } finally {
      setSendingNotificationId(null)
    }
  }

  async function updateStatus(
    status: Appointment['status'],
    errorMessage: string
  ) {
    if (!appointment) return

    try {
      setSaving(true)
      setError('')

      const updatedAppointment = await updateAppointment(
        String(appointment.id),
        { status }
      )

      setAppointment(updatedAppointment)
    } catch {
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Detalle de cita" eyebrow="Gestión de agenda">
        <p>Cargando cita...</p>
      </DashboardLayout>
    )
  }

  if (!appointment) {
    return (
      <DashboardLayout title="Detalle de cita" eyebrow="Gestión de agenda">
        <p>No se encontró la cita.</p>
      </DashboardLayout>
    )
  }

  const isFinalStatus =
    appointment.status === 'COMPLETED' ||
    appointment.status === 'CANCELED' ||
    appointment.status === 'NO_SHOW'

  const clientNotification = notifications.find(
    (notification) => notification.notification_type === 'CLIENT_REMINDER'
  )

  const staffNotification = notifications.find(
    (notification) => notification.notification_type === 'STAFF_REMINDER'
  )

  return (
    <DashboardLayout title="Detalle de cita" eyebrow="Gestión de agenda">
      <section className="create-appointment-grid">
        <Card className="appointment-form-card">
          <div className="form-heading">
            <p>Información completa</p>
            <h2>{appointment.service_name}</h2>
          </div>

          <div className="appointment-summary">
            <div>
              <span>Cliente</span>
              <strong>{appointment.client_name}</strong>
            </div>

            <div>
              <span>Esteticista</span>
              <strong>
                {appointment.esthetician_name || 'Sin nombre registrado'}
              </strong>
            </div>

            <div>
              <span>Inicio</span>
              <strong>{formatDateTime(appointment.start_time)}</strong>
            </div>

            <div>
              <span>Finalización</span>
              <strong>{formatDateTime(appointment.end_time)}</strong>
            </div>

            <div>
              <span>Estado</span>
              <StatusBadge status={appointment.status} />
            </div>

            <div>
              <span>Notas</span>
              <strong>{appointment.notes || 'Sin notas'}</strong>
            </div>
          </div>
        </Card>

        <Card className="appointment-preview-card">
          <p className="preview-eyebrow">Estado actual</p>

          <div className="appointment-summary">
            <div>
              <span>Estado</span>
              <StatusBadge status={appointment.status} />
            </div>

            <div>
              <span>Inicio</span>
              <strong>{formatDateTime(appointment.start_time)}</strong>
            </div>

            <div>
              <span>Finalización</span>
              <strong>{formatDateTime(appointment.end_time)}</strong>
            </div>
          </div>

          <div className="appointment-actions">
            {!isFinalStatus && (
              <>
                <Link
                  className="create-appointment-button"
                  to={`/appointments/${appointment.id}/edit`}
                >
                  Editar cita
                </Link>

                {clientNotification && clientNotification.status !== 'SENT' && (
                  <button
                    className="secondary-appointment-button"
                    type="button"
                    onClick={() =>
                      handleSendNotification(clientNotification.id)
                    }
                    disabled={
                      sendingNotificationId === clientNotification.id
                    }
                  >
                    {sendingNotificationId === clientNotification.id
                      ? 'Enviando...'
                      : 'Enviar recordatorio al cliente'}
                  </button>
                )}

                {staffNotification && staffNotification.status !== 'SENT' && (
                  <button
                    className="secondary-appointment-button"
                    type="button"
                    onClick={() =>
                      handleSendNotification(staffNotification.id)
                    }
                    disabled={
                      sendingNotificationId === staffNotification.id
                    }
                  >
                    {sendingNotificationId === staffNotification.id
                      ? 'Enviando...'
                      : 'Enviar recordatorio a esteticista'}
                  </button>
                )}
              </>
            )}

            {appointment.status === 'PENDING' && (
              <button
                className="secondary-appointment-button"
                type="button"
                onClick={() =>
                  updateStatus('CONFIRMED', 'No se pudo confirmar la cita.')
                }
                disabled={saving}
              >
                {saving ? 'Actualizando...' : 'Confirmar cita'}
              </button>
            )}

            {!isFinalStatus && (
              <>
                <button
                  className="secondary-appointment-button"
                  type="button"
                  onClick={() =>
                    updateStatus('COMPLETED', 'No se pudo completar la cita.')
                  }
                  disabled={saving}
                >
                  Completar cita
                </button>

                <button
                  className="danger-appointment-button"
                  type="button"
                  onClick={() =>
                    updateStatus('CANCELED', 'No se pudo cancelar la cita.')
                  }
                  disabled={saving}
                >
                  Cancelar cita
                </button>

                <button
                  className="secondary-appointment-button"
                  type="button"
                  onClick={() =>
                    updateStatus(
                      'NO_SHOW',
                      'No se pudo marcar la cita como no asistida.'
                    )
                  }
                  disabled={saving}
                >
                  No asistió
                </button>
              </>
            )}

            {isFinalStatus && (
              <p className="status-copy">
                Esta cita ya fue marcada como{' '}
                {getStatusLabel(appointment.status).toLowerCase()}.
              </p>
            )}

            {error && <p className="create-appointment-error">{error}</p>}
          </div>
        </Card>
      </section>
    </DashboardLayout>
  )
}

export default AppointmentDetailPage