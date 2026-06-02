import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getClientById,
  updateClient,
} from '../api/clientsApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

function EditClientPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const [error, setError] = useState('')

  useEffect(() => {
    async function loadClient() {
      if (!id) return

      const client = await getClientById(id)

      setFirstName(client.first_name)
      setLastName(client.last_name)
      setPhone(client.phone)
      setEmail(client.email ?? '')
      setNotes(client.notes ?? '')

      setLoading(false)
    }

    loadClient()
  }, [id])

  async function handleUpdateClient() {
    if (!id) return

    try {
      setSaving(true)
      setError('')

      await updateClient(id, {
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        notes,
      })

      navigate(`/clients/${id}`)
    } catch {
      setError('No se pudo actualizar el cliente.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Editar cliente"
        eyebrow="Gestión de clientes"
      >
        <p>Cargando cliente...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Editar cliente"
      eyebrow="Gestión de clientes"
      actionLabel="Volver"
      actionTo={`/clients/${id}`}
    >
      <Card className="appointment-form-card">
        <div className="form-heading">
          <p>Edición</p>
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
            onClick={handleUpdateClient}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
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

export default EditClientPage