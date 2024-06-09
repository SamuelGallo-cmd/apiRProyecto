import { GraphQLError, subscribe } from "graphql";
import { getUser, createUser, updateUser, deleteUser, getRecetasByUsuarioId, getAllUsers } from "./services/usuarios.js";
import { obtenerTodasLasRecetas, crearReceta, actualizarReceta, eliminarReceta} from "./services/recetas.js";
import {getAllCategories, createCategory, updateCategory,getObtenerRecetasPorCategoria, getCategoria} from "./services/categorias.js"
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

export const resolvers = {
    Query: {
        usuario: (_root, { id }) => {
            const user = getUser(id);
            if(!user){
                throw new GraphQLError("Usuario no existe", {
                    extensions: {
                        code: 'NOT_FOUND',
                    }
                });
            }
            return user;
        },
        usuarios: () => getAllUsers(),
        recetas: (_root) => obtenerTodasLasRecetas(),
        categorias: () => getAllCategories(),
    },
    Usuario: {
        recetas: async (user, {auth}) => {
            //  obtener las recetas asociadas a un usuario
            return await getRecetasByUsuarioId(user.id);
        },
        created_at:(receta)=> {
            return receta.created_at.slice(0, 'yyyy-mm-dd'.length)
        }
    },
Receta: {
  usuario: async (receta) => {
    return await getUser(receta.id_usuario);
  },
  categoriaR: async (receta) => { // Cambiado de "categoria" a "categoriaR"
    return await getCategoria(receta.id_categoria);
  }
}
,
    CategoriaR: {
        recetas: async (categoriaR) => {
            return await getobtenerRecetasPorCategoria(categoriaR.id);
        }
    },

    Mutation: {
        //User Mutations
        crearUsuario: async (_root, { input: {id,name, last_name, email, password} }) => {
            const user = await createUser({id, name, last_name, email, password});
            pubSub.publish('USER_ADDED', {nuevoUsuario:user});
            return user;
        },
        actualizarUsuario: (_root, { input: {id, name, last_name, email} }, {auth}) => {
            if(!auth) {
                throw new GraphQLError("Uusuario no autenticado", {extensions: {code: 'UNAUTHTORIZED'}});
            }
            const input =  {id, name, last_name, email};
            const user = updateUser(input);
            if(!user){
                throw new GraphQLError("No existe el usuario", {extensions: {code: 'NOT_FOUND'}});
            }
            return user;
        },
        eliminarUsuario: (_root, { id }, {auth}) => {
            if(!auth){
                throw new GraphQLError("Usuario no autenticado", {extensions: {code: 'UNAUTHTORIZED'}});
            }
            const user = deleteUser(id);
            if(!user){
                throw new GraphQLError("No existe el usuario", {extensions: {code: 'NOT_FOUND'}});
            }
            return user;
        },


        crearReceta: async (_root, { input: { nombre, ingredientes, descripcion, pasos, id_categoria, id_usuario } }, { auth }) => {
            if (!auth) {
                throw new GraphQLError("Usuario no autenticado", { extensions: { code: 'UNAUTHORIZED' } });
            }
            const receta = await crearReceta({ nombre, ingredientes, descripcion, pasos,id_categoria, id_usuario: auth.sub });
            pubSub.publish('RECETA_AGREGADA', { nuevaReceta: receta });
            return receta;
        },
        




        actualizarReceta: async (_root, { input: { id, nombre, ingredientes, descripcion, pasos } }, { auth }) => {
            if (!auth) {
                throw new GraphQLError("Usuario no autenticado", { extensions: { code: 'UNAUTHORIZED' } });
            }
            const receta = await actualizarReceta({ id, nombre, ingredientes, descripcion, pasos });
            if (!receta) {
                throw new GraphQLError("No existe la receta", { extensions: { code: 'NOT_FOUND' } });
            }
            return receta;
        },
        eliminarReceta: async (_root, { id }, { auth }) => {
            if (!auth) {
                throw new GraphQLError("Usuario no autenticado", { extensions: { code: 'UNAUTHORIZED' } });
            }
            const receta = eliminarReceta(id);
            if (!receta) {
                throw new GraphQLError("No existe la receta", { extensions: { code: 'NOT_FOUND' } });
            }
            return receta;
        },
        // CategoriaR Mutations
        crearCategoria: async (_root, { input: { titulo, descripcion} }, { auth }) => {
            if (!auth) {
                throw new GraphQLError("Usuario no autenticado", { extensions: { code: 'UNAUTHORIZED' } });
            }
            const categoria = await createCategory({ titulo, descripcion});
            pubSub.publish('CATEGORIA_AGREGADA', { nuevaCategoria: categoria });
            return categoria;
        },
        actualizarCategoria: (_root, { input: {id, titulo, descripcion } }, {auth}) => {
            if(!auth) {
                throw new GraphQLError("Uusuario no autenticado", {extensions: {code: 'UNAUTHTORIZED'}});
            }
            const input =  {id, titulo, descripcion};
            const categoria = updateCategory(input);
            if(!categoria){
                throw new GraphQLError("No existe la categoria", {extensions: {code: 'NOT_FOUND'}});
            }
            return categoria;
        },
        eliminarCategoria: async (_root, { id }, { auth }) => {
            if (!auth) {
                throw new GraphQLError("Usuario no autenticado", { extensions: { code: 'UNAUTHORIZED' } });
            }
            const categoria = eliminarReceta(id);
            if (!categoria) {
                throw new GraphQLError("No existe la categoria", { extensions: { code: 'NOT_FOUND' } });
            }
            return categoria;
        },
    },
    Subscription: {
        nuevaReceta: {
            subscribe: (_, args, { usuario }) => {
                console.log(usuario);
                return pubSub.asyncIterator('RECETA_AGREGADA');
            },
            resolve: (payload) => {
                const nuevaReceta = {
                    ...payload.nuevaReceta,
                    id: payload.nuevaReceta.id.toString()
                };
    
                return nuevaReceta;
            },
        },
        nuevoUsuario: {
            subscribe:(_, args, {user}) => {
                return pubSub.asyncIterator('USER_ADDED');
            }
        },
        nuevaCategoria:{
            subscribe:(_, args, {categoria}) => {
                return pubSub.asyncIterator('CATEGORIA_AGREGADA');
            },
            resolve: (payload) => {
                const nuevaCategoria = {
                    ...payload.nuevaCategoria, 
                    id: payload.nuevaCategoria.id.toString()
                };
                return nuevaCategoria
            },
        }
    },
};
