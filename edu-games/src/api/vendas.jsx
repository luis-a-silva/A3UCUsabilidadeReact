import axios from "axios";
import { getCarrinho } from "./carrinho";
import { getJogoById } from "./jogos";

const API_URL = "http://localhost:3000/api/v1";

// 🔹 Junta /vendas com carrinhos finalizados (status F) e inclui nome/preço dos jogos
export async function getHistoricoCompras() {
  try {
    const token = localStorage.getItem("token");

    // 🔹 Busca vendas e carrinhos em paralelo
    const [vendasRes, carrinhoItens] = await Promise.all([
      axios.get(`${API_URL_VENDAS}/vendas`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      getCarrinho(),
    ]);

    const vendas = Array.isArray(vendasRes.data) ? vendasRes.data : [];

    // 🔹 Filtra apenas os carrinhos finalizados
    const carrinhosFinalizados = carrinhoItens.filter(
      (item) => item.status === "F"
    );

    // 🔹 Agrupa por carrinhoId
    const carrinhosMap = {};
    for (const item of carrinhosFinalizados) {
      if (!carrinhosMap[item.carrinhoId]) carrinhosMap[item.carrinhoId] = [];
      carrinhosMap[item.carrinhoId].push(item);
    }

    // 🔹 Junta venda + itens do carrinho + dados de cada jogo
    const historico = await Promise.all(
      vendas.map(async (venda) => {
        // filtra itens do carrinho com a fkVenda igual
        const itensCarrinho = Object.values(carrinhosMap)
          .flat()
          .filter((item) => Number(venda.id) === Number(item.carrinhoId));

        // busca os detalhes de cada jogo
        const itensDetalhados = await Promise.all(
          itensCarrinho.map(async (i) => {
            try {
              const jogo = await getJogoById(i.jogoId);
              return {
                ...i,
                nomeJogo: jogo?.nome || "Jogo não encontrado",
                preco: jogo?.preco || 0,
                descricao: jogo?.descricao?.replace(/"/g, "") || "",
              };
            } catch {
              return { ...i, nomeJogo: "Erro ao buscar jogo", preco: 0 };
            }
          })
        );

        // retorna o objeto da venda completa
        return {
          id: venda.id,
          usuarioId: venda.fk_usuario,
          total: venda.valor_total || 0,
          quantidade: venda.quantidade || itensDetalhados.length,
          data: venda.data
            ? new Date(Number(venda.data)).toISOString()
            : new Date().toISOString(),
          itens: itensDetalhados,
        };
      })
    );

    return historico;
  } catch (err) {
    console.error("Erro ao buscar histórico de compras:", err);
    return [];
  }
}

// ===================================================
// 🔹 Top jogos mais vendidos (overall)
// ===================================================
export async function getTopJogosMaisVendidos(top = 10) {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${API_URL}/relatorios/jogos-mais-vendidos?top=${top}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res.data);
    return res.data; // [{ nome, empresa, total }]
  } catch (err) {
    console.error("Erro ao buscar top jogos mais vendidos:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Top empresas que mais vendem (derivado do top jogos)
// ===================================================
export async function getTopEmpresasMaisVendedoras(top = 5) {
  try {
    const jogos = await getTopJogosMaisVendidos(10); // base do ranking

    const contagem = {};

    jogos.forEach((jogo) => {
      if (!contagem[jogo.empresa]) contagem[jogo.empresa] = 0;
      contagem[jogo.empresa] += jogo.total;
    });

    // Ordena pelo total de vendas
    const ranking = Object.entries(contagem)
      .map(([empresa, total]) => ({ empresa, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, top);

    return ranking; // [{ empresa, total }]
  } catch (err) {
    console.error("Erro ao buscar top empresas:", err);
    throw err;
  }
}

// ===================================================
// 🔹 Top completo: jogos + empresas
// ===================================================
export async function getTopDadosCompletos() {
  try {
    const topJogos = await getTopJogosMaisVendidos(10);
    const topEmpresas = await getTopEmpresasMaisVendedoras(5);

    return {
      topJogos,
      topEmpresas,
    };
  } catch (err) {
    console.error("Erro ao carregar dados completos do top:", err);
    throw err;
  }
}

