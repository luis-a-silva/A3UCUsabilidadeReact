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
