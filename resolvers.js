import { GraphQLError, subscribe } from "graphql";
//import { getUser, createUser, updateUser, deleteUser } from "./services/usuarios.js";
import { obtenerRecetaPorId, obtenerTodasLasRecetas, crearReceta, actualizarReceta, eliminarReceta } from "./services/recetas.js";
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

export const resolvers = {
    Query: {
        usuario: (_root, { id }) => getUser(id),
        receta: (_root, { id }) => obtenerRecetaPorId(id),
        recetas: (_root, { limit }) => obtenerTodasLasRecetas(limit)
    },
    Usuario: {
        recetas: async (usuario) => {
            //  obtener las recetas asociadas a un usuario
        }
    },
    Receta: {
        usuario: async (receta) => {
            //  obtener el usuario asociado a una receta
        }
    },
    Mutation: {
        crearUsuario: async (_root, { input }) => createUser(input),
        actualizarUsuario: async (_root, { input }) => updateUser(input),
        eliminarUsuario: async (_root, { id }) => deleteUser(id),
        crearReceta: async (_root, { input }) => crearReceta(input),
        actualizarReceta: async (_root, { input }) => actualizarReceta(input),
        eliminarReceta: async (_root, { id }) => eliminarReceta(id),
    },
    Subscription: {
        nuevaReceta: {
            subscribe: (_, args) => {
                //  suscribirse a nuevas recetas
            },
        }
    },
};
