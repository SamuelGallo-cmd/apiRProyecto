import { connection } from "./connection.js";
import {generatedId} from "../utils/id-generator.js"
const userTable=()=>connection.table('usuarios');
const recetasTable = () => connection.table('recetas');

export async function getUser(id) {
    return await userTable().first().where({ id });
}

export async function getAllUsers() {
    return await userTable().select('id', 'name', 'last_name', 'email', 'created_at'); 
}

export async function createUser({id, name, last_name, email, password}) {
    const user = {
        id,
        name,
        last_name,
        email,
        password,
        created_at: new Date().toISOString(),
    };
    await userTable().insert(user);
    return user;
}

export async function updateUser({ id, name, last_name, email }) {
    const user = await userTable().first().where({ id });
    if (!user) {
        return null;
    }
    const updateFields = { name, last_name, email };
    await userTable().update(updateFields).where({ id });
    return { ...user, ...updateFields };
}

export async function deleteUser(id) {
    const user = await userTable().first().where({ id });
    if (!user) {
        return null;
    }
    await userTable().delete().where({ id });
    return user;
}

export async function getRecetasByUsuarioId(usuarioId) {
    return await recetasTable().where({ id_usuario: usuarioId });
}

export async function getUserByEmail(email){
    return await userTable().first().where({email});
}
