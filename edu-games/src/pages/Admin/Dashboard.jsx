import { useEffect, useState } from "react";
import { getTopJogosMaisVendidos, getTopJogosPorEmpresa } from "../../api/vendas";
import "./Admin.css";
import HeaderAdmin from "./HeaderAdmin";

export default function Dashboard() {
  const [topJogos, setTopJogos] = useState([]);
  const [topEmpresas, setTopEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setLoading(true);
        const jogos = await getTopJogosMaisVendidos() || [];
        setTopJogos(jogos);
        
        const empresasRanking = await getTopJogosPorEmpresa() || { todas: [] };
        setTopEmpresas(empresasRanking.todas || []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDashboard();
  }, []);

  const maxTotalJogos = topJogos.length > 0 ? Math.max(...topJogos.map(j => j.total)) : 1;
  const maxTotalEmpresas = topEmpresas.length > 0 ? Math.max(...topEmpresas.map(e => e.total)) : 1;

  if (loading) return <div className="admin-container"><p style={{ textAlign: "center", color: "white", padding: "50px" }}>Carregando Dashboard...</p></div>;

  return (
    <div className="admin-container">
      <HeaderAdmin />

      <div className="admin-content-body">
          <div className="secao-titulo-central">
              <h1 className="titulo-painel">Painel Administrativo</h1>
              <h3 className="subtitulo-gerenciamento">Visão Geral (Dashboard de Vendas)</h3>
          </div>

          <section className="grafico-h">
            <h2>🎮 Top Jogos Mais Vendidos</h2>
            {topJogos.length === 0 ? (
              <p>Nenhum jogo vendido ainda.</p>
            ) : (
              topJogos.map((jogo) => (
                <div className="barra" key={jogo.nome}>
                  <span className="label">{jogo.nome}</span>
                  <div className="valor" style={{ "--w": `${(jogo.total / maxTotalJogos) * 100}%` }} title={`${jogo.total} vendas`}></div>
                  <span className="num">{jogo.total}</span>
                </div>
              ))
            )}
          </section>

          <section className="grafico-v">
            <h2>🏢 Empresas que Mais Vendem</h2>
            <div className="grafico-scroll">
              <div className="colunas">
                {topEmpresas.map((emp) => (
                  <div className="col" key={emp.empresaId}>
                    <div className="barra-v" style={{ "--h": (emp.total / maxTotalEmpresas) * 260 }} title={`${emp.total} vendas`}></div>
                    <span className="nome">{emp.empresaNome}</span>
                    <span className="num-emp">{emp.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
      </div>
    </div>
  );
}