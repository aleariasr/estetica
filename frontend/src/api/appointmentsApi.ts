import api from './axios'

import type { Appointment } from '../types/appointment'

export type CreateAppointmentData = {
  client: number
  esthetician: number
  service: number
  start_time: string
  notes?: string
}

export async function getAppointments() {
  const response = await api.get<Appointment[]>('/appointments/')
  return response.data
}

export async function createAppointment(data: CreateAppointmentData) {
  const response = await api.post<Appointment>('/appointments/', data)
  return response.data
}

export async function getAppointmentById(id: string) {
  const response = await api.get<Appointment>(`/appointments/${id}/`)
  return response.data
}

export type UpdateAppointmentData = Partial<CreateAppointmentData> & {
  status?: Appointment['status']
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentData
) {
  const response = await api.patch<Appointment>(`/appointments/${id}/`, data)
  return response.data
}

export async function getAppointmentsByClient(clientId: string) {
  const appointments = await getAppointments()

  return appointments.filter(
    (appointment) => appointment.client === Number(clientId)
  )
}

export async function getAvailableSlots({
  esthetician,
  service,
  date,
}: {
  esthetician: string
  service: string
  date: string
}) {
  const response = await api.get<string[]>('/appointments/available-slots/', {
    params: {
      esthetician,
      service,
      date,
    },
  })

  return response.data
}