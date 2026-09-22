import { apiRequest } from "./client";
import { demoUsers, mockCustomerAccounts, USE_MOCK_DATA, wait } from "./mockData";

const mockLogin = (role, email, password) => {
  const account = role === "CUSTOMER" ? mockCustomerAccounts.find((user) => user.email === email.toLowerCase() && user.password === password) : demoUsers.officer;
  if (!account || (role !== "CUSTOMER" && (email.toLowerCase() !== account.email || password !== account.password))) {
    const hint = role === "CUSTOMER" ? demoUsers.customer : demoUsers.officer;
    return Promise.reject(new Error(`Use ${hint.email} with password ${hint.password}`));
  }
  return wait({ accessToken: account.accessToken, tokenType: "Bearer", expiresInSeconds: 3600, role: account.role });
};

export const loginCustomer = (email, password) =>
  USE_MOCK_DATA ? mockLogin("CUSTOMER", email, password) : apiRequest("/api/v1/auth/customers/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const loginOfficer = (email, password) =>
  USE_MOCK_DATA ? mockLogin("LOAN_OFFICER", email, password) : apiRequest("/api/v1/auth/officers/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
