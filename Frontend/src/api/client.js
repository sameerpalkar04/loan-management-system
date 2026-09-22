const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("access_token");
  const isFormData = options.body instanceof FormData;
  const responseType = options.responseType || "json";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.message || error.error || "Request could not be completed."
    );
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null;
  }

  if (responseType === "blob") return response.blob();

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : null;
}
