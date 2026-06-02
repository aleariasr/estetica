import api from './axios'

import type { Client } from '../types/client'

export type CreateClientData = {
  first_name: string
  last_name: string
  phone: string
  email?: string
  notes?: string
  is_active?: boolean
}

export type UpdateClientData = Partial<CreateClientData>

export async function getClients() {
  const response = await api.get<Client[]>('/clients/')
  return response.data
}

export async function getClientById(id: string) {
  const response = await api.get<Client>(`/clients/${id}/`)
  return response.data
}

export async function createClient(data: CreateClientData) {
  const response = await api.post<Client>('/clients/', data)
  return response.data
}

export async function updateClient(id: string, data: UpdateClientData) {
  const response = await api.patch<Client>(`/clients/${id}/`, data)
  return response.data
}