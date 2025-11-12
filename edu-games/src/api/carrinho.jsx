import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/carrinho";

// ===================================================
// 🔹 Obter itens do carrinho
// ===================================================
export async function getCarrinho() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 🔹 Normaliza o formato para sempre retornar um array de jogos
    const carrinhos = Array.isArray(res.data?.carrinhosComItens)
      ? res.data.carrinhosComItens
      : [];

    const itens = carrinhos.flatMap((c) =>
      (c.itens || []).map((i) => ({
        jogoId: i.fkJogo,
        carrinhoId: c.id,
        itemId: i.id,
      }))
    );

    // 🔹 Atualiza contador no header se callback existir
    if (typeof onCountUpdate === "function") {
      onCountUpdate(itens.length);
    }

    return itens;
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    if (typeof onCountUpdate === "function") onCountUpdate(0);
    return [];
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
