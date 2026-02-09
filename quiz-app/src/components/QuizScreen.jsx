import { useState, useEffect } from 'react'
import './QuizScreen.css'

function QuizScreen() {
  const [pregunta, setPregunta] = useState(null)
  const [tiempoRestante, setTiempoRestante] = useState(null)
  const [respondido, setRespondido] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null)

  useEffect(() => {
    cargarPreguntaDelDia()
  }, [])

  useEffect(() => {
    if (tiempoRestante === null || tiempoRestante <= 0) return

    const interval = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          if (!respondido) {
            setError('⏰ El tiempo ha expirado')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [tiempoRestante, respondido])

  const cargarPreguntaDelDia = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/pregunta-del-dia')
      
      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.expirada) {
          setError('La pregunta de hoy ya expiró. ¡Vuelve mañana! 🌟')
        } else {
          setError('No hay pregunta disponible')
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      setPregunta(data)
      setTiempoRestante(data.tiempoRestante)
      setLoading(false)
    } catch (err) {
      console.error('Error al cargar pregunta:', err)
      setError('Error al conectar con el servidor')
      setLoading(false)
    }
  }

  const handleRespuesta = async (opcion) => {
    if (respondido || tiempoRestante <= 0) return

    setRespuestaSeleccionada(opcion)
    
    try {
      const tiempoTomado = pregunta.tiempoRestante - tiempoRestante
      
      const response = await fetch('/api/responder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          respuesta: opcion,
          tiempoTomado
        })
      })

      const data = await response.json()
      setResultado(data)
      setRespondido(true)

      // Mostrar notificación si está disponible
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(
          data.esCorrecta ? '¡Correcto! 🎉' : 'Incorrecto 😔',
          {
            body: `Respuesta correcta: ${data.respuestaCorrecta}`,
            icon: '/icon-192.png'
          }
        )
      }
    } catch (err) {
      console.error('Error al enviar respuesta:', err)
      alert('Error al enviar la respuesta')
    }
  }

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="quiz-container loading">
        <div className="loader"></div>
        <p>Cargando pregunta del día...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="quiz-container error">
        <div className="error-icon">😴</div>
        <h2>{error}</h2>
        <p className="error-subtitle">La próxima pregunta llegará en un momento aleatorio del día</p>
        <button className="retry-btn" onClick={cargarPreguntaDelDia}>
          🔄 Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      {/* Timer Circle */}
      <div className="timer-section">
        <svg className="timer-circle" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={tiempoRestante > 60 ? '#4CAF50' : tiempoRestante > 30 ? '#FFC107' : '#F44336'}
            strokeWidth="8"
            strokeDasharray={`${(tiempoRestante / 120) * 283} 283`}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
        </svg>
        <div className="timer-text">
          {formatearTiempo(tiempoRestante)}
        </div>
      </div>

      {/* Pregunta */}
      <div className="pregunta-card">
        <div className="pregunta-header">
          <span className="pregunta-badge">📚 Historia del Arte</span>
          <span className="respuestas-count">
            {pregunta.totalRespuestas} {pregunta.totalRespuestas === 1 ? 'persona ha respondido' : 'personas han respondido'}
          </span>
        </div>
        
        <h2 className="pregunta-texto">{pregunta.texto}</h2>

        {/* Opciones */}
        <div className="opciones-container">
          {pregunta.opciones.map((opcion, index) => {
            let className = 'opcion-btn'
            
            if (respondido) {
              if (opcion === resultado.respuestaCorrecta) {
                className += ' correcta'
              } else if (opcion === respuestaSeleccionada && !resultado.esCorrecta) {
                className += ' incorrecta'
              } else {
                className += ' disabled'
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleRespuesta(opcion)}
                disabled={respondido || tiempoRestante <= 0}
                className={className}
              >
                <span className="opcion-letra">{String.fromCharCode(65 + index)}</span>
                <span className="opcion-texto">{opcion}</span>
                {respondido && opcion === resultado.respuestaCorrecta && (
                  <span className="opcion-icon">✓</span>
                )}
                {respondido && opcion === respuestaSeleccionada && !resultado.esCorrecta && (
                  <span className="opcion-icon">✗</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Resultado */}
      {respondido && resultado && (
        <div className={`resultado-card ${resultado.esCorrecta ? 'correcta' : 'incorrecta'}`}>
          <div className="resultado-icon">
            {resultado.esCorrecta ? '🎉' : '💪'}
          </div>
          <h3>{resultado.esCorrecta ? '¡Correcto!' : '¡Sigue aprendiendo!'}</h3>
          <p className="resultado-texto">
            {resultado.esCorrecta 
              ? 'Has acertado la pregunta del día'
              : `La respuesta correcta era: ${resultado.respuestaCorrecta}`
            }
          </p>
          
          <div className="resultado-stats">
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <div>
                <div className="stat-value">{resultado.racha}</div>
                <div className="stat-label">Racha</div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📊</span>
              <div>
                <div className="stat-value">
                  {Math.round((resultado.estadisticas.respuestasCorrectas / resultado.estadisticas.totalRespuestas) * 100)}%
                </div>
                <div className="stat-label">Acierto global</div>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <div>
                <div className="stat-value">{Math.round(resultado.estadisticas.tiempoPromedio)}s</div>
                <div className="stat-label">Tiempo promedio</div>
              </div>
            </div>
          </div>

          <p className="resultado-footer">
            ¡Vuelve mañana para una nueva pregunta! 🌟
          </p>
        </div>
      )}
    </div>
  )
}

export default QuizScreen
