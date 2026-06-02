import { createContext, useContext, useState } from 'react'
import { loginRequest } from '../api/authApi'

type AuthContextType = {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  )

  const isAuthenticated = Boolean(accessToken)

  async function login(username: string, password: string) {
    const data = await loginRequest({ username, password })

    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)

    setAccessToken(data.access)
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}