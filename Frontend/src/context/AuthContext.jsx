import { createContext, useContext, useMemo, useState } from "react";
import { loginCustomer, loginOfficer } from "../api/authApi";

const AuthContext = createContext(null);

const getCustomerIdFromToken = (token) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(paddedPayload)).customer_id || null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    const role = localStorage.getItem("user_role") || sessionStorage.getItem("user_role");
    const storedCustomerId =
      localStorage.getItem("customer_id") || sessionStorage.getItem("customer_id");
    const officerId =
      localStorage.getItem("officer_id") || sessionStorage.getItem("officer_id");
    const displayName =
      localStorage.getItem("display_name") || sessionStorage.getItem("display_name");
    const customerId = storedCustomerId || getCustomerIdFromToken(token || "");
    return token && role
      ? { token, role, customerId, officerId, displayName }
      : null;
  });

  const signIn = async (role, email, password, remember = true) => {
    const response = role === "LOAN_OFFICER" ? await loginOfficer(email, password) : await loginCustomer(email, password);
    const nextSession = {
      token: response.accessToken,
      role: response.role,
      customerId: response.customerId,
      officerId: response.officerId,
      displayName: response.displayName,
    };
    const storage = remember ? localStorage : sessionStorage;
    localStorage.removeItem("access_token"); localStorage.removeItem("user_role"); localStorage.removeItem("customer_id"); localStorage.removeItem("officer_id"); localStorage.removeItem("display_name");
    sessionStorage.removeItem("access_token"); sessionStorage.removeItem("user_role"); sessionStorage.removeItem("customer_id"); sessionStorage.removeItem("officer_id"); sessionStorage.removeItem("display_name");
    storage.setItem("access_token", nextSession.token);
    storage.setItem("user_role", nextSession.role);
    if (nextSession.customerId) {
      storage.setItem("customer_id", String(nextSession.customerId));
    }
    if (nextSession.officerId) {
      storage.setItem("officer_id", String(nextSession.officerId));
    }
    if (nextSession.displayName) {
      storage.setItem("display_name", nextSession.displayName);
    }
    setSession(nextSession);
    return nextSession;
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("customer_id");
    localStorage.removeItem("officer_id");
    localStorage.removeItem("display_name");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user_role");
    sessionStorage.removeItem("customer_id");
    sessionStorage.removeItem("officer_id");
    sessionStorage.removeItem("display_name");
    setSession(null);
  };

  const value = useMemo(() => ({ session, signIn, signOut }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// This hook is deliberately exported alongside the provider so consumers share one context instance.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
