import { NavLink, useNavigate, Link } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'

import './DashboardLayout.css'

type DashboardLayoutProps = {
  children: React.ReactNode
  title?: string
  eyebrow?: string
  actionLabel?: string
  actionTo?: string
}

function DashboardLayout({
  children,
  title = 'Resumen de hoy',
  eyebrow = 'Panel de control',
  actionLabel = 'Nueva cita',
  actionTo = '/appointments/new',
}: DashboardLayoutProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>E</span>
          <p>EsteticaPro</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/calendar">Calendario</NavLink>
          <NavLink to="/appointments">Citas</NavLink>
          <NavLink to="/clients">Clientes</NavLink>
          <NavLink to="/services">Servicios</NavLink>
          <NavLink to="/notifications">Notificaciones</NavLink>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="topbar-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
          </div>

          <Link
            to={actionTo}
            className="topbar-action"
          >
            {actionLabel}
          </Link>
        </header>

        {children}
      </main>
    </div>
  )
}

export default DashboardLayout