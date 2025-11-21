import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/lista-desejo";

// ===================================================
//  Obter lista de desejos
// ===================================================
export async function getFavoritos() {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar lista de desejos:", err);
    throw err;
  }
}

// ===================================================
//  Adicionar aos favoritos
// ===================================================
export async function addFavorito(jogoId) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      API_URL,
      { jogoId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Erro ao adicionar aos favoritos:", err);
    throw err;
  }
}

// ===================================================
//  Remover dos favoritos
// ===================================================
export async function removeFavorito(jogoId) {
  const token = localStorage.getItem("token");
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      data: { jogoId }, // delete precisa do body no axios
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao remover dos favoritos:", err);
    throw err;
  }
}
 