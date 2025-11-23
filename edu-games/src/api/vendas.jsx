import axios from "axios";
import { getCarrinho } from "./carrinho";
import { getAllJogos, getJogoById } from "./jogos";
import { getEmpresas } from "./empresa";

const API_URL = "http://localhost:3000/api/v1";

//  Junta /vendas com carrinhos finalizados (status F) e inclui nome/preço dos jogos
export async function getHistoricoCompras() {
  try {
    const token = localStorage.getItem("token");

    // ------------------------------
    // 1) Buscar vendas
    // ------------------------------
    const vendasResponse = await axios.get(`${API_URL}/vendas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const vendas = Array.isArray(vendasResponse.data)
      ? vendasResponse.data
      : [];

    // ------------------------------
    // 2) Buscar carrinho
    // ------------------------------
    const carrinhoItens = await getCarrinho();

    // Filtrar somente carrinhos finalizados
    const carrinhosFinalizados = carrinhoItens.filter(
      (item) => item.status === "F"
    );

    // ------------------------------
    // 3) Agrupar itens do carrinho por carrinhoId
    // ------------------------------
    const carrinhosMap = {};

    for (const item of carrinhosFinalizados) {
      if (!carrinhosMap[item.carrinhoId]) {
        carrinhosMap[item.carrinhoId] = [];
      }
      carrinhosMap[item.carrinhoId].push(item);
    }
    /*
    Devolve um valor assim:

    {
      10: [ { item1 }, { item2 }, { item3 } ],
      11: [ { itemA }, { itemB } ],
      12: [ { itemX } ]
    }

    Onde as chaves (10, 11, 12) são os IDs dos carrinhos que serão vinculados às vendas.
    Cada array contém os itens (jogos) daquele carrinho.

    */
    // ------------------------------
    // 4) Montar o histórico de compras
    // ------------------------------
    const historico = [];

    for (const venda of vendas) {
      // itens vinculados à venda
      const itensCarrinho = (carrinhosMap[venda.id] || []);

      const itensDetalhados = [];

      // ------------------------------
      // 5) Buscar detalhes de cada jogo
      // ------------------------------
      for (const item of itensCarrinho) {
        try {
          const jogo = await getJogoById(item.jogoId);

          itensDetalhados.push({
            //copia as propriedades do objeto item e adiciona mais propriedades
            ...item,
            nomeJogo: jogo?.nome || "Jogo não encontrado",
            preco: jogo?.preco || 0,
            descricao: jogo?.descricao?.replace(/"/g, "") || "",
          });
        } catch {
          itensDetalhados.push({
            ...item,
            nomeJogo: "Erro ao buscar jogo",
            preco: 0,
          });
        }
      }

      // ------------------------------
      // 6) Construir objeto final da compra
      // ------------------------------
      historico.push({
        id: venda.id,
        usuarioId: venda.fk_usuario,
        total: venda.valor_total || 0,
        quantidade: venda.quantidade || itensDetalhados.length,
        data: venda.data
          ? new Date(Number(venda.data)).toISOString()
          : new Date().toISOString(),
        itens: itensDetalhados,
      });
    }

    return historico;

  } catch (err) {
    console.error("Erro ao buscar histórico de compras:", err);
    return [];
  }
}


// ===================================================
//  Top jogos mais vendidos (overall)
// ===================================================
export async function getTopJogosMaisVendidos() {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${API_URL}/relatorios/jogos-mais-vendidos?top=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data; // [{ nome, empresa, total }]
  } catch (err) {
    console.error("Erro ao buscar top jogos mais vendidos:", err);
    throw err;
  }
}



export async function getJogosComTotalVendas() {
  try {
    // 1) Ranking real
    const ranking = await getTopJogosMaisVendidos();

    // 2) Buscar todos os jogos (CORRETO!)
    const jogos = await getAllJogos();

    // 3) Criar mapa pelo nome
    const vendasMap = {};
    for (const item of ranking) {
      vendasMap[item.nome] = item.total;
    }

    // 4) Unir jogos + total
    const jogosComTotal = jogos.map(jogo => ({
      ...jogo,
      totalVendido: vendasMap[jogo.nome] || 0
    }));

    return jogosComTotal;

  } catch (err) {
    console.error("Erro ao montar relatório de jogos vendidos:", err);
    return [];
  }
}



export async function getTopJogosPorEmpresa() {
  const token = localStorage.getItem("token");

  try {
    // 1) Buscar todas as empresas
    const empresasRes = await getEmpresas();

    console.log("[Top por Empresa] Empresas encontradas:", empresasRes);

    const resultados = [];

    // 2) Para cada empresa, buscar seus jogos mais vendidos
    for (const emp of empresasRes) {
      try {
        const res = await axios.get(
          `${API_URL}/relatorios/jogos-mais-vendidos?top=5&empresa=${emp.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const lista = Array.isArray(res.data) ? res.data : [];

        if (lista.length === 0) continue;

        const jogoTop = lista[0];

        resultados.push({
          empresaId: emp.id,
          empresaNome: emp.nome,
          jogo: jogoTop.nome,
          total: jogoTop.total
        });

      } catch {
        continue;
      }
    }

    // Ordenação total
    resultados.sort((a, b) => b.total - a.total);

    // TOP 5
    const top5 = resultados.slice(0, 5);

    console.log("[Top por Empresa] TOP 5:", top5);
    console.log("[Top por Empresa] TODAS:", resultados);

    // 🔥 retornar dois resultados
    return {
      top5,
      todas: resultados
    };

  } catch (err) {
    console.error("Erro ao montar ranking por empresa:", err);
    return {
      top5: [],
      todas: []
    };
  }
}


