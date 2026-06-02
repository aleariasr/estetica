import api from './axios'

type LoginCredentials = {
  username: string
  password: string
}

type LoginResponse = {
  access: string
  refresh: string
}

export async function loginRequest(credentials: LoginCredentials) {
  const response = await api.post<LoginResponse>('/token/', credentials)
  return response.data
}