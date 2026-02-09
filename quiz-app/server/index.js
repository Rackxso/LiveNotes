import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos en memoria (en producción usar MongoDB, PostgreSQL, etc.)
let usuarios = [
  {
    id: 'user-1',
    nombre: 'Usuario Demo',
    temarios: ['historia-arte'],
    horaInicio: '09:00',
    horaFin: '21:00',
    notificacionesActivas: true,
    racha: 5,
    ultimaRespuesta: null
  }
];

let temarios = {
  'historia-arte': {
    id: 'historia-arte',
    titulo: 'Historia del Arte',
    temas: [
      {
        nombre: 'Renacimiento',
        preguntas: [
          {
            id: 'q1',
            texto: '¿Quién pintó la Capilla Sixtina?',
            tipo: 'multiple',
            opciones: ['Miguel Ángel', 'Leonardo da Vinci', 'Rafael', 'Donatello'],
            respuestaCorrecta: 'Miguel Ángel'
          },
          {
            id: 'q2',
            texto: '¿En qué siglo comenzó el Renacimiento?',
            tipo: 'multiple',
            opciones: ['Siglo XIII', 'Siglo XIV', 'Siglo XV', 'Siglo XVI'],
            respuestaCorrecta: 'Siglo XIV'
          },
          {
            id: 'q3',
            texto: '¿Qué ciudad fue el centro del Renacimiento italiano?',
            tipo: 'multiple',
            opciones: ['Roma', 'Venecia', 'Florencia', 'Milán'],
            respuestaCorrecta: 'Florencia'
          }
        ]
      },
      {
        nombre: 'Barroco',
        preguntas: [
          {
            id: 'q4',
            texto: '¿Quién pintó "Las Meninas"?',
            tipo: 'multiple',
            opciones: ['Velázquez', 'Goya', 'El Greco', 'Murillo'],
            respuestaCorrecta: 'Velázquez'
          },
          {
            id: 'q5',
            texto: '¿Qué caracteriza al arte barroco?',
            tipo: 'multiple',
            opciones: ['Simplicidad', 'Drama y movimiento', 'Geometría pura', 'Minimalismo'],
            respuestaCorrecta: 'Drama y movimiento'
          }
        ]
      }
    ]
  }
};

let preguntaDelDia = null;
let respuestasDelDia = [];
let horaNotificacion = null;

// Función para generar hora aleatoria
function generarHoraAleatoria(inicio, fin) {
  const [horaIni, minIni] = inicio.split(':').map(Number);
  const [horaFin, minFin] = fin.split(':').map(Number);
  
  const minutosInicio = horaIni * 60 + minIni;
  const minutosFin = horaFin * 60 + minFin;
  
  const minutosAleatorios = Math.floor(
    Math.random() * (minutosFin - minutosInicio) + minutosInicio
  );
  
  const hora = Math.floor(minutosAleatorios / 60);
  const minutos = minutosAleatorios % 60;
  
  return `${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
}

// Función para seleccionar pregunta aleatoria
function seleccionarPreguntaAleatoria() {
  const temario = temarios['historia-arte'];
  const todasPreguntas = temario.temas.flatMap(tema => tema.preguntas);
  const preguntaAleatoria = todasPreguntas[Math.floor(Math.random() * todasPreguntas.length)];
  
  preguntaDelDia = {
    ...preguntaAleatoria,
    timestamp: new Date(),
    expiraEn: new Date(Date.now() + 2 * 60 * 1000) // 2 minutos
  };
  
  respuestasDelDia = [];
  
  console.log(`📚 Nueva pregunta del día: "${preguntaDelDia.texto}"`);
  console.log(`⏰ Expira a las: ${preguntaDelDia.expiraEn.toLocaleTimeString()}`);
}

// Programar pregunta diaria (cada día a las 00:01)
cron.schedule('1 0 * * *', () => {
  const usuario = usuarios[0];
  horaNotificacion = generarHoraAleatoria(usuario.horaInicio, usuario.horaFin);
  console.log(`🔔 Notificación programada para hoy a las ${horaNotificacion}`);
});

// Para demo: generar pregunta cada 3 minutos
cron.schedule('*/3 * * * *', () => {
  seleccionarPreguntaAleatoria();
});

// Inicializar con una pregunta
seleccionarPreguntaAleatoria();
const ahora = new Date();
horaNotificacion = `${ahora.getHours()}:${ahora.getMinutes()}`;

// ====== RUTAS API ======

// Obtener pregunta del día
app.get('/api/pregunta-del-dia', (req, res) => {
  if (!preguntaDelDia) {
    return res.status(404).json({ error: 'No hay pregunta disponible' });
  }
  
  const ahora = new Date();
  if (ahora > preguntaDelDia.expiraEn) {
    return res.status(410).json({ error: 'La pregunta ha expirado', expirada: true });
  }
  
  const tiempoRestante = Math.floor((preguntaDelDia.expiraEn - ahora) / 1000);
  
  res.json({
    id: preguntaDelDia.id,
    texto: preguntaDelDia.texto,
    tipo: preguntaDelDia.tipo,
    opciones: preguntaDelDia.opciones,
    tiempoRestante,
    totalRespuestas: respuestasDelDia.length
  });
});

// Responder pregunta
app.post('/api/responder', (req, res) => {
  const { usuarioId = 'user-1', respuesta, tiempoTomado } = req.body;
  
  if (!preguntaDelDia) {
    return res.status(404).json({ error: 'No hay pregunta disponible' });
  }
  
  const ahora = new Date();
  if (ahora > preguntaDelDia.expiraEn) {
    return res.status(410).json({ error: 'El tiempo ha expirado' });
  }
  
  // Verificar si ya respondió
  const yaRespondio = respuestasDelDia.find(r => r.usuarioId === usuarioId);
  if (yaRespondio) {
    return res.status(400).json({ error: 'Ya has respondido hoy' });
  }
  
  const esCorrecta = respuesta === preguntaDelDia.respuestaCorrecta;
  
  const respuestaData = {
    id: uuidv4(),
    usuarioId,
    preguntaId: preguntaDelDia.id,
    respuesta,
    esCorrecta,
    tiempoTomado,
    timestamp: new Date()
  };
  
  respuestasDelDia.push(respuestaData);
  
  // Actualizar racha del usuario
  const usuario = usuarios.find(u => u.id === usuarioId);
  if (usuario) {
    if (esCorrecta) {
      usuario.racha++;
    }
    usuario.ultimaRespuesta = respuestaData.timestamp;
  }
  
  res.json({
    esCorrecta,
    respuestaCorrecta: preguntaDelDia.respuestaCorrecta,
    racha: usuario?.racha || 0,
    estadisticas: {
      totalRespuestas: respuestasDelDia.length,
      respuestasCorrectas: respuestasDelDia.filter(r => r.esCorrecta).length,
      tiempoPromedio: respuestasDelDia.reduce((acc, r) => acc + r.tiempoTomado, 0) / respuestasDelDia.length
    }
  });
});

// Obtener estadísticas del día
app.get('/api/estadisticas-dia', (req, res) => {
  const totalUsuarios = usuarios.length;
  const hanRespondido = respuestasDelDia.length;
  
  res.json({
    totalUsuarios,
    hanRespondido,
    porcentaje: totalUsuarios > 0 ? Math.round((hanRespondido / totalUsuarios) * 100) : 0,
    respuestasCorrectas: respuestasDelDia.filter(r => r.esCorrecta).length,
    horaNotificacion
  });
});

// Obtener perfil de usuario
app.get('/api/usuario/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === req.params.id);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  res.json(usuario);
});

// Estado del servidor
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    preguntaActiva: !!preguntaDelDia,
    horaNotificacion,
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔔 Próxima notificación programada para: ${horaNotificacion || 'calculando...'}`);
});