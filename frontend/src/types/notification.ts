export type Notification = {
  id: number
  appointment: number
  recipient: string
  message: string

  channel: 'EMAIL' | 'WHATSAPP' | 'SYSTEM'

  status: 'PENDING' | 'SENT' | 'FAILED'

  notification_type:
    | 'CLIENT_REMINDER'
    | 'STAFF_REMINDER'

  scheduled_for: string
  sent_at: string | null

  appointment_client?: string
  appointment_service?: string
  appointment_start_time?: string
}