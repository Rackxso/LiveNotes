# 📚 Quiz BeReal - App de Aprendizaje Estilo BeReal

Una aplicación móvil web que te envía preguntas de conocimiento a una hora aleatoria del día, inspirada en BeReal.

## ✨ Características

- 🎯 **Pregunta diaria aleatoria**: Recibe una notificación a una hora impredecible cada día
- ⏱️ **Límite de tiempo**: 2 minutos para responder (como BeReal)
- 🔥 **Sistema de rachas**: Mantén tu racha respondiendo correctamente cada día
- 📊 **Estadísticas**: Compara tu rendimiento con otros usuarios
- 🎨 **Interfaz moderna**: Diseño atractivo y responsivo
- 📱 **PWA**: Instalable como app nativa en móvil y escritorio
- 🔔 **Notificaciones push**: Alertas en tiempo real

## 🚀 Instalación

### Prerrequisitos

- Node.js 16+ instalado
- npm o yarn

### Pasos

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

3. **Iniciar el proyecto:**
```bash
npm run dev
```

Esto iniciará:
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173`

4. **Abrir en el navegador:**
```
http://localhost:5173
```

## 📱 Funcionalidades

### Sistema de Preguntas
- **Nueva pregunta cada 3 minutos** (para demo - en producción sería 1 vez al día)
- Preguntas de opción múltiple sobre Historia del Arte
- Timer de 120 segundos para responder
- Retroalimentación inmediata

### Pantallas

#### 🎯 Quiz
- Ver la pregunta del día
- Timer con animación circular
- Opciones de respuesta interactivas
- Resultados con estadísticas

#### 📊 Estadísticas
- Usuarios que han respondido hoy
- Porcentaje de participación
- Hora de la notificación del día
- Información sobre cómo funciona

#### 👤 Perfil
- Racha actual
- Logros desbloqueados
- Temarios activos
- Configuración de notificaciones

## 🔧 Configuración

### Horario de Notificaciones

Por defecto, las notificaciones se pueden recibir entre las 9:00 y las 21:00. 
Para cambiar esto, edita en `server/index.js`:

```javascript
horaInicio: '09:00',  // Hora de inicio
horaFin: '21:00',      // Hora de fin
```

### Añadir Más Temarios

En `server/index.js`, añade más temarios en el objeto `temarios`:

```javascript
'matematicas': {
  id: 'matematicas',
  titulo: 'Matemáticas',
  temas: [
    {
      nombre: 'Álgebra',
      preguntas: [
        {
          id: 'math1',
          texto: '¿Cuánto es 2+2?',
          tipo: 'multiple',
          opciones: ['3', '4', '5', '6'],
          respuestaCorrecta: '4'
        }
      ]
    }
  ]
}
```

## 🌐 Notificaciones Push

### Activar Notificaciones

1. Haz clic en el botón "🔔 Activar notificaciones" en el header
2. Acepta los permisos en el navegador
3. ¡Listo! Recibirás notificaciones cuando haya una nueva pregunta

### Probar Notificaciones

Para probar las notificaciones manualmente, abre la consola del navegador y ejecuta:

```javascript
new Notification('¡Nueva pregunta! 💡', {
  body: 'Tienes 2 minutos para responder',
  icon: '/icon-192.png'
})
```

## 📦 Estructura del Proyecto

```
quiz-app/
├── server/
│   └── index.js          # Backend Node.js + Express
├── src/
│   ├── components/       # Componentes React
│   │   ├── QuizScreen.jsx
│   │   ├── StatsScreen.jsx
│   │   └── ProfileScreen.jsx
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── *.css            # Estilos
├── public/
│   └── sw.js            # Service Worker
├── package.json
├── vite.config.js       # Configuración de Vite
└── README.md
```

## 🎨 Personalización

### Cambiar Colores

Los colores principales están en `src/App.css` y `src/index.css`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Puedes cambiar estos valores hexadecimales por los colores que prefieras.

### Modificar Tiempo de Respuesta

En `server/index.js`, cambia el tiempo de expiración:

```javascript
expiraEn: new Date(Date.now() + 2 * 60 * 1000) // 2 minutos
```

## 🚢 Despliegue en Producción

### Backend
Puedes desplegar el backend en:
- Heroku
- Railway
- Render
- Vercel (serverless)

### Frontend
- Vercel
- Netlify
- GitHub Pages

### Base de Datos
Para producción, reemplaza la base de datos en memoria por:
- MongoDB
- PostgreSQL
- Firebase Firestore

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Notificaciones**: Web Push API
- **PWA**: Vite PWA Plugin
- **Estilos**: CSS moderno con gradientes y animaciones
- **Programación de tareas**: node-cron

## 📝 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Más temarios y categorías
- [ ] Sistema de amigos
- [ ] Rankings globales
- [ ] Modo oscuro
- [ ] Soporte multiidioma
- [ ] Integración con Firebase
- [ ] Notificaciones push reales con FCM

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar la app:

1. Haz fork del proyecto
2. Crea una rama con tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 💡 Inspiración

Inspirado en **BeReal**, la app que te envía una notificación aleatoria cada día para capturar un momento auténtico. 
Este concepto se aplica al aprendizaje: ¿qué mejor forma de aprender que con pequeñas dosis de conocimiento en momentos inesperados?

---

**¡Disfruta aprendiendo! 🚀📚**
