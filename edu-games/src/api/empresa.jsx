import axios from "axios";

const API_URL = "http://localhost:3000/api/v1";

// ===================================================
// 🔹 Buscar empresa por ID
// ===================================================
export async function getEmpresaById(id) {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/empresas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error(`Erro ao buscar empresa ID ${id}:`, err);
    throw err;
  }

}

// ===================================================
// 🔹 Listar todas as empresas
// ===================================================
export async function getEmpresas() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/empresas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao listar empresas:", err);
    throw err;
  }
}
