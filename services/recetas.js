import { connection } from "./connection.js";

const tablaRecetas = () => connection.table('recetas');


export async function obtenerRecetaPorId(id) {
    return await tablaRecetas().first().where({ id });
}

export async function obtenerTodasLasRecetas() {
    return await tablaRecetas().select();
}



export async function crearReceta({ nombre, descripcion, idUsuario }) {
    const receta = {
        nombre,
        descripcion,
        id_usuario: idUsuario,
        creado_en: new Date().toISOString(),
    };
    await tablaRecetas().insert(receta);
    return receta;
}

export async function actualizarReceta({ id, nombre, descripcion }) {
    const receta = await tablaRecetas().first().where({ id });
    if (!receta) {
        return null;
    }
    const camposActualizados = { nombre, descripcion };
    await tablaRecetas().update(camposActualizados).where({ id });
    return { ...receta, ...camposActualizados };
}

export async function eliminarReceta(id) {
    const receta = await tablaRecetas().first().where({ id });
    if (!receta) {
        return null;
    }
    await tablaRecetas().delete().where({ id });
    return receta;
}
