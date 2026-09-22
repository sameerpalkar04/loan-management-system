import { createContext, useContext, useMemo, useState } from "react";
import { loginCustomer, loginOfficer } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    return token && role ? { token, role } : null;
  });

  const signIn = async (role, email, password) => {
    const response = role === "LOAN_OFFICER" ? await loginOfficer(email, password) : await loginCustomer(email, password);
    const nextSession = { token: response.accessToken, role: response.role };
    localStorage.setItem("access_token", nextSession.token);
    localStorage.setItem("user_role", nextSession.role);
    setSession(nextSession);
    return nextSession;
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    setSession(null);
  };

  const value = useMemo(() => ({ session, signIn, signOut }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
