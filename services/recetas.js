import { connection } from "./connection.js";

const recipeTable = () => connection.table('recetas');

export async function obtenerRecetaPorId(id) {
    const receta = await recipeTable().first().where({ id });
    return {
        ...receta,
        ingredientes: JSON.parse(receta.ingredientes),
        pasos: JSON.parse(receta.pasos)
    };
}

export async function obtenerTodasLasRecetas() {
    const recetas = await recipeTable().select();
    return recetas.map(receta => ({
        ...receta,
        ingredientes: JSON.parse(receta.ingredientes),
        pasos: JSON.parse(receta.pasos)
    }));
}

export async function crearReceta({ nombre, descripcion, ingredientes, pasos, usuario_id }) {
    const receta = {
        nombre,
        descripcion,
        ingredientes: JSON.stringify(ingredientes),
        pasos: JSON.stringify(pasos),
        id_usuario: usuario_id,
        creado_en: new Date().toISOString(),
    };
    const [id] = await recipeTable().insert(receta);
    return obtenerRecetaPorId(id);
}

export async function actualizarReceta({ id, nombre, descripcion, ingredientes, pasos }) {
    const receta = await obtenerRecetaPorId(id);
    if (!receta) {
        return null;
    }
    const camposActualizados = { 
        nombre, 
        descripcion,
        ...(ingredientes && { ingredientes: JSON.stringify(ingredientes) }),
        ...(pasos && { pasos: JSON.stringify(pasos) })
    };
    await recipeTable().update(camposActualizados).where({ id });
    return { ...receta, ...camposActualizados };
}

export async function eliminarReceta(id) {
    const receta = await obtenerRecetaPorId(id);
    if (!receta) {
        return null;
    }
    await recipeTable().delete().where({ id });
    return receta;
}
