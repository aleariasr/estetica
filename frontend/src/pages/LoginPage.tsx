import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../auth/AuthContext'

import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()

  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      await login(username, password)

      navigate('/dashboard')
    } catch {
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <Card className="login-card">
        <div className="login-brand">
          <span className="brand-mark">E</span>
          <p>EsteticaPro</p>
        </div>

        <div className="login-content">
          <p className="eyebrow">Sistema profesional de citas</p>

          <h1>Gestiona tu estética con claridad.</h1>

          <p className="subtitle">
            Agenda, clientes, servicios y recordatorios en una plataforma limpia,
            rápida y preparada para crecer.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            label="Usuario"
            placeholder="nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="login-error">{error}</p>}

          <Button type="submit">
            {loading ? 'Ingresando...' : 'Ingresar al sistema'}
          </Button>
        </form>
      </Card>

      <section className="login-preview">
        <Card className="preview-card glass">
          <p className="preview-label">Hoy</p>
          <h2>12 citas</h2>
          <span>₡185.000 estimados</span>
        </Card>

        <Card className="preview-card floating">
          <p>Próxima cita</p>
          <strong>10:30 AM</strong>
          <span>Limpieza facial profunda</span>
        </Card>
      </section>
    </main>
  )
}

export default LoginPage