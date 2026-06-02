import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  getServiceById,
  updateService,
} from '../api/servicesApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Service } from '../types/service'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-CR', {
    dateStyle: 'medium',
  })
}

function ServiceDetailPage() {
  const { id } = useParams()

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadService() {
      if (!id) return

      const data = await getServiceById(id)

      setService(data)
      setLoading(false)
    }

    loadService()
  }, [id])

  async function handleToggleServiceStatus() {
        if (!service) return

        try {
            setSaving(true)
            setError('')

            const updatedService = await updateService(
            String(service.id),
            {
                is_active: !service.is_active,
            }
            )

            setService(updatedService)
        } catch {
            setError('No se pudo actualizar el estado del servicio.')
        } finally {
            setSaving(false)
        }
    }

  if (loading) {
    return (
      <DashboardLayout
        title="Detalle de servicio"
        eyebrow="Gestión de servicios"
      >
        <p>Cargando servicio...</p>
      </DashboardLayout>
    )
  }

  if (!service) {
    return (
      <DashboardLayout
        title="Detalle de servicio"
        eyebrow="Gestión de servicios"
      >
        <p>Servicio no encontrado.</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={service.name}
      eyebrow="Detalle de servicio"
      actionLabel="Editar servicio"
      actionTo={`/services/${service.id}/edit`}
    >
      <section className="create-appointment-grid">
        <Card className="appointment-form-card">
          <div className="form-heading">
            <p>Información del servicio</p>
            <h2>{service.name}</h2>
          </div>

          <div className="appointment-summary">
            <div>
              <span>Estado</span>
              <strong>
                {service.is_active ? 'Activo' : 'Inactivo'}
              </strong>
            </div>

            <div>
              <span>Duración</span>
              <strong>
                {service.duration_minutes} minutos
              </strong>
            </div>

            <div>
              <span>Precio</span>
              <strong>₡{service.price}</strong>
            </div>

            <div>
              <span>Descripción</span>
              <strong>
                {service.description || 'Sin descripción'}
              </strong>
            </div>

            <div>
              <span>Fecha de creación</span>
              <strong>
                {formatDate(service.created_at)}
              </strong>
            </div>

            <div>
              <span>Última actualización</span>
              <strong>
                {formatDate(service.updated_at)}
              </strong>
            </div>
          </div>
        </Card>

        <Card className="appointment-preview-card">
          <p className="preview-eyebrow">
            Acciones
          </p>

          <div className="appointment-actions">
            <Link
              className="create-appointment-button"
              to={`/services/${service.id}/edit`}
            >
              Editar servicio
            </Link>

            <button
                className={
                    service.is_active
                    ? 'danger-appointment-button'
                    : 'secondary-appointment-button'
                }
                type="button"
                onClick={handleToggleServiceStatus}
                disabled={saving}
                >
                {saving
                    ? 'Actualizando...'
                    : service.is_active
                    ? 'Desactivar servicio'
                    : 'Activar servicio'}
            </button>
            {error && <p className="create-appointment-error">{error}</p>}

            <Link
              className="secondary-appointment-button"
              to="/services"
            >
              Volver a servicios
            </Link>
          </div>
        </Card>
      </section>
    </DashboardLayout>
  )
}

export default ServiceDetailPage