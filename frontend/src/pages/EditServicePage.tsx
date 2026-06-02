import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getServiceById,
  updateService,
} from '../api/servicesApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

function EditServicePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [price, setPrice] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [error, setError] = useState('')

  useEffect(() => {
    async function loadService() {
      if (!id) return

      const service = await getServiceById(id)

      setName(service.name)
      setDescription(service.description ?? '')
      setDurationMinutes(String(service.duration_minutes))
      setPrice(service.price)
      setIsActive(service.is_active)

      setLoading(false)
    }

    loadService()
  }, [id])

  async function handleUpdateService() {
    if (!id) return

    if (!name || !durationMinutes || !price) {
      setError('Nombre, duración y precio son obligatorios.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await updateService(id, {
        name,
        description,
        duration_minutes: Number(durationMinutes),
        price,
        is_active: isActive,
      })

      navigate(`/services/${id}`)
    } catch {
      setError('No se pudo actualizar el servicio.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Editar servicio"
        eyebrow="Gestión de servicios"
      >
        <p>Cargando servicio...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Editar servicio"
      eyebrow="Gestión de servicios"
      actionLabel="Volver"
      actionTo={`/services/${id}`}
    >
      <Card className="appointment-form-card">
        <div className="form-heading">
          <p>Edición</p>
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

          <label className="ui-field">
            <span>Estado</span>

            <select
              value={isActive ? 'active' : 'inactive'}
              onChange={(e) => setIsActive(e.target.value === 'active')}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </label>

          <button
            className="create-appointment-button"
            type="button"
            onClick={handleUpdateService}
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

export default EditServicePage