export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELED'
  | 'NO_SHOW'

export type Appointment = {
  id: number

  client: number
  service: number
  esthetician: number

  client_name: string
  service_name: string
  esthetician_name: string

  start_time: string
  end_time: string

  status: AppointmentStatus
  notes: string

  created_at: string
  updated_at: string

  service_price?: string
}