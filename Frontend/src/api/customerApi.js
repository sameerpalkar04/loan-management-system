import { apiRequest } from "./client";

export const registerCustomer = (customer) => apiRequest("/api/customers/register", {
  method: "POST",
  body: JSON.stringify(customer),
});

export const getCurrentCustomer = () => apiRequest("/api/customers/me");
