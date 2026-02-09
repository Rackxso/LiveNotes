import { useState, useEffect } from 'react'
import './StatsScreen.css'

function StatsScreen() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarEstadisticas()
  }, [])

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch('/api/estadisticas-dia')
      const data = await response.json()
      setStats(data)
      setLoading(false)
    } catch (err) {
      console.error('Error al cargar estadísticas:', err)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="stats-container loading">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="stats-container">
      <h2 className="stats-title">📊 Estadísticas de Hoy</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.hanRespondido}/{stats.totalUsuarios}</div>
          <div className="stat-label">Han respondido</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.respuestasCorrectas}</div>
          <div className="stat-label">Respuestas correctas</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{stats.porcentaje}%</div>
          <div className="stat-label">Participación</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{stats.horaNotificacion}</div>
          <div className="stat-label">Hora de hoy</div>
        </div>
      </div>

      <div className="info-card">
        <h3>🎯 Cómo funciona</h3>
        <ul>
          <li>Cada día recibirás una notificación a una <strong>hora aleatoria</strong></li>
          <li>Tendrás <strong>2 minutos</strong> para responder la pregunta</li>
          <li>Construye tu racha respondiendo correctamente cada día 🔥</li>
          <li>Compite con otros usuarios y mejora tus conocimientos</li>
        </ul>
      </div>

      <div className="bereal-info">
        <p className="bereal-emoji">📸</p>
        <p className="bereal-text">Inspirado en BeReal: aprende algo nuevo cuando menos lo esperas</p>
      </div>
    </div>
  )
}

export default StatsScreen
