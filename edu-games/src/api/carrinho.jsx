import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/carrinho";

// ===================================================
// 🔹 Obter itens do carrinho
// ===================================================
export async function getCarrinho() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Adicionar item ao carrinho
// ===================================================
export async function addCarrinho(jogoId) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/add`,
      { jogoId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Remover item do carrinho
// ===================================================
export async function removeCarrinho(jogoId) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(`${API_URL}/${jogoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao remover item do carrinho:", err);
    throw err;
  }
}
