import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from "@as-integrations/express4";
import cors from 'cors';
import mongoose from "mongoose";
import { buildSchema } from "type-graphql";
import { ImageResolver } from "./resolvers/imageResolver.js";

async function startServer() {

  const app = express();

  app.use(cors());
  app.use(express.json());

  await mongoose.connect(
    "mongodb+srv://yerbolat:LLT5ToyN5MRrOaOY@helloworld-core.s5rfikj.mongodb.net/gallery?retryWrites=true&w=majority&appName=helloworld-core"
  );

  const schema = await buildSchema({
    resolvers: [ImageResolver],
    emitSchemaFile: true,
  })

  const server = new ApolloServer({
    schema
  });
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server),
  );

  app.listen(4000, () => {
    console.log(`Server is running on port: 4000`);
  });
}

startServer().catch(
  (err) => {
    console.log('Error starting server:', err)
  }
)
