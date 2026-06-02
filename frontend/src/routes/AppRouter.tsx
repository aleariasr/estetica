import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '../auth/ProtectedRoute'

import AppointmentsPage from '../pages/AppointmentsPage'
import DashboardPage from '../pages/DashboardPage'
import LoginPage from '../pages/LoginPage'
import CreateAppointmentPage from '../pages/CreateAppointmentPage'
import EditAppointmentPage from '../pages/EditAppointmentPage'
import AppointmentDetailPage from '../pages/AppointmentDetailPage'

import ClientsPage from '../pages/ClientsPage'
import ClientDetailPage from '../pages/ClientDetailPage'
import CreateClientPage from '../pages/CreateClientPage'
import EditClientPage from '../pages/EditClientPage'

import ServicesPage from '../pages/ServicesPage'
import CreateServicePage from '../pages/CreateServicePage'
import EditServicePage from '../pages/EditServicePage'
import ServiceDetailPage from '../pages/ServiceDetailPage'

import CalendarPage from '../pages/CalendarPage'

import NotificationsPage from '../pages/NotificationsPage'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/new"
          element={
            <ProtectedRoute>
              <CreateAppointmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:id"
          element={
            <ProtectedRoute>
              <AppointmentDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments/:id/edit"
          element={
            <ProtectedRoute>
              <EditAppointmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <ClientDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <CreateClientPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients/:id/edit"
          element={
            <ProtectedRoute>
              <EditClientPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/new"
          element={
            <ProtectedRoute>
              <CreateServicePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/:id"
          element={
            <ProtectedRoute>
              <ServiceDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/:id/edit"
          element={
            <ProtectedRoute>
              <EditServicePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter