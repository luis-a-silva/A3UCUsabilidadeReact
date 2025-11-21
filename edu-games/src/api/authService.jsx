import axios from "axios";

//Endpoint principal
const API_URL = "http://localhost:3000/api/v1/auth";

//Função de Login 
export async function loginUser(email, senha) {
  try {
    //Fazer um POST no endpoint de Login passando email e senha e retornando o response (dentro do responde DATA se login for bem sucedido ele retorna o token)
    const response = await axios.post(`${API_URL}/login`, { email, senha });
    //Retorno da API do professor sempre traz uma mensagem e o status além do dado
    return {
      status: response.status,
      message: response.data.message,
      data: response.data
    };
  } catch (err) {
    //Rejoga com o response inteiro para o try/catch do front tratar
    throw err;
  }
}

//Função de cadastro
export async function registerUser(nome, email, senha, perfil, dataNascimento) {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      //passa no Header da requisição os dados necessários para cadastro
      nome,
      email,
      senha,
      dataNascimento,
      perfil
    });
    // Retorno da API do professor sempre traz uma mensagem e o status além do dado
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
