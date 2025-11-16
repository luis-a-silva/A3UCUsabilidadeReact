import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

// ===================================================
// 🔹 Listar todos os jogos (rota autenticada)
// ===================================================
export async function getAllJogos() {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/jogos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar jogos (autenticado):", err);
    throw err;
  }
}

// ===================================================
// 🔹 Listar todos os jogos (rota pública)
// ===================================================
export async function getPublicJogos() {
  try {
    const res = await axios.get(`${API_URL}/public/jogos`);
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar jogos públicos:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Listar jogo por ID
// ===================================================
export async function getJogoById(id) {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/jogos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`Erro ao buscar jogo ID ${id}:`, err);
    throw err;
  }
}

// ===================================================
// 🔹 Listar todas as categorias
// ===================================================
export async function getCategorias() {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/categorias`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Listar jogos por categoria
// ===================================================
export async function getCategoriaById(idCategoria) {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/categorias/${idCategoria}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar jogos por categoria:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Buscar todas as avaliações de um jogo
// ===================================================
export async function getAvaliacoesByJogo(jogoId) {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/avaliacoes?jogoId=${jogoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;
    // 🔹 Se o backend retornar um único objeto, transforma em array
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
  } catch (err) {
    console.error("Erro ao buscar avaliações por jogo:", err);
    return [];
  }
}


// ===================================================
// 🔹 Buscar média das avaliações de um jogo
// ===================================================
export async function getMediaAvaliacao(jogoId) {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${API_URL}/avaliacoes/media/${jogoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Number(res.data?.media) || 0;
  } catch (err) {
    console.error(`Erro ao buscar média do jogo ${jogoId}:`, err);
    return 0;
  }
}


// ===================================================
// 🔹 Finalizar Compra
// ===================================================
export async function finalizarCompra() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Usuário não autenticado");

    const res = await axios.post(`${API_URL}/vendas/checkout`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("Erro ao finalizar compra:", err);
    throw err.response?.data || { message: "Erro ao finalizar compra." };
  }
}


// ===================================================
// 🔹 Criar nova avaliação
// ===================================================
export async function addAvaliacao(jogoId, nota, comentario = "") {
  const token = localStorage.getItem("token");
  try {
    const body = { jogoId, nota, comentario };
    const res = await axios.post(`${API_URL}/avaliacoes`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("Erro ao adicionar avaliação:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Criar jogo (autenticado)
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
// 🔹 Atualizar jogo (autenticado)
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
// 🔹 Deletar jogo (autenticado)
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

