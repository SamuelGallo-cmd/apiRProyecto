import { connection } from "./connection.js";
const RecetaTable = () => connection.table('recetas');

export async function obtenerTodasLasRecetas(limit) {
    const query = RecetaTable().select().orderBy('created_at', 'desc');
    if (limit) {
        query.limit(limit);
    }
    return query;
}

export async function crearReceta({ nombre, descripcion, ingredientes, pasos, id_usuario }) {
    const receta = {
        nombre,
        descripcion,
        ingredientes,
        pasos,
        id_usuario,
        created_at: new Date().toISOString(),
    };
    const [insertedReceta] = await RecetaTable().insert(receta).returning('*');
    return insertedReceta; 
}




export async function actualizarReceta({ id, nombre, descripcion, ingredientes, pasos }) {
    const receta = await RecetaTable().first().where({ id });
    if (!receta) {
        return null;
    }
    const updateFields = { nombre, descripcion, ingredientes, pasos };
    await RecetaTable().update(updateFields).where({ id });
    return { ...receta, ...updateFields };
}

export async function eliminarReceta(id) {
    const receta = await connection.table('recetas').where({ id }).first();
    if (!receta) {
        return null;
    }
    await connection.table('recetas').delete().where({ id });
    return receta;
}
