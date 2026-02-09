import { useState, useEffect } from 'react'
import QuizScreen from './components/QuizScreen'
import StatsScreen from './components/StatsScreen'
import ProfileScreen from './components/ProfileScreen'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('quiz')
  const [notificationPermission, setNotificationPermission] = useState('default')

  useEffect(() => {
    // Verificar soporte de notificaciones
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('✅ Service Worker registrado:', registration)
        })
        .catch(error => {
          console.log('❌ Error al registrar Service Worker:', error)
        })
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      if (permission === 'granted') {
        new Notification('¡Notificaciones activadas! 🎉', {
          body: 'Recibirás una pregunta aleatoria cada día',
          icon: '/icon-192.png',
          badge: '/badge-72.png'
        })
      }
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="logo">📚 QuizBeReal</h1>
        {notificationPermission !== 'granted' && (
          <button 
            className="notification-btn"
            onClick={requestNotificationPermission}
          >
            🔔 Activar notificaciones
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="main-content">
        {currentScreen === 'quiz' && <QuizScreen />}
        {currentScreen === 'stats' && <StatsScreen />}
        {currentScreen === 'profile' && <ProfileScreen />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          className={`nav-btn ${currentScreen === 'quiz' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('quiz')}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">Quiz</span>
        </button>
        <button 
          className={`nav-btn ${currentScreen === 'stats' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('stats')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Stats</span>
        </button>
        <button 
          className={`nav-btn ${currentScreen === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Perfil</span>
        </button>
      </nav>
    </div>
  )
}

export default App
