import mysql from "mysql2/promise";

//configurar un pool de conexiones de MySQL
console.log('db.js ejecutado');

export const pool = mysql.createPool({
    host: 'localhost',  // Dirección del servidor MySQL (usualmente 'localhost' si está en tu máquina local)
    user: 'root',       // Nombre de usuario para conectarse a la base de datos
    password: '',       // Contraseña del usuario (debe ser configurada si tienes una contraseña definida)
    database: 'livenotes', // Nombre de la base de datos a la que deseas conectarte
    waitForConnections: true,    // Espera conexiones si todas están ocupadas
    connectionLimit: 10,         // Número máximo de conexiones simultáneas en el pool
    queueLimit: 0,               // Límite para la cola de solicitudes (0 significa ilimitado)
    connectTimeout:10000
});

console.log('Pool creado');
// Función para verificar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión con MySQL establecida correctamente');
         // Liberamos la conexión para que pueda ser reutilizada
        connection.release();
    } catch (error) {
        console.error(`Error al conectar con MySQL:  ${error.message}`);
    }
};



// Verificar conexión al iniciar
testConnection();



