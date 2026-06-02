import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'

import { getAppointments } from '../api/appointmentsApi'

import { getEstheticians } from '../api/estheticiansApi'
import type { User } from '../types/user'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Appointment } from '../types/appointment'

import './CalendarPage.css'

function getStatusColor(status: Appointment['status']) {
  const colors: Record<Appointment['status'], string> = {
    PENDING: '#6f6f6f',
    CONFIRMED: '#004c99',
    COMPLETED: '#007848',
    CANCELED: '#c62828',
    NO_SHOW: '#333333',
  }

  return colors[status]
}

function CalendarPage() {
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  
  const [estheticians, setEstheticians] = useState<User[]>([])
  const [selectedEsthetician, setSelectedEsthetician] = useState('')

  useEffect(() => {
    async function loadAppointments() {
      try {
        const [appointmentsData, estheticiansData] = await Promise.all([
        getAppointments(),
        getEstheticians(),
        ])

        setAppointments(appointmentsData)
        setEstheticians(estheticiansData)
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [])

  const filteredAppointments = selectedEsthetician
  ? appointments.filter(
      (appointment) =>
        appointment.esthetician === Number(selectedEsthetician)
    )
  : appointments

  const events = filteredAppointments.map((appointment) => ({
    id: String(appointment.id),
    title: `${appointment.service_name} · ${appointment.client_name}`,
    start: appointment.start_time,
    end: appointment.end_time,
    backgroundColor: getStatusColor(appointment.status),
    borderColor: getStatusColor(appointment.status),
    extendedProps: {
      status: appointment.status,
      client: appointment.client_name,
      service: appointment.service_name,
      esthetician: appointment.esthetician_name,
    },
  }))

  function handleEventClick(eventInfo: EventClickArg) {
    navigate(`/appointments/${eventInfo.event.id}`)
  }

  return (
    <DashboardLayout
      title="Calendario"
      eyebrow="Agenda visual"
      actionLabel="Nueva cita"
      actionTo="/appointments/new"
    >
      <Card className="calendar-card">
        <div className="calendar-heading">
          <div>
            <p>Agenda</p>
            <h2>Calendario de citas</h2>
          </div>

          {loading && <span>Cargando...</span>}

            <select
                className="calendar-filter"
                value={selectedEsthetician}
                onChange={(e) => setSelectedEsthetician(e.target.value)}
                >
                <option value="">Todas las esteticistas</option>

                {estheticians.map((esthetician) => (
                    <option key={esthetician.id} value={esthetician.id}>
                    {esthetician.full_name}
                    </option>
                ))}
            </select>
        </div>

        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          locale="es"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          nowIndicator
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          expandRows
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
          }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
        />
      </Card>
    </DashboardLayout>
  )
}

export default CalendarPage