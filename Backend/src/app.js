import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';




config();
const app = express();
//Configurar puerto
const PORT =  process.env.PORT || 3000;
const corsOption ={
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}
app.use(cors(corsOption)); //habilitar cors

app.use(express.json()); // Para parsear JSON en el body


app.use(cors(corsOption));

app.use(express.json());



app.get("/", (req, res) =>{
    res.json({
        message: 'API Rest inmobiliaria',
    })
});

app.use((req, res) =>{
    res.status(404).json({message: 'Pagina no encontrada'});
});

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})