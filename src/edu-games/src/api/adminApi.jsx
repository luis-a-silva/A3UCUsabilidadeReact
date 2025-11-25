import axios from "axios";

//Endpoint principal
const API_URL = "http://localhost:3000/api/v1";

// ===================================================
//  Listar todos os usuários (rota autenticada)
// ===================================================
export async function getUsuarios() {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.get(`${API_URL}/usuarios/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Erro ao buscar usuarios (autenticado):", err);
        throw err;
    }
}

// ===================================================
//  Atualizar usuario (autenticado)
// ===================================================
export async function updateUser(id, nome, dataNascimento, fkPerfil) {
    const token = localStorage.getItem("token");

    try {
        // -------------------------------
        // Conversão automática da data
        // -------------------------------
        let dataConvertida = dataNascimento;

        if (dataNascimento) {
            // Caso venha no formato yyyy-mm-dd (input type="date")
            if (dataNascimento.includes("-")) {
                const [ano, mes, dia] = dataNascimento.split("-");
                dataConvertida = `${dia}/${mes}/${ano}`; // API aceita dd/mm/yyyy
            }

            // Caso venha no formato dd/mm/yyyy → mantém como está
            else if (dataNascimento.includes("/")) {
                dataConvertida = dataNascimento;
            }

            // Qualquer outro formato é invalidado
            else {
                console.warn("Formato de data desconhecido:", dataNascimento);
                dataConvertida = null;
            }
        }

        // -------------------------------
        // Corpo enviado para API
        // -------------------------------
        const body = {
            nome,
            dataNascimento: dataConvertida,
            fkPerfil
        };

        console.log("📤 Enviando:", body);

        const res = await axios.put(
            `${API_URL}/usuarios/${id}`,
            body,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return res.data;

    } catch (err) {
        console.error("❌ Erro ao atualizar usuário:", err.response?.data || err);
        throw err;
    }
}



// ===================================================
//  Listar todos os perfis (rota autenticada)
// ===================================================
export async function getPerfis() {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.get(`${API_URL}/profiles`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Erro ao buscar pefis (autenticado):", err);
        throw err;
    }
}

// ===================================================
//  Criar jogo (autenticado)
// ===================================================
export async function createJogo(jogo) {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.post(`${API_URL}/jogos`, jogo, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Erro ao criar jogo:", err);
        throw err;
    }
}


// ===================================================
//  Atualizar jogo (autenticado)
// ===================================================
export async function updateJogo(id, jogo) {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.put(`${API_URL}/jogos/${id}`, jogo, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Erro ao atualizar jogo:", err);
        throw err;
    }
}

// ===================================================
//  Deletar jogo (autenticado)
// ===================================================
export async function deleteJogo(id) {
    const token = localStorage.getItem("token");
    try {
        const res = await axios.delete(`${API_URL}/jogos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Erro ao deletar jogo:", err);
        throw err;
    }
}


// ===================================================
//  Criar Empresa
// ===================================================
export async function createEmpresa(nome) {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${API_URL}/empresas`,
      { nome },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Erro ao criar empresa:", err);
    throw err;
  }
}

// ===================================================
//  Atualizar Empresa
// ===================================================
export async function updateEmpresa(id, nome) {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(
      `${API_URL}/empresas/${id}`,
      { nome },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Erro ao atualizar empresa:", err);
    throw err;
  }
}

// ===================================================
//  Deletar Empresa
// ===================================================
export async function deleteEmpresa(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.delete(`${API_URL}/empresas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao deletar empresa:", err);
    throw err;
  }
}