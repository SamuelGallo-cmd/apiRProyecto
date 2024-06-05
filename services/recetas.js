import { connection } from "./connection.js";
const RecetaTable = () => connection.table('recetas');
const cateTable = () => connection.table('categorias');

export async function obtenerTodasLasRecetas(limit) {
    const query = RecetaTable().select().orderBy('created_at', 'desc');
    return query;
}

export async function crearReceta({ nombre, descripcion, ingredientes, pasos,categoria, id_usuario }) {
    const receta = {
        nombre,
        descripcion,
        ingredientes,
        pasos,
        categoria,
        id_usuario,
        created_at: new Date().toISOString(),
    };
    const [insertedReceta] = await RecetaTable().insert(receta).returning('*');
    return insertedReceta; 
}




export async function actualizarReceta({ id, nombre, descripcion, ingredientes, pasos, categoria }) {
    const receta = await RecetaTable().first().where({ id });
    if (!receta) {
        return null;
    }
    const updateFields = { nombre, descripcion, ingredientes, pasos, categoria };
    await RecetaTable().update(updateFields).where({ id });
    return { ...receta, ...updateFields };
}

export async function eliminarReceta(id) {
    const receta = await connection.table('recetas').where({ id }).first();
    const receta = await connection.table('recetas').where({ id }).first();
    if (!receta) {
        return null;
    }
    await connection.table('recetas').delete().where({ id });
    await connection.table('recetas').delete().where({ id });
    return receta;
}

export async function obtenerRecetaPorCategoria(categoriaId) {
    return await cateTable().where({ recetas: categoriaId });
}