
import { getUser,getAllUsers,} from "./services/usuarios.js";
import { GraphQLError, subscribe } from "graphql";
import { obtenerTodasLasRecetas,crearReceta,actualizarReceta,eliminarReceta } from "./services/recetas.js";
import {PubSub} from 'graphql-subscriptions';

const pubSub=new PubSub();


export const resolvers = {
    Query: {
        usuario: (_root, { id }) => getUser(id),
        usuarios: () => getAllUsers(),  // Resolver para obtener todos los usuarios
        receta: (_root, { id }) => obtenerRecetaPorId(id),
        recetas: (_root, { limit }) => obtenerTodasLasRecetas(limit)
    },
    Usuario: {
        recetas: async (usuario) => {
            // obtener las recetas asociadas a un usuario
        }
    },
    Receta: {
        usuario: async (receta) => {
            // obtener el usuario asociado a una receta
        },
        usuario:async (receta)=>{
            return await getUser(receta.id_usuario);
        }
    },
    Mutation: {
        //Recetas


        crearReceta:async (_root, { input: { nombre, ingredientes, descripcion, pasos, id_usuario }},{auth})=>{
            if(!auth){
                throw new GraphQLError("Usuario no autenticado",{extensions:{code:'UNAUTHORIZED'}});
            }
            const receta= await crearReceta({ nombre, ingredientes, descripcion, pasos, id_usuario:auth.sub});
            pubSub.publish('RECETA_ADDED',{nuevaReceta:receta});
            return receta;
        },












        actualizarReceta:(_root,{input:{id,name,deadline,capture}},{auth})=>{
            if(!auth){
                throw new GraphQLError("Usuario no autenticado",{extensions:{code:'UNAUTHORIZED'}});
            }
            const receta=actualizarReceta(input);
            if(!receta){
                throw new GraphQLError("No existe tarea",{extensions:{code:'NOT_FOUND'}});
            }
            return receta;
        },
        eliminarReceta:(_root,{id},{auth})=>{
            if(!auth){
                throw new GraphQLError("Usuario no autenticado",{extensions:{code:'UNAUTHORIZED'}});
            }
            const receta=eliminarReceta(id);
            if(!receta){
                throw new GraphQLError("No existe tarea",{extensions:{code:'NOT_FOUND'}});
            }
            return receta;
        },

    
    },
    Subscription: {
        nuevaReceta: {
            subscribe: (_, args, { user }) => {
                return pubSub.asyncIterator('RECETA_AGREGADA');
            },
        }
    },
};
