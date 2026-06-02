import api from './axios'

import type { User } from '../types/user'

export async function getEstheticians() {
  const response = await api.get<User[]>('/estheticians/')
  return response.data
}