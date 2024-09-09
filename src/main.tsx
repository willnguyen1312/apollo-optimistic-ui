import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App.tsx";
import "./index.css";

import { worker } from "./mocks/browser";

const client = new ApolloClient({
  uri: "http://localhost:5173",
  cache: new InMemoryCache(),
});

worker.start().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </StrictMode>
  );
});
