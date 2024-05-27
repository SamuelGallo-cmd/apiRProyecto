import express from 'express';
import { ApolloServer } from 'apollo-server-express'; 
import { authMiddleware } from './auth.js';
import { resolvers } from "./resolvers.js";
import { readFile } from 'node:fs/promises';
import { makeExecutableSchema } from '@graphql-tools/schema';

const PORT = 9000;
const app = express();

app.use(express.json(), authMiddleware);

const typeDefs = await readFile('./schema.graphql', 'utf8');

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({ schema });

await server.start();
server.applyMiddleware({ app, path: '/graphql' }); 

app.listen({ port: PORT }, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}/graphql`);
});
