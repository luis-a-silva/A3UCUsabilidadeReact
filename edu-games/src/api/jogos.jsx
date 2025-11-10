import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

// ===================================================
// 🔹 Listar todos os jogos (rota autenticada)
// ===================================================
export async function getAllJogos() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/jogos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
  try {
    const token = localStorage.getItem("token");
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
  try {
    const res = await axios.get(`${API_URL}/categorias`);
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Listar jogos por categoria
// ===================================================
export async function getJogosPorCategoria(idCategoria) {
  try {
    const res = await axios.get(`${API_URL}/categorias/${idCategoria}`);
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar jogos por categoria:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Criar jogo (autenticado)
// ===================================================
export async function createJogo(jogo) {
  try {
    const token = localStorage.getItem("token");
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
  try {
    const token = localStorage.getItem("token");
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
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/jogos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao deletar jogo:", err);
    throw err;
  }
}
