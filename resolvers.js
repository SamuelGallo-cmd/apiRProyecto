
import { getUser,getAllUsers,} from "./services/usuarios.js";

import { obtenerRecetaPorId,obtenerTodasLasRecetas,} from "./services/recetas.js";

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
        }
    },
    Mutation: {
    
    },
    Subscription: {
        nuevaReceta: {
            subscribe: (_, args) => {
                // suscribirse a nuevas recetas
            },
        }
    },
};
