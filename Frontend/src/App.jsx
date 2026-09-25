import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./styles/tokens.css";
import "./styles/global.css";

// Composes application-wide routing and authentication state.
export default function App() {
  return <BrowserRouter>
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
  </BrowserRouter>;
}
