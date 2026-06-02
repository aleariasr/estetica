import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getAppointments } from '../api/appointmentsApi'

import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Appointment } from '../types/appointment'

import './AppointmentsPage.css'

function formatTime(dateValue: string) {
  return new Date(dateValue).toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoading(true)
        setError('')

        const data = await getAppointments()
        setAppointments(data)
      } catch {
        setError('No se pudieron cargar las citas')
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [])

  const nextAppointment = appointments[0]

  return (
    <DashboardLayout title="Citas" eyebrow="Gestión de agenda" actionLabel="Nueva cita">
      <section className="appointments-header">
        <Card className="appointments-summary-card">
          <p>Total</p>
          <strong>{appointments.length} citas</strong>
          <span>Registradas en el sistema</span>
        </Card>

        <Card className="appointments-summary-card">
          <p>Próxima cita</p>
          <strong>
            {nextAppointment ? formatTime(nextAppointment.start_time) : 'Sin citas'}
          </strong>
          <span>{nextAppointment?.service_name ?? 'No hay citas próximas'}</span>
        </Card>
      </section>

      <Card className="appointments-list-card">
        <div className="appointments-list-heading">
          <div>
            <p>Agenda</p>
            <h2>Citas registradas</h2>
          </div>

          <button>Filtrar</button>
        </div>

        {loading && <p className="appointments-state">Cargando citas...</p>}

        {error && <p className="appointments-state error">{error}</p>}

        {!loading && !error && appointments.length === 0 && (
          <p className="appointments-state">No hay citas registradas todavía.</p>
        )}

        {!loading && !error && appointments.length > 0 && (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <article className="appointment-item" key={appointment.id}>
                <div className="appointment-time">
                  <strong>{formatTime(appointment.start_time)}</strong>
                </div>

                <div className="appointment-info">
                  <Link
                    className="appointment-title-link"
                    to={`/appointments/${appointment.id}`}
                  >
                    {appointment.service_name ?? 'Servicio sin nombre'}
                  </Link>

                  <p>{appointment.client_name ?? 'Cliente sin nombre'}</p>
                </div>

                <StatusBadge status={appointment.status} />

                <Link
                  className="appointment-action"
                  to={`/appointments/${appointment.id}/edit`}
                >
                  Editar
                </Link>
              </article>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}

export default AppointmentsPage