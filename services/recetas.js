import { connection } from "./connection.js";
const RecetaTable = () => connection.table('recetas');
const cateTable = () => connection.table('categoriasR');

export async function obtenerTodasLasRecetas() {
    const query = RecetaTable().select().orderBy('created_at', 'desc');
    return query;
}

export async function crearReceta({ nombre, descripcion, ingredientes, pasos, id_categoria, id_usuario }) {
    const receta = {
        nombre,
        descripcion,
        ingredientes,
        pasos,
        id_categoria,
        id_usuario,
        created_at: new Date().toISOString(),
    };
    const [insertedReceta] = await RecetaTable().insert(receta).returning('*');
    return insertedReceta;
}

export async function actualizarReceta({ id, nombre, descripcion, ingredientes, pasos, id_categoria }) {
    const receta = await RecetaTable().first().where({ id });
    if (!receta) {
        return null;
    }
    const updateFields = { nombre, descripcion, ingredientes, pasos, id_categoria };
    await RecetaTable().update(updateFields).where({ id });
    return { ...receta, ...updateFields };
}

export async function eliminarReceta(id) {
    const receta = await RecetaTable().where({ id }).first();
    if (!receta) {
        return null;
    }
    await RecetaTable().delete().where({ id });
    return receta;
}

export async function obtenerCategoriasPorRecetaId(categoriaId) {
    return await cateTable().where({ id: categoriaId });
}

export async function RecetasPorIdCategoria(categoriaID) {
    return await RecetaTable().where({ id_categoria: categoriaID });
}
