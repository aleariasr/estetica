import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createService } from '../api/servicesApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

function CreateServicePage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [price, setPrice] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateService() {
    if (!name || !durationMinutes || !price) {
      setError('Nombre, duración y precio son obligatorios.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await createService({
        name,
        description,
        duration_minutes: Number(durationMinutes),
        price,
      })

      navigate('/services')
    } catch {
      setError('No se pudo crear el servicio.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout
      title="Nuevo servicio"
      eyebrow="Gestión de servicios"
      actionLabel="Volver"
      actionTo="/services"
    >
      <Card className="appointment-form-card">
        <div className="form-heading">
          <p>Registro</p>
          <h2>Información del servicio</h2>
        </div>

        <div className="appointment-form">
          <label className="ui-field">
            <span>Nombre</span>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="ui-field">
            <span>Descripción</span>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className="ui-field">
            <span>Duración en minutos</span>

            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </label>

          <label className="ui-field">
            <span>Precio</span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>

          <button
            className="create-appointment-button"
            type="button"
            onClick={handleCreateService}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Crear servicio'}
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

export default CreateServicePage