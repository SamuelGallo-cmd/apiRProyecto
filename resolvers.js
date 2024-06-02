import { getUser, getAllUsers } from "./services/usuarios.js";
import { GraphQLError } from "graphql";
import { obtenerTodasLasRecetas, crearReceta, actualizarReceta, eliminarReceta } from "./services/recetas.js";
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

export const resolvers = {
    Query: {
        usuario: (_root, { id }) => getUser(id),
        usuarios: () => getAllUsers(),
        recetas: (_root, { limit }) => {
            const items = obtenerTodasLasRecetas(limit);
            return { items };
        }
    },
    Usuario: {
        recetas: async (usuario) => {
            // obtener las recetas asociadas a un usuario
        }
    },
    Receta: {
        usuario: async (receta) => {
            return await getUser(receta.id_usuario);
        }
    },
    Mutation: {
        crearReceta: async (_root, { input: { nombre, ingredientes, descripcion, pasos, id_usuario } }, { auth }) => {
            if (!auth) {
                throw new GraphQLError("Usuario no autenticado", { extensions: { code: 'UNAUTHORIZED' } });
            }
            const receta = await crearReceta({ nombre, ingredientes, descripcion, pasos, id_usuario: auth.sub });
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
        }
    },
    
    
};
