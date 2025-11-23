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
// ===================================================
//  Criar novo usuário
// ===================================================
export async function registerUser(nome, email, senha, dataNascimento) {
  const token = localStorage.getItem("token");

  try {
    // -------------------------------
    // Conversão automática da data
    // -------------------------------
    let dataConvertida = dataNascimento;

    if (dataNascimento) {
      // Caso venha no formato yyyy-mm-dd (input date)
      if (dataNascimento.includes("-")) {
        const [ano, mes, dia] = dataNascimento.split("-");
        dataConvertida = `${dia}/${mes}/${ano}`; // API aceita dd/MM/yyyy
      }
      // Caso venha dd/mm/yyyy já está OK
      else if (dataNascimento.includes("/")) {
        dataConvertida = dataNascimento;
      }
      // Caso venha errado:
      else {
        console.warn("Formato de data inválido no cadastro:", dataNascimento);
        dataConvertida = null;
      }
    }

    const body = {
      nome,
      email,
      senha,
      dataNascimento: dataConvertida
    };

    console.log("📤 Enviando cadastro:", body);

    const res = await axios.post(
      `${API_URL}/register`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return res.data;

  } catch (err) {
    console.error("Erro ao registrar usuário:", err.response?.data || err);
    throw err;
  }
}

