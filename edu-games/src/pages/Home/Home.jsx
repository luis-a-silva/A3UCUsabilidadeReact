import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import HeaderAuth from "../../components/Header/HeaderAuth";
import { isAuthenticated } from "../../utils/auth";
import { getAllJogos, getPublicJogos, getCategoriaById } from "../../api/jogos";
import { addCarrinho, removeCarrinho, getCarrinho } from "../../api/carrinho";
import { addFavorito, removeFavorito, getFavoritos } from "../../api/favoritos";
import { mostrarMensagem } from "../../utils/alerta";
import "./Home.css";
import { atualizarHeaderCarrinho } from "../../utils/headerUtil";
import { getTopDadosCompletos } from "../../api/vendas";

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [autenticado, setAutenticado] = useState(null);
  const [loading, setLoading] = useState(false);
  const effectRan = useRef(false);
  const [topJogos, setTopJogos] = useState([]);
  const [topEmpresas, setTopEmpresas] = useState([]);

  async function carregarTudo(categoriaId = null) {
    try {
      setLoading(true); // 🔥 INÍCIO DO LOADING

      const tokenExiste = isAuthenticated();
      setAutenticado(tokenExiste);

      let dadosJogos = tokenExiste
        ? await getAllJogos()
        : await getPublicJogos();

      if (categoriaId) {
        dadosJogos = dadosJogos.filter(j => j.fkCategoria === categoriaId);
      }

      const jogosComCategorias = await Promise.all(
        dadosJogos.map(async (jogo) => {
          try {
            const categoria = jogo.fkCategoria
              ? await getCategoriaById(jogo.fkCategoria)
              : null;

            return {
              ...jogo,
              categoriaNome: categoria?.nome || "Sem categoria",
            };
          } catch {
            return { ...jogo, categoriaNome: "Sem categoria" };
          }
        })
      );

      setJogos(jogosComCategorias);

      if (tokenExiste) {
        const [carrinhoAPI, favoritosAPI] = await Promise.all([
          getCarrinho(),
          getFavoritos(),
        ]);

        setCarrinho(carrinhoAPI);
        setFavoritos(
          Array.isArray(favoritosAPI)
            ? favoritosAPI.map(f => ({
              jogoId: f.jogoId || f.jogo?.id || f.id,
            }))
            : []
        );
      }

    } catch (err) {
      console.error("❌ Erro ao carregar dados:", err);
      setJogos([]);
      setCarrinho([]);
      setFavoritos([]);
    } finally {
      setLoading(false); // 🔥 FIM DO LOADING
    }
  }


  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    async function carregarInfos() {
      const { topJogos, topEmpresas } = await getTopDadosCompletos();
      setTopJogos(topJogos);
      setTopEmpresas(topEmpresas);
    }
    carregarInfos();

    carregarTudo();
  }, []);

  // Enquanto ainda verifica autenticação
  if (autenticado === null) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Carregando...</p>;
  }

  // ======== Funções utilitárias ========

  function estaNoCarrinho(id) {
    return carrinho.some((i) => i.jogoId === id);
  }

  function estaNosFavoritos(id) {
    return favoritos.some((i) => i.jogoId === id);
  }

  function statusDoJogo(id) {
    const item = carrinho.find((i) => i.jogoId === id);
    if (!item) return "fora";
    if (item.status === "F") return "comprado";
    return "ativo";
  }

  async function toggleCarrinho(jogoId) {
    if (!autenticado) {
      mostrarMensagem("Você precisa estar logado para adicionar ao carrinho.", "info");
      return;
    }

    try {
      if (estaNoCarrinho(jogoId)) {
        const res = await removeCarrinho(jogoId);
        setCarrinho((prev) => prev.filter((i) => i.jogoId !== jogoId));
        mostrarMensagem(res.message || "Item removido do carrinho!", "info");
      } else {
        const res = await addCarrinho(jogoId);
        setCarrinho((prev) => [...prev, { jogoId }]);
        mostrarMensagem(res.message || "Item adicionado ao carrinho!", "success");
      }
      atualizarHeaderCarrinho();
    } catch (err) {
      console.error("Erro no toggleCarrinho:", err);
      mostrarMensagem(
        err.response?.data?.message || "Erro ao atualizar carrinho!",
        "danger"
      );
    }
  }

  async function toggleFavorito(jogoId) {
    if (!autenticado) {
      mostrarMensagem("Você precisa estar logado para favoritar jogos.", "info");
      return;
    }

    try {
      if (estaNosFavoritos(jogoId)) {
        const res = await removeFavorito(jogoId);
        setFavoritos((prev) => prev.filter((i) => i.jogoId !== jogoId));
        mostrarMensagem(res.message || "Removido dos favoritos!", "info");
      } else {
        const res = await addFavorito(jogoId);
        setFavoritos((prev) => [...prev, { jogoId }]);
        mostrarMensagem(res.message || "Adicionado aos favoritos!", "success");
      }
    } catch (err) {
      console.error("Erro no toggleFavorito:", err);
      mostrarMensagem(
        err.response?.data?.message || "Erro ao atualizar favoritos!",
        "danger"
      );
    }
  }

  // ======== Renderização ========

  return (
    <div>
      {autenticado ? <HeaderAuth carregarTudo={carregarTudo} loading={loading} /> : <Header />}

      {loading && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Filtrando jogos...
        </p>
      )}

      <section className="top10-section">
        <div className="titulo-secao">
          <span className="subtitulo">OS MAIS VENDIDOS</span>
          <h2>Top 10 Jogos</h2>
        </div>

        <div className="top10-grid">
          {topJogos.map((jogo, index) => (
            <div
              key={index}
              className="top10-card"
              style={{
                border: index === 0 ? "3px solid gold" : "1px solid #333",
                position: "relative"
              }}
            >
              {index === 0 && (
                <div className="badge-ouro">🏆 Primeiro Lugar!</div>
              )}

              <div className="top10-rank">{index + 1}</div>

              <img
                src="https://placehold.co/400x300?text=Jogo"
                alt={jogo.nome}
              />

              <div className="top10-info">
                <h3>{jogo.nome}</h3>
                <p className="categoria-badge">Mais Vendido</p>
                <div className="rating">Vendas: {jogo.total}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="top10-section">
        <div className="titulo-secao">
          <span className="subtitulo">AS QUE MAIS VENDEM</span>
          <h2>Top 5 Empresas</h2>
        </div>

        <div className="top10-grid">
          {topEmpresas.map((emp, index) => (
            <div
              key={index}
              className="top10-card"
              style={{
                border: index === 0 ? "3px solid gold" : "1px solid #333",
                position: "relative"
              }}
            >
              {index === 0 && (
                <div className="badge-ouro">👑 Empresa #1</div>
              )}

              <div className="top10-rank">{index + 1}</div>

              <div className="top10-info">
                <h3>{emp.empresa}</h3>
                <div className="rating">Total de vendas: {emp.total}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="games-section">
        <div className="titulo-secao">
          <span className="subtitulo">CONFIRA TAMBÉM</span>
          <h2>Todos os Jogos</h2>
        </div>

        <div className="grade-jogos">
          {jogos.length > 0 ? (
            jogos.map((jogo, index) => {
              const noCarrinho = estaNoCarrinho(jogo.id);
              const nosFavoritos = estaNosFavoritos(jogo.id);
              return (
                <div className="cartao-jogo" key={jogo.id ?? index}>
                  <img
                    src={
                      jogo.imagem ||
                      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop"
                    }
                    alt={`Capa do jogo ${jogo.nome}`}
                  />
                  <div className="info-jogo">
                    <h3>{jogo.nome}</h3>
                    <p className="categoria">
                      {jogo.categoriaNome || "Sem categoria"}
                    </p>

                    <div className="preco-comprar">
                      <p className="preco">
                        R$ {Number(jogo.preco).toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    <div className="acoes-jogo">

                      {autenticado ?
                        <Link to={`/jogo/${jogo.id}`} className="btn-comprar">
                          <i className="fas fa-arrow-right"></i> Saiba mais
                        </Link>

                        :
                        <buttons className="btn-comprar" onClick={() => mostrarMensagem("Você precisa estar logado para comprar jogos.", "info")}>
                          <i className="fas fa-arrow-right"></i> Saiba mais
                        </buttons>
                      }

                      {/* Carrinho */}
                      <button
                        className={`btn-add-cart ${statusDoJogo(jogo.id) === "ativo"
                          ? "ativo"
                          : statusDoJogo(jogo.id) === "comprado"
                            ? "comprado"
                            : ""
                          }`}
                        onClick={() =>
                          statusDoJogo(jogo.id) === "comprado"
                            ? mostrarMensagem("Você já comprou este jogo.", "info")
                            : toggleCarrinho(jogo.id)
                        }
                      >
                        <i
                          className={`fas ${statusDoJogo(jogo.id) === "ativo"
                            ? "fa-cart-arrow-down"
                            : statusDoJogo(jogo.id) === "comprado"
                              ? "fa-check"
                              : "fa-cart-plus"
                            }`}
                        ></i>
                      </button>

                      {/* Favorito */}
                      <button
                        className={`btn-favorito ${nosFavoritos ? "ativo" : ""}`}
                        onClick={() => toggleFavorito(jogo.id)}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>Nenhum jogo encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}

