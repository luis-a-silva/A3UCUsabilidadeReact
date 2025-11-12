import { getCarrinho } from "../api/carrinho";

/**
 * Atualiza o contador de itens do carrinho no header (HeaderAuth)
 */

export async function atualizarHeaderCarrinho() {
  try {
    const itens = await getCarrinho();

    // 🔹 Filtra apenas os itens de carrinhos ativos (status = 'A')
    const ativos = Array.isArray(itens)
      ? itens.filter((i) => i.status === "A")
      : [];

    const contador = ativos.length;

    // 🔹 Atualiza o badge do carrinho no header
    const badge = document.getElementById("cartCount");
    if (badge) {
      badge.textContent = contador;
    }

    return contador;
  } catch (err) {
    console.error("Erro ao atualizar contador do carrinho:", err);
    return 0;
  }
}

