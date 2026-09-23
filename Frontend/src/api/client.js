const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  const isFormData = options.body instanceof FormData;
  const responseType = options.responseType || "json";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Cannot reach the API gateway. Confirm it is running on port 9000.");
  }

  if (!response.ok) {
    const responseText = await response.text();
    let error;
    try { error = responseText ? JSON.parse(responseText) : {}; } catch { error = {}; }

    throw new Error(
      error.message || error.error || responseText || `Request failed (${response.status}).`
    );
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null;
  }

  if (responseType === "blob") return response.blob();

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : null;
}
