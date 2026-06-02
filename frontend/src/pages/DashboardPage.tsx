import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getAppointments } from '../api/appointmentsApi'
import { getClients } from '../api/clientsApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Appointment } from '../types/appointment'
import type { Client } from '../types/client'

import './DashboardPage.css'

function formatTime(dateValue: string) {
  return new Date(dateValue).toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isToday(dateValue: string) {
  const date = new Date(dateValue)
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value)
}

function DashboardPage() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [allTodayAppointments, setAllTodayAppointments] = useState<Appointment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [appointmentsData, clientsData] = await Promise.all([
          getAppointments(),
          getClients(),
        ])

        const allTodayAppointments = appointmentsData.filter((appointment) =>
          isToday(appointment.start_time)
        )

        const activeTodayAppointments = allTodayAppointments
          .filter(
            (appointment) =>
              appointment.status === 'PENDING' ||
              appointment.status === 'CONFIRMED'
          )
          .sort(
            (a, b) =>
              new Date(a.start_time).getTime() -
              new Date(b.start_time).getTime()
          )

        setAllTodayAppointments(allTodayAppointments)
        setTodayAppointments(activeTodayAppointments)
        setClients(clientsData)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const revenueAppointments = allTodayAppointments.filter(
    (appointment) =>
      appointment.status === 'COMPLETED' ||
      appointment.status === 'PENDING' ||
      appointment.status === 'CONFIRMED'
  )

  const estimatedRevenue = revenueAppointments.reduce((total, appointment) => {
    const price = Number(appointment.service_price ?? 0)
    return total + price
  }, 0)

  const activeClientsCount = clients.filter(
    (client) => client.is_active
  ).length

  const resolvedToday = allTodayAppointments.filter(
    (appointment) =>
      appointment.status === 'COMPLETED' ||
      appointment.status === 'CANCELED' ||
      appointment.status === 'NO_SHOW'
  ).length

  const completionPercentage =
    allTodayAppointments.length > 0
      ? Math.round((resolvedToday / allTodayAppointments.length) * 100)
      : 0

  return (
    <DashboardLayout>
      <section className="stats-grid">
        <Card className="stat-card">
          <p>Citas de hoy</p>
          <strong>{todayAppointments.length}</strong>
          <span>Pendientes o confirmadas</span>
        </Card>

        <Card className="stat-card">
          <p>Ingresos estimados hoy</p>
          <strong>{formatCurrency(estimatedRevenue)}</strong>
          <span>Completadas, pendientes y confirmadas</span>
        </Card>

        <Card className="stat-card">
          <p>Clientes activos</p>
          <strong>{activeClientsCount}</strong>
          <span>Registrados en el sistema</span>
        </Card>
      </section>

      <section className="dashboard-grid">
        <Card className="appointments-card">
          <div className="section-heading">
            <p>Agenda</p>
            <h2>Agenda de hoy</h2>
          </div>

          <div className="appointment-list">
            {loading && <p>Cargando citas...</p>}

            {!loading && todayAppointments.length === 0 && (
              <p>No hay citas pendientes o confirmadas para hoy.</p>
            )}

            {!loading &&
              todayAppointments.map((appointment) => (
                <article key={appointment.id}>
                  <span>{formatTime(appointment.start_time)}</span>

                  <div>
                    <Link
                      className="dashboard-appointment-link"
                      to={`/appointments/${appointment.id}`}
                    >
                      {appointment.service_name}
                    </Link>

                    <p>{appointment.client_name}</p>
                  </div>
                </article>
              ))}
          </div>
        </Card>

        <Card className="status-card">
          <div className="section-heading">
            <p>Operación</p>
            <h2>Estado del día</h2>
          </div>

          <div
            className="status-ring"
            style={{
              '--percentage': `${completionPercentage * 3.6}deg`,
            } as React.CSSProperties}
          >
            <span>{completionPercentage}%</span>
          </div>

          <p className="status-copy">
            {allTodayAppointments.length === 0
              ? 'No hay citas registradas para hoy.'
              : 'Porcentaje de citas ya resueltas. Pendientes y confirmadas quedan como restante.'}
          </p>
        </Card>
      </section>
    </DashboardLayout>
  )
}

export default DashboardPage