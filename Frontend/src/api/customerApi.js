import { apiRequest } from "./client";
import { mockCustomerAccounts, USE_MOCK_DATA, wait } from "./mockData";

const mockRegisterCustomer = (customer) => {
  mockCustomerAccounts.push({ email: customer.email.toLowerCase(), password: customer.password, role: "CUSTOMER", accessToken: `demo-customer-${Date.now()}` });
  return wait({ customerId: Date.now(), ...customer });
};

export const registerCustomer = (customer) =>
  USE_MOCK_DATA ? mockRegisterCustomer(customer) : apiRequest("/api/customers/register", {
    method: "POST",
    body: JSON.stringify(customer),
  });
