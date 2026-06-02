export type User = {
  id: number
  username: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  telefono: string | null
  role: 'ADMIN' | 'ESTETICISTA' | 'RECEPCIONISTA'
  is_active: boolean
}