import { useState, useEffect } from 'react'
import './ProfileScreen.css'

function ProfileScreen() {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarPerfil()
  }, [])

  const cargarPerfil = async () => {
    try {
      const response = await fetch('/api/usuario/user-1')
      const data = await response.json()
      setUsuario(data)
      setLoading(false)
    } catch (err) {
      console.error('Error al cargar perfil:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">
          {usuario.nombre.charAt(0).toUpperCase()}
        </div>
        <h2 className="profile-name">{usuario.nombre}</h2>
        <p className="profile-subtitle">Miembro activo</p>
      </div>

      <div className="streak-card">
        <div className="streak-flame">🔥</div>
        <div className="streak-number">{usuario.racha}</div>
        <div className="streak-label">días de racha</div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">⚙️ Configuración</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">🔔</span>
            <div>
              <div className="setting-label">Notificaciones</div>
              <div className="setting-description">Recibe alertas diarias</div>
            </div>
          </div>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={usuario.notificacionesActivas}
              readOnly
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">🕐</span>
            <div>
              <div className="setting-label">Horario activo</div>
              <div className="setting-description">{usuario.horaInicio} - {usuario.horaFin}</div>
            </div>
          </div>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-icon">📚</span>
            <div>
              <div className="setting-label">Temarios activos</div>
              <div className="setting-description">{usuario.temarios.length} temarios</div>
            </div>
          </div>
        </div>
      </div>

      <div className="temarios-section">
        <h3 className="section-title">📚 Mis Temarios</h3>
        <div className="temario-card">
          <div className="temario-icon">🎨</div>
          <div className="temario-info">
            <div className="temario-name">Historia del Arte</div>
            <div className="temario-progress">5 preguntas completadas</div>
          </div>
        </div>
      </div>

      <div className="achievements-section">
        <h3 className="section-title">🏆 Logros</h3>
        <div className="achievements-grid">
          <div className="achievement unlocked">
            <div className="achievement-icon">🌟</div>
            <div className="achievement-name">Primer paso</div>
          </div>
          <div className="achievement unlocked">
            <div className="achievement-icon">🔥</div>
            <div className="achievement-name">Racha de 5</div>
          </div>
          <div className="achievement locked">
            <div className="achievement-icon">💎</div>
            <div className="achievement-name">Racha de 10</div>
          </div>
          <div className="achievement locked">
            <div className="achievement-icon">👑</div>
            <div className="achievement-name">Maestro</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileScreen
