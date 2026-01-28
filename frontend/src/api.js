const TOKEN_KEY = "jobtracker_token";

// Use Vite proxy (recommended): keep BASE = ""
// If you are NOT using proxy, set BASE = "http://127.0.0.1:8000"
const BASE = "";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please log in again.");
  }

  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const msg =
      (data && (data.detail || data.error || JSON.stringify(data))) ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data;
}


export async function login(username, password) {
  const data = await request("/api/token/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  const token = data?.access || data?.token;
  if (!token) throw new Error("Login succeeded but token missing in response.");

  localStorage.setItem(TOKEN_KEY, token);
  return data;
}

export async function fetchApplications() {
  return request("/api/applications/", { method: "GET" });
}

export async function createApplication(payload) {
  return request("/api/applications/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateApplication(id, payload) {
  return request(`/api/applications/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteApplication(id) {
  return request(`/api/applications/${id}/`, { method: "DELETE" });
}

export async function signup(username, email, password) {
  return request("/api/signup/", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}
