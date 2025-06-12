import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from "@as-integrations/express4";
import cors from 'cors';
import mongoose from "mongoose";
import { buildSchema } from "type-graphql";
import { ImageResolver } from "./resolvers/imageResolver.js";
import dotenv from "dotenv";

async function startServer() {

  const app = express();

  app.use(cors());
  app.use(express.json());

  await mongoose.connect(process.env.MONGO_DB_URL ?? "");

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

dotenv.config()
startServer().catch(
  (err) => {
    console.log('Error starting server:', err)
  }
)
