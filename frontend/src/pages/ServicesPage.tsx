import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getServices } from '../api/servicesApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Service } from '../types/service'

import './ServicesPage.css'

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices()
        setServices(data)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  return (
    <DashboardLayout
      title="Servicios"
      eyebrow="Gestión de servicios"
      actionLabel="Nuevo servicio"
      actionTo="/services/new"
    >
      <Card className="services-card">
        <div className="services-heading">
          <div>
            <p>Catálogo</p>
            <h2>Servicios disponibles</h2>
          </div>
        </div>

        {loading && (
          <p className="services-state">
            Cargando servicios...
          </p>
        )}

        {!loading && services.length === 0 && (
          <p className="services-state">
            No hay servicios registrados.
          </p>
        )}

        {!loading && services.length > 0 && (
          <div className="services-list">
            {services.map((service) => (
              <article
                className="service-item"
                key={service.id}
              >
                <div className="service-info">
                  <h3>{service.name}</h3>

                  <p>{service.description}</p>

                  <p>
                    {service.duration_minutes} min · ₡{service.price}
                  </p>
                </div>

                <div className="service-meta">
                  <span
                    className={
                      service.is_active
                        ? 'service-status active'
                        : 'service-status inactive'
                    }
                  >
                    {service.is_active ? 'Activo' : 'Inactivo'}
                  </span>

                  <div className="service-actions">
                    <Link
                      className="service-action"
                      to={`/services/${service.id}`}
                    >
                      Ver
                    </Link>

                    <Link
                      className="service-action"
                      to={`/services/${service.id}/edit`}
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}

export default ServicesPage