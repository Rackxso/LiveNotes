import { pool } from "../data/db";


export const getUsuarios = async (req, res) => {
    try {
        const { id } = req.params;

        const consulta = await pool.query("SELECT * FROM usuarios WHERE UserID = ?", [id]);
        if(consulta.length == 0){
            res.status(400).json({
                data: [], 
                message: "No existe ese usuario."
            })
        }

        console.log(result);

        res.status(200).json({data: result});

    } catch (error) {
        throw new Error(`${error}`);
    }
};

export const postUsuario = async (req, res) => {
    try{
        const {nickname, gmail, password} = req.body;
        const [consulta] = await pool.query("INSERT INTO usuarios (nickname, gmail, password) VALUES (?, ?, ?)")
    }
};

export const updateUsuario = async (req, res) => { };

export const deleteUsuario = async (req, res) => { };