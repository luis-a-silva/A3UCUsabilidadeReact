import { useEffect, useState } from "react";
import { getTopJogosMaisVendidos, getTopJogosPorEmpresa } from "../../api/vendas";
import "./Admin.css";
import HeaderAdmin from "./HeaderAdmin";
export default function Dashboard() {
  const [topJogos, setTopJogos] = useState([]);
  const [topEmpresas, setTopEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===========================================================
  // 🔥 Carregar Dashboard Completo
  // ===========================================================
  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true);

        // 1) Top Jogos Geral
        const jogos = await getTopJogosMaisVendidos();
        setTopJogos(jogos);

        // 2) Top por Empresa
        const empresasRanking = await getTopJogosPorEmpresa();
        setTopEmpresas(empresasRanking);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, []);

  // ===========================================================
  // Escalas (maximo dos valores)
  // ===========================================================
  const maxTotalJogos = Math.max(...topJogos.map(j => j.total), 1);
  const maxTotalEmpresas = Math.max(...topEmpresas.map(e => e.total), 1);

  if (loading) return <p style={{ textAlign: "center" }}>Carregando...</p>;

  return (
    <>
      <HeaderAdmin />
      <div className="dashboard-container">
        <h4 className="page-title">Dashboard</h4>
        {/* ===================================================== */}
        {/* 🎮 TOP JOGOS MAIS VENDIDOS - Horizontal */}
        {/* ===================================================== */}
        <section className="grafico-h">
          <h2>🎮 Top Jogos Mais Vendidos</h2>

          {topJogos.length === 0 ? (
            <p>Nenhum jogo vendido ainda.</p>
          ) : (
            topJogos.map((jogo) => (
              <div className="barra" key={jogo.nome}>
                <span className="label">{jogo.nome}</span>

                <div
                  className="valor"
                  style={{ "--w": `${(jogo.total / maxTotalJogos) * 100}%` }}
                  title={`${jogo.total} vendas`}
                ></div>

                <span className="num">{jogo.total}</span>
              </div>
            ))
          )}
        </section>

        {/* ===================================================== */}
        {/* 🏢 TOP EMPRESAS - Vertical */}
        {/* ===================================================== */}
        <section className="grafico-v">
          <h2>🏢 Empresas que Mais Vendem</h2>

          <div className="colunas">
            {topEmpresas.map((emp) => (
              <div className="col" key={emp.empresaId}>
                <div
                  className="barra-v"
                  style={{ "--h": (emp.total / maxTotalEmpresas) * 260 }}
                  title={`${emp.total} vendas`}

                ></div>

                <span className="nome">{emp.empresaNome}</span>
                <span className="num-emp">{emp.total}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
