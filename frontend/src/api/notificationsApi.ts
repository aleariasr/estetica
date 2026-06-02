import api from './axios'

import type { Notification } from '../types/notification'

export async function getNotifications() {
  const response = await api.get<Notification[]>(
    '/notifications/'
  )

  return response.data
}

export async function sendNotificationNow(
  id: string
) {
  const response = await api.post<Notification>(
    `/notifications/${id}/send-now/`
  )

  return response.data
}

export async function getNotificationsByAppointment(appointmentId: string) {
  const notifications = await getNotifications()

  return notifications.filter(
    (notification) => notification.appointment === Number(appointmentId)
  )
}