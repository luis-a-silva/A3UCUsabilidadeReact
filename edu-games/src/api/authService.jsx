import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/auth";

export async function loginUser(email, senha) {
  const response = await axios.post(`${API_URL}/login`, { email, senha });
  return response.data; // { message, token? }
}

export async function registerUser(nome, email, senha, perfilId = 2, dataNascimento) {
  const response = await axios.post(`${API_URL}/register`, {
    nome,
    email,
    senha,
    perfilId,
    dataNascimento,
  });
  return response.data; // { message }
}
