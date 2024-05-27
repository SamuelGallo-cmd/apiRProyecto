import { connection } from "./connection.js";

const userTable = () => connection.table('usuarios');

export async function getUser(id) {
    return await userTable().first().where({ id }).select('id', 'name', 'last_name', 'email', 'created_at');
}

export async function getAllUsers() {
    return await userTable().select('id', 'name', 'last_name', 'email', 'created_at'); 
}

export async function createUser({ nombre, apellido, email, password }) {
    const user = {
        name: nombre,
        last_name: apellido,
        email,
        password,
        created_at: new Date().toISOString(),
    };
    await userTable().insert(user);
    return await userTable().first().where({ email }).select('id', 'name', 'last_name', 'email', 'created_at');
}

export async function updateUser({ id, nombre, apellido, email, password }) {
    const user = await getUser(id);
    if (!user) {
        return null;
    }
    const updateFields = { 
        name: nombre, 
        last_name: apellido, 
        email,
        ...(password && { password })  // Only update password if it's provided
    };
    await userTable().update(updateFields).where({ id });
    return { ...user, ...updateFields };
}

export async function deleteUser(id) {
    const user = await getUser(id);
    if (!user) {
        return null;
    }
    await userTable().delete().where({ id });
    return user;
}

export async function getUserByEmail(email) {
    return await userTable().first().where({ email }).select('id', 'name', 'last_name', 'email', 'created_at');
}
