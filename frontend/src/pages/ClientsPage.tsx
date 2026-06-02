import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getClients } from '../api/clientsApi'

import Card from '../components/ui/Card'
import DashboardLayout from '../layouts/DashboardLayout'

import type { Client } from '../types/client'

import './ClientsPage.css'

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients()
        setClients(data)
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  return (
    <DashboardLayout
        title="Clientes"
        eyebrow="Gestión de clientes"
        actionLabel="Nuevo cliente"
        actionTo="/clients/new"
    >
      <Card className="clients-card">
        <div className="clients-heading">
          <div>
            <p>Directorio</p>
            <h2>Clientes registrados</h2>
          </div>
        </div>

        {loading && (
          <p className="clients-state">
            Cargando clientes...
          </p>
        )}

        {!loading && clients.length === 0 && (
          <p className="clients-state">
            No hay clientes registrados.
          </p>
        )}

        {!loading && clients.length > 0 && (
          <div className="clients-list">
            {clients.map((client) => (
              <article
                className="client-item"
                key={client.id}
              >
                <div className="client-info">
                  <h3>
                    {client.first_name} {client.last_name}
                  </h3>

                  <p>{client.phone}</p>

                  <p>{client.email}</p>
                </div>

                <div className="client-meta">
                  <span
                    className={
                      client.is_active
                        ? 'client-status active'
                        : 'client-status inactive'
                    }
                  >
                    {client.is_active ? 'Activo' : 'Inactivo'}
                  </span>

                  <div className="client-actions">
                        <Link
                            className="client-action"
                            to={`/clients/${client.id}`}
                        >
                            Ver
                        </Link>

                        <Link
                            className="client-action"
                            to={`/clients/${client.id}/edit`}
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

export default ClientsPage