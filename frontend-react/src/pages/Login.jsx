
import { useState } from 'react'
import '../styles/Login.css'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [mostrarClave, setMostrarClave] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const iniciarSesion = (e) => {
    e.preventDefault()

    // La autenticación real se implementará con Node.js.
    setMensaje('El acceso estará disponible al conectar el servidor.')
  }

  return (
    <main className="pf-login-page">
      <section className="pf-login-card">

        {/* Logo PeruFarma */}
        <div className="pf-login-brand">
          <img
            src="/Logo-PeruFarma.png"
            alt="PeruFarma"
            className="pf-login-logo"
          />
        </div>

        {/* Formulario */}
        <div className="pf-login-content">
          <div className="pf-login-inner">

            <h1>Bienvenido</h1>
            <p className="pf-login-subtitle">
              Ingresa a tu cuenta de PeruFarma.
            </p>

            <form onSubmit={iniciarSesion}>

              <div className="pf-field">
                <label htmlFor="usuario">Usuario</label>
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  onChange={(e) => {
                    setUsuario(e.target.value)
                    setMensaje('')
                  }}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="pf-field">
                <label htmlFor="clave">Clave</label>

                <div className="pf-password-field">
                  <input
                    id="clave"
                    name="clave"
                    type={mostrarClave ? 'text' : 'password'}
                    placeholder="Ingresa tu clave"
                    value={clave}
                    onChange={(e) => {
                      setClave(e.target.value)
                      setMensaje('')
                    }}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="pf-show-password"
                    onClick={() => setMostrarClave(!mostrarClave)}
                    aria-label={
                      mostrarClave ? 'Ocultar clave' : 'Mostrar clave'
                    }
                  >
                    {mostrarClave ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <button type="submit" className="pf-login-button">
                <span>Iniciar sesión</span>
                <span aria-hidden="true">→</span>
              </button>

              {mensaje && (
                <div className="pf-login-notice" role="status">
                  {mensaje}
                </div>
              )}

            </form>

            <footer className="pf-login-footer">
              © 2026 PeruFarma · Sistema de gestión
            </footer>

          </div>
        </div>

      </section>
    </main>
  )
}

export default Login
