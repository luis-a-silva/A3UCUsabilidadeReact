import { jwtDecode } from "jwt-decode";

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  const token = getToken();
  return !!token; // retorna true se houver token
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export function getDecodedToken() {
  const token = getToken("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return null;
  }
}

export function isAdmin() {
  const decoded = getDecodedToken();
  return decoded?.perfil === "Administrador";
}