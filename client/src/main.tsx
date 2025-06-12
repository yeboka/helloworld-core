import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from "@apollo/client";
import client from "./api/apolloClient";
import { NotificationProvider } from "./context/useNotificationContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <NotificationProvider>
        <App/>
      </NotificationProvider>
    </ApolloProvider>
  </StrictMode>,
)
