// import { connection } from "./connection.js";
// const userTable=()=>connection.table('users');

// import { connection } from "./connection.js";



// export async function getUser(id) {
//     return await userTable().first().where({ id });
// }

// export async function createUser({ id, name, last_name, email }) {
//     const user = {
//         id,
//         name,
//         last_name,
//         email,
//         created_at: new Date().toISOString(),
//     };
//     await userTable().insert(user);
//     return user;
// }

// export async function updateUser({ id, name, last_name, email }) {
//     const user = await userTable().first().where({ id });
//     if (!user) {
//         return null;
//     }
//     const updateFields = { name, last_name, email };
//     await userTable().update(updateFields).where({ id });
//     return { ...user, ...updateFields };
// }

// export async function deleteUser(id) {
//     const user = await userTable().first().where({ id });
//     if (!user) {
//         return null;
//     }
//     await userTable().delete().where({ id });
//     return user;
// }connection



// export async function getUserByEmail(email){
//     return await userTable().first().where({email});
// }



// export async function getUser(id){
//     return await userTable().first().where({id});
// }