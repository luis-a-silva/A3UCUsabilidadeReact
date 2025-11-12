import { getCarrinho } from "../api/carrinho";

/**
 * Atualiza o contador de itens do carrinho no header (HeaderAuth)
 */
export async function atualizarHeaderCarrinho() {
  try {
    const itens = await getCarrinho();
    const contador = itens.length;

    // Tenta encontrar o badge do carrinho e atualiza
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
