
import { useState } from 'react'

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TriangleAlert,
  History,
  Users,
  Menu,
  Bell,
  Wallet,
  ArrowUpRight,
  ChevronRight,
  CalendarDays,
  ShieldCheck,
  HeartPulse,
  LogOut,
  ClipboardList,
  Plus,
} from 'lucide-react'

import '../styles/Dashboard.css'


const opciones = [
  { id: 'inicio', nombre: 'Inicio', icono: LayoutDashboard },
  { id: 'inventario', nombre: 'Inventario', icono: Package },
  { id: 'ventas', nombre: 'Punto de venta', icono: ShoppingCart },
  { id: 'alertas', nombre: 'Alertas', icono: TriangleAlert },
  { id: 'historial', nombre: 'Historial', icono: History },
  { id: 'usuarios', nombre: 'Usuarios', icono: Users },
]

const estadisticas = [
  {
    titulo: 'Ventas Del Día',
    valor: 'S/ 0.00',
    icono: Wallet,
    color: 'turquesa',
  },
  {
    titulo: 'Productos registrados',
    valor: '0',
    icono: Package,
    color: 'azul',
  },
  {
    titulo: 'Alertas de stock',
    valor: '0',
    icono: TriangleAlert,
    color: 'rojo',
  },
  {
    titulo: 'Ventas realizadas',
    valor: '0',
    icono: ShoppingCart,
    color: 'morado',
  },
]

function Dashboard() {
  const [seccion, setSeccion] = useState('inicio')
  const [menuAbierto, setMenuAbierto] = useState(false)

  const seleccionar = (id) => {
    setSeccion(id)
    setMenuAbierto(false)
  }

  const opcionActual = opciones.find(
    (opcion) => opcion.id === seccion
  )

  const fecha = new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div className="pf-dashboard">

      {/* Fondo del menú en celulares */}
      {menuAbierto && (
        <button
          className="pf-dash-overlay"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
        />
      )}

      {/* MENÚ LATERAL */}
      <aside className={
        `pf-dash-sidebar ${menuAbierto ? 'abierto' : ''}`
      }>
        <div className="pf-dash-brand">
          <img
            src="/Logo-PeruFarma.png"
            alt="PeruFarma"
          />
          <p>SISTEMA DE GESTIÓN</p>
        </div>

        <div className="pf-dash-nav-title">
          MENÚ PRINCIPAL
        </div>

        <nav className="pf-dash-nav" aria-label="Menú principal">
          {opciones.map((opcion) => {
            const Icono = opcion.icono

            return (
              <button
                key={opcion.id}
                type="button"
                className={
                  `pf-dash-nav-item ${
                    seccion === opcion.id ? 'activo' : ''
                  }`
                }
                aria-current={
                  seccion === opcion.id ? 'page' : undefined
                }
                onClick={() => seleccionar(opcion.id)}
              >
                <Icono size={20} strokeWidth={1.9} />
                <span>{opcion.nombre}</span>

                {seccion === opcion.id && (
                  <ChevronRight size={17} className="pf-dash-chevron" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="pf-dash-sidebar-bottom">
          <div className="pf-dash-help">
            <HeartPulse size={23} />
            <div>
              <strong>PeruFarma</strong>
              <span>Tu salud, nuestra prioridad.</span>
            </div>
          </div>

          <a className="pf-dash-logout" href="/">
            <LogOut size={18} />
            Volver al Login
          </a>

          <p className="pf-dash-copyright">
            © {new Date().getFullYear()} PeruFarma
          </p>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="pf-dash-main">

        {/* BARRA SUPERIOR */}
        <header className="pf-dash-topbar">
          <div className="pf-dash-top-left">
            <button
              type="button"
              className="pf-dash-menu-button"
              aria-label="Abrir menú"
              onClick={() => setMenuAbierto(true)}
            >
              <Menu size={23} />
            </button>

            <div className="pf-dash-breadcrumb">
              <span>PeruFarma</span>
              <ChevronRight size={15} />
              <strong>{opcionActual.nombre}</strong>
            </div>
          </div>

          <div className="pf-dash-top-right">
            <span className="pf-dash-demo-chip">
              Vista de demostración
            </span>

            <div className="pf-dash-user">
              <div className="pf-dash-avatar">A</div>
              <div className="pf-dash-user-info">
                <strong>Administrador</strong>
                <span>Vista de prueba</span>
              </div>
            </div>
          </div>
        </header>

        <main className="pf-dash-content">
          {seccion === 'inicio' ? (
            <>
              {/* BIENVENIDA */}
              <section className="pf-dash-welcome">
                <div>
                  <div className="pf-dash-eyebrow">
                    <span className="pf-dash-status-dot" />
                    PANEL DE CONTROL
                  </div>

                  <h1>
                    Bienvenido a <span>PeruFarma</span>
                  </h1>

            
                </div>

                <div className="pf-dash-date">
                  <CalendarDays size={18} />
                  <span>{fecha}</span>
                </div>
              </section>

              {/* RESUMEN */}
              <div className="pf-dash-section-heading">
                <div>
                  <h2>Resumen General</h2>
                  
                </div>
              </div>

              <section className="pf-dash-stats">
                {estadisticas.map((dato) => {
                  const Icono = dato.icono

                  return (
                    <article
                      key={dato.titulo}
                      className="pf-dash-stat-card"
                    >
                      <div className="pf-dash-stat-head">
                        <div className={
                          `pf-dash-stat-icon ${dato.color}`
                        }>
                          <Icono size={23} />
                        </div>

                        <ArrowUpRight
                          size={18}
                          className="pf-dash-stat-arrow"
                        />
                      </div>

                      <p className="pf-dash-stat-title">
                        {dato.titulo}
                      </p>

                      <h3>{dato.valor}</h3>

                      <span className="pf-dash-stat-detail">
                        {dato.detalle}
                      </span>
                    </article>
                  )
                })}
              </section>

              {/* PANELES INFERIORES */}
              <div className="pf-dash-panels">

                <section className="pf-dash-panel">
                  <div className="pf-dash-panel-header">
                    <div>
                      <h2>Ventas recientes</h2>
                      <p>Últimas operaciones registradas</p>
                    </div>
                    <div className="pf-dash-panel-icon">
                      <History size={20} />
                    </div>
                  </div>

                  <div className="pf-dash-empty">
                    <div className="pf-dash-empty-icon">
                      <ClipboardList size={29} />
                    </div>
                    <h3>Aún no hay ventas</h3>
                    <p>
                      Las operaciones aparecerán aquí
                      cuando conectemos el sistema.
                    </p>
                    <button
                      type="button"
                      onClick={() => seleccionar('ventas')}
                    >
                      Ir a punto de venta
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </section>

                <section className="pf-dash-panel">
                  <div className="pf-dash-panel-header">
                    <div>
                      <h2>Control de inventario</h2>
                    </div>

                    <div className="pf-dash-panel-icon">
                      <Package size={20} />
                    </div>
                  </div>

                  <div className="pf-dash-inventory-list">
                    <div className="pf-dash-inventory-row">
                      <div className="pf-dash-mini-icon turquesa">
                        <Package size={19} />
                      </div>
                      <div>
                        <strong>Medicamentos</strong>
                        <span>Productos registrados</span>
                      </div>
                      <b>0</b>
                    </div>

                    <div className="pf-dash-inventory-row">
                      <div className="pf-dash-mini-icon rojo">
                        <TriangleAlert size={19} />
                      </div>
                      <div>
                        <strong>Stock bajo</strong>
                        <span>Requieren reposición</span>
                      </div>
                      <b>0</b>
                    </div>

                    <div className="pf-dash-inventory-row">
                      <div className="pf-dash-mini-icon azul">
                        <ShieldCheck size={19} />
                      </div>
                      <div>
                        <strong>Control de productos</strong>
                        <span>Módulo en preparación</span>
                      </div>
                      <ChevronRight size={17} />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="pf-dash-outline-button"
                    onClick={() => seleccionar('inventario')}
                  >
                    Ver inventario
                    <ArrowUpRight size={17} />
                  </button>
                </section>
              </div>

              {/* ACCESOS RÁPIDOS */}
              <section className="pf-dash-quick">
                <div className="pf-dash-section-heading">
                  <div>
                    <h2>Accesos rápidos</h2>
                  </div>
                </div>

                <div className="pf-dash-quick-grid">
                  <button
                    type="button"
                    onClick={() => seleccionar('ventas')}
                  >
                    <span className="pf-dash-quick-icon turquesa">
                      <ShoppingCart size={21} />
                    </span>
                    <strong>Punto de venta</strong>
                    <ChevronRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => seleccionar('inventario')}
                  >
                    <span className="pf-dash-quick-icon azul">
                      <Plus size={21} />
                    </span>
                    <strong>Inventario</strong>
                    <ChevronRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => seleccionar('alertas')}
                  >
                    <span className="pf-dash-quick-icon rojo">
                      <Bell size={21} />
                    </span>
                    <strong>Ver alertas</strong>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </section>

              <p className="pf-dash-demo-note">
                Esta es una vista previa. Los datos son de demostración
                y todavía no están conectados a Node.js.
              </p>
            </>
          ) : (
            /* PANTALLA TEMPORAL DE LOS DEMÁS MÓDULOS */
            <section className="pf-dash-module">
              <div className="pf-dash-module-icon">
                {(() => {
                  const Icono = opcionActual.icono
                  return <Icono size={40} />
                })()}
              </div>

              <h1>{opcionActual.nombre}</h1>

              <p>
                Estamos preparando este módulo para PeruFarma.
                Próximamente conectaremos sus funcionalidades
                al servidor Node.js y a la base de datos.
              </p>

              <button
                type="button"
                onClick={() => seleccionar('inicio')}
              >
                <LayoutDashboard size={18} />
                Volver al inicio
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
