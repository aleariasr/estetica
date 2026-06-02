import { useEffect, useState } from 'react'

import {
  getNotifications,
  sendNotificationNow,
} from '../api/notificationsApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Notification } from '../types/notification'

import './NotificationsPage.css'

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getStatusLabel(status: Notification['status']) {
  const labels = {
    PENDING: 'Pendiente',
    SENT: 'Enviada',
    FAILED: 'Fallida',
  }

  return labels[status]
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<number | null>(null)

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await getNotifications()
        setNotifications(data)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  async function handleSendNow(notificationId: number) {
    try {
      setSendingId(notificationId)

      const updatedNotification =
        await sendNotificationNow(String(notificationId))

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? updatedNotification
            : notification
        )
      )
    } finally {
      setSendingId(null)
    }
  }

  return (
    <DashboardLayout
      title="Notificaciones"
      eyebrow="Centro de recordatorios"
    >
      <Card className="notifications-card">
        <div className="notifications-heading">
          <div>
            <p>Recordatorios</p>
            <h2>Notificaciones programadas</h2>
          </div>
        </div>

        {loading && (
          <p className="notifications-state">
            Cargando notificaciones...
          </p>
        )}

        {!loading && notifications.length === 0 && (
          <p className="notifications-state">
            No hay notificaciones registradas.
          </p>
        )}

        {!loading && notifications.length > 0 && (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className="notification-item"
              >
                <div className="notification-info">
                  <h3>
                    {notification.appointment_service}
                  </h3>

                  <p>
                    {notification.appointment_client}
                  </p>

                  <span>
                    {formatDateTime(
                      notification.appointment_start_time ??
                        notification.scheduled_for
                    )}
                  </span>

                  <small>
                    {notification.recipient}
                  </small>
                </div>

                <div className="notification-meta">
                  <span
                    className={`notification-status ${notification.status.toLowerCase()}`}
                  >
                    {getStatusLabel(notification.status)}
                  </span>

                  {notification.status !== 'SENT' && (
                    <button
                      className="create-appointment-button"
                      onClick={() =>
                        handleSendNow(notification.id)
                      }
                      disabled={
                        sendingId === notification.id
                      }
                    >
                      {sendingId === notification.id
                        ? 'Enviando...'
                        : 'Enviar ahora'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}

export default NotificationsPage