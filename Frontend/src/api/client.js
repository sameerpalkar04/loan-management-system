const services = {
  customer: import.meta.env.VITE_CUSTOMER_API_URL || "http://localhost:8001",
  loanType: import.meta.env.VITE_LOAN_TYPE_API_URL || "http://localhost:8081",
  application: import.meta.env.VITE_LOAN_APPLICATION_API_URL || "http://localhost:8083",
  creditScore: import.meta.env.VITE_CREDIT_SCORE_API_URL || "http://localhost:8080"
};

export async function request(service, path, options = {}) {
  const token = localStorage.getItem("luma_token");
  const response = await fetch(`${services[service]}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Something went wrong. Please try again.");
  }

  return response.status === 204 ? null : response.json();
}

export const customerApi = {
  register: (data) => request("customer", "/api/customers/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("customer", "/api/customers/login", { method: "POST", body: JSON.stringify(data) })
};

export const loanTypeApi = {
  list: () => request("loanType", "/api/loan-types")
};

export const applicationApi = {
  mine: () => request("application", "/api/v1/loan-applications/me"),
  create: (data) => request("application", "/api/v1/loan-applications", { method: "POST", body: JSON.stringify(data) })
};
