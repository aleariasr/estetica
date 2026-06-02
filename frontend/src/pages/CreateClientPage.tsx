import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createClient } from '../api/clientsApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

function CreateClientPage() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateClient() {
    if (!firstName || !lastName || !phone) {
      setError('Nombre, apellido y teléfono son obligatorios.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await createClient({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        notes,
      })

      navigate('/clients')
    } catch {
      setError('No se pudo crear el cliente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout
        title="Nuevo cliente"
        eyebrow="Gestión de clientes"
        actionLabel="Volver"
        actionTo="/clients"
    >
      <Card className="appointment-form-card">
        <div className="form-heading">
          <p>Registro</p>
          <h2>Información del cliente</h2>
        </div>

        <div className="appointment-form">
          <label className="ui-field">
            <span>Nombre</span>

            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label className="ui-field">
            <span>Apellido</span>

            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>

          <label className="ui-field">
            <span>Teléfono</span>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label className="ui-field">
            <span>Correo</span>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="ui-field">
            <span>Notas</span>

            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <button
            className="create-appointment-button"
            type="button"
            onClick={handleCreateClient}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Crear cliente'}
          </button>

          {error && (
            <p className="create-appointment-error">
              {error}
            </p>
          )}
        </div>
      </Card>
    </DashboardLayout>
  )
}

export default CreateClientPage