import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/auth";

export async function loginUser(email, senha) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, senha });
    return {
      status: response.status,
      message: response.data.message,
      data: response.data
    };
  } catch (err) {
    throw err;
  }
}

export async function registerUser(nome, email, senha, perfil, dataNascimento) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      nome,
      email,
      senha,
      dataNascimento,
      perfil
    });

    return {
      status: response.status,
      message: response.data.message,
      data: response.data
    };

  } catch (err) {
    // Rejoga com o response inteiro para o try/catch do front tratar
    throw err;
  }
}
