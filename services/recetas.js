// Importa la conexión a la base de datos desde el archivo connection.js
import { connection } from "./connection.js";
import { PubSub } from 'graphql-subscriptions';

const RecetaTable=()=>connection.table('recetas');



// Esta función obtiene todas las recetas, opcionalmente limitadas por cantidad
export async function obtenerTodasLasRecetas(limit) {
    let query = connection.table('recetas').select().orderBy('created_at', 'desc');
    if (limit) {
        query = query.limit(limit);
    }
    return query;
}



export async function crearReceta({nombre, descripcion, ingredientes, pasos, id_usuario}){
    const receta={
        nombre,
        descripcion,
        ingredientes,
        pasos,
        id_usuario,
        created_at: new Date().toISOString(),
    };
    await RecetaTable().insert(receta);
    return receta;
}




// Esta función actualiza una receta existente en la base de datos
export async function actualizarReceta({ id, nombre, descripcion, ingredientes, pasos }) {
    const receta = await connection.table('recetas').where({ id }).first();
    if (!receta) {
        return null;
    }
    const updateFields = { nombre, descripcion, ingredientes, pasos };
    await connection.table('recetas').update(updateFields).where({ id });
    return { ...receta, ...updateFields };
}

// Esta función elimina una receta existente de la base de datos
export async function eliminarReceta(id) {
    const receta = await connection.table('recetas').where({ id }).first();
    if (!receta) {
        return null;
    }
    await connection.table('recetas').delete().where({ id });
    return receta;
}
