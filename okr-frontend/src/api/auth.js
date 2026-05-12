// api/auth.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/okr";

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  return res.json(); // { token, email, role, name }
}