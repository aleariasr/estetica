import api from './axios'

import type { Service } from '../types/service'

export type CreateServiceData = {
  name: string
  description?: string
  duration_minutes: number
  price: string
  is_active?: boolean
}

export type UpdateServiceData = Partial<CreateServiceData>

export async function getServices() {
  const response = await api.get<Service[]>('/services/')
  return response.data
}

export async function getServiceById(id: string) {
  const response = await api.get<Service>(`/services/${id}/`)
  return response.data
}

export async function createService(data: CreateServiceData) {
  const response = await api.post<Service>('/services/', data)
  return response.data
}

export async function updateService(id: string, data: UpdateServiceData) {
  const response = await api.patch<Service>(`/services/${id}/`, data)
  return response.data
}