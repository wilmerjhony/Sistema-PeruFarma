
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const ruta = window.location.pathname

  if (ruta === '/dashboard-demo') {
    return <Dashboard />
  }

  return <Login />
}

export default App
