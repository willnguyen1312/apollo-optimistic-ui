import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App.tsx";

import { worker } from "./mocks/browser";

const client = new ApolloClient({
  uri: new URL(window.location.href).origin,
  cache: new InMemoryCache(),
});

await worker.start().then(() => {
  console.log("Mock service worker started");
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
