import { ApolloServer } from "@apollo/server";
import { expressMiddleware as middleware } from "@apollo/server/express4";
import express from 'express';
import { authMiddleware, login } from './auth.js';
import cors from 'cors';
import { resolvers } from "./resolvers.js";
import { readFile } from 'node:fs/promises';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer as useWsServer } from 'graphql-ws/lib/use/ws';
import { createServer as createHttpServer } from 'node:http';
import { WebSocketServer } from 'ws';

// Función asíncrona para inicializar el servidor
async function startServer() {
    const PORT = 9000;
    const app = express();
    app.use(cors(), express.json(), authMiddleware);

    app.post('/login', login);

    const typeDefs = await readFile('./schema.graphql', 'utf8');
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({ schema });
    await server.start();

    async function getContext({ req }) {
        return { auth: req.auth };
    }

    async function getWsContext({ connectionParams }) {
        const accessToken = connectionParams?.accessToken;
        if (accessToken) {
            const payload = await decodeToken(accessToken);
            return { user: payload };
        }
        return {};
    }

    const httpServer = createHttpServer(app);
    const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });

    useWsServer({ schema, context: getWsContext }, wsServer);

    app.use('/graphql', middleware(server, { context: getContext }));

    httpServer.listen({ port: PORT }, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}/graphql`);
    });
}


startServer().catch(error => {
    console.error('Error al iniciar el servidor:', error);
});
