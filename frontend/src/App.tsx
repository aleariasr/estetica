import { AuthProvider } from './auth/AuthContext'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <AppRouter />
      </div>
    </AuthProvider>
  )
}

export default App