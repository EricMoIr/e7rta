import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import HomePage from "./pages/HomePage";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <HomePage />
    </QueryClientProvider>
  );
}

export default App;
