import type { Appointment } from '../../types/appointment'

import './ui.css'

type StatusBadgeProps = {
  status: Appointment['status']
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

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge-${status.toLowerCase()}`}>
      {getStatusLabel(status)}
    </span>
  )
}

export default StatusBadge