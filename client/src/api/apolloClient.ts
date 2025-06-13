import { ApolloClient, InMemoryCache } from "@apollo/client";

 //Connection to Apollo Server
const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_APOLLO_URL,
  cache: new InMemoryCache()
})

export default client;