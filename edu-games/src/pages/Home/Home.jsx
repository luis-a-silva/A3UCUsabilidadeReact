import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import HeaderAuth from "../../components/Header/HeaderAuth";
import { isAuthenticated } from "../../utils/auth";
import { getAllJogos, getPublicJogos, getCategoriaById } from "../../api/jogos";
import { addCarrinho, removeCarrinho, getCarrinho } from "../../api/carrinho";
import { addFavorito, removeFavorito, getFavoritos } from "../../api/favoritos";
import { mostrarMensagem } from "../../utils/alerta";
import { atualizarHeaderCarrinho } from "../../utils/headerUtil";
import { getJogosComTotalVendas, getTopJogosPorEmpresa } from "../../api/vendas";
import "./Home.css";

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [autenticado, setAutenticado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalJogosAberto, setModalJogosAberto] = useState(false);

  // Top geral e top por empresa
  const [topJogos, setTopJogos] = useState([]);
  const [topJogosByEmpresas, setTopJogosByEmpresas] = useState([]);

  useEffect(() => {
    carregarTudo();
  }, []);

  async function carregarTudo(categoriaId = null) {
    try {
      setLoading(true);

      const tokenExiste = isAuthenticated();
      setAutenticado(tokenExiste);

      // 1) Carregar jogos (public ou autenticado)
      let dadosJogos = tokenExiste
        ? await getAllJogos()
        : await getPublicJogos();


      // 2) Filtrar categoria (se houver)
      if (categoriaId) {
        dadosJogos = dadosJogos.filter(j => j.fkCategoria === categoriaId);
      }

      // 3) Montar categorias (NÃO chama endpoint se fkCategoria é undefined!)
      const jogosBase = await Promise.all(
        dadosJogos.map(async jogo => {

          let categoriaNome = "Sem categoria";

          if (jogo.fkCategoria) {
            try {
              const cat = await getCategoriaById(jogo.fkCategoria);
              categoriaNome = cat?.nome || "Sem categoria";
            } catch { }
          }

          return {
            ...jogo,
            categoriaNome
          };
        })
      );


      // 4) Se o usuário NÃO estiver autenticado, não carrega vendas
      if (!tokenExiste) {
        setJogos(jogosBase);
        setTopJogos([]); // esconde ranking
        return;
      }

      // 5) Buscar vendas REAIS
      const jogosComVenda = await getJogosComTotalVendas();

      // 6) Mesclar: jogoBase + totalVendido
      const jogosFinal = jogosBase.map(jogoBase => {
        const venda = jogosComVenda.find(j => j.id === jogoBase.id);

        return {
          ...jogoBase,              // mantém categoriaNome
          totalVendido: venda?.totalVendido || 0
        };
      });

      console.log("Jogos FINAL (categoria + vendas):", jogosFinal);

      setJogos(jogosFinal);


      // 7) Ranking real
      const ranking = jogosFinal
        .filter(j => j.totalVendido > 0)
        .sort((a, b) => b.totalVendido - a.totalVendido)
        .slice(0, 10);

      console.log("Ranking de jogos mais vendidos:", ranking);

      setTopJogos(ranking);

      // 8) Carrinho + favoritos
      const [carrinhoAPI, favoritosAPI] = await Promise.all([
        getCarrinho(),
        getFavoritos()
      ]);

      setCarrinho(carrinhoAPI);

      setFavoritos(
        Array.isArray(favoritosAPI)
          ? favoritosAPI.map(f => ({
            jogoId: f.jogoId || f.jogo?.id || f.id
          }))
          : []
      );

      // 9) Top por empresa (fixo, independente de categoria)
      if (tokenExiste) {
        const empresasRanking = await getTopJogosPorEmpresa();
        setTopJogosByEmpresas(empresasRanking.top5);
      }


    } catch (err) {
      console.error(" Erro ao carregar dados:", err);
      setJogos([]);
      setCarrinho([]);
      setFavoritos([]);
      setTopJogos([]);
    } finally {
      setLoading(false);
    }
  }


  // --------------------------------------------------
  //  Utilitários
  // --------------------------------------------------


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

  // --------------------------------------------------
  //  Renderização
  // --------------------------------------------------

  if (autenticado === null) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Carregando...</p>;
  }

  return (
    <div>
      {autenticado ? (
        <HeaderAuth carregarTudo={carregarTudo} loading={loading} />
      ) : (
        <Header />
      )}

      {loading && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Filtrando jogos...
        </p>
      )}


      {/* -------------------------------------------------- */}
      {/*  HERO BANNER  */}
      {/* -------------------------------------------------- */}
      <section class="hero-banner hero-minimal">
        <div class="hero-text">
          <h2>Bem-vindo ao EduGames</h2>
          <p>Jogos, ofertas e lançamentos — encontre o melhor para você.</p>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/*  TOP 10 GERAL - AGORA COMO CARROSSEL */}
      {/* -------------------------------------------------- */}
      <div className="ranking-card">
        <section className="top10-section">

          <div className="titulo-secao">
            <span className="subtitulo">OS MAIS VENDIDOS</span>
            <h2>Top 10 Jogos</h2>
          </div>

          {topJogos.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.7 }}>
              Não foi possível carregar o ranking de jogos mais vendidos.
            </p>
          ) : (
            <div className="carousel-wrapper">

              {/* Botão ANTERIOR */}
              <button className="carousel-btn prev" onClick={() => {
                document.querySelector(".carousel-container")
                  .scrollBy({ left: -400, behavior: "smooth" });
              }}>
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* Container dos cards */}
              <div className="carousel-container">

                {topJogos.map((jogo, index) => (
                  <Link to={`/jogo/${jogo.id}`}>
                    <div className="carousel-card" key={jogo.id ?? index}>
                      {index === 0 && <div className="badge-ouro">🏆 Primeiro Lugar!</div>}
                      <img
                        src="https://placehold.co/400x300?text=Jogo"
                        alt={jogo.nome}
                      />

                      <div className="carousel-info">
                        <h3>{index + 1}. {jogo.nome}</h3>

                        <div className="preco-comprar">
                          <span className="tag">Mais Vendido</span>
                          <div className="rating">Vendas: {jogo.totalVendido || jogo.total}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

              </div>

              {/* Botão PRÓXIMO */}
              <button className="carousel-btn next" onClick={() => {
                document.querySelector(".carousel-container")
                  .scrollBy({ left: 400, behavior: "smooth" });
              }}>
                <i className="fas fa-chevron-right"></i>
              </button>

            </div>
          )}

        </section>
      </div>

      {/* -------------------------------------------------- */}
      {/*  TOP 5 POR EMPRESA */}
      {/* -------------------------------------------------- */}
      <section className="top10-section">
        <div className="titulo-secao">
          <span className="subtitulo">AS QUE MAIS VENDEM</span>
          <h2>Top 5 Empresas</h2>
        </div>

        {topJogosByEmpresas.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            Não foi possível carregar o ranking de empresas.
          </p>
        ) : (
          <div className="top10-grid">
            {topJogosByEmpresas.map((emp, index) => (
              <div
                key={index}
                className="top10-card"
                style={{
                  border: index === 0 ? "3px solid gold" : "1px solid #333",
                  position: "relative"
                }}
              >
                {index === 0 && <div className="badge-ouro">👑 Empresa #1</div>}
                {index != 0 && <div className="top10-rank">{index + 1}</div>}

                <div className="top10-info">
                  <h3 className="categoria-badge">{emp.empresaNome}</h3>
                  <h3>🎮 {emp.jogo}</h3>
                  <div className="rating">Total de vendas: {emp.total}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/*  LISTA DE TODOS OS JOGOS */}
      {/* -------------------------------------------------- */}
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
                  <Link to={`/jogo/${jogo.id}`}>
                    <img
                      src={
                        jogo.imagem ||
                        "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=400&fit=crop"
                      }
                      alt={`Capa do jogo ${jogo.nome}`}
                    />
                  </Link>
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
                      {autenticado ? (
                        <Link to={`/jogo/${jogo.id}`} className="btn-comprar">
                          <i className="fas fa-arrow-right"></i> Saiba mais
                        </Link>
                      ) : (
                        <buttons
                          className="btn-comprar"
                          onClick={() =>
                            mostrarMensagem(
                              "Você precisa estar logado para comprar jogos.",
                              "info"
                            )
                          }
                        >
                          <i className="fas fa-arrow-right"></i> Saiba mais
                        </buttons>
                      )}

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
                            ? mostrarMensagem(
                              "Você já comprou este jogo.",
                              "info"
                            )
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
                        className={`btn-favorito ${nosFavoritos ? "ativo" : ""
                          }`}
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
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Nenhum jogo encontrado.
            </p>
          )}
        </div>
      </section>


      <button
        className="btn-flutuante"
        onClick={() => setModalJogosAberto(true)}
      >
        🎮 Jogue Agora
      </button>

      {modalJogosAberto && (
        <div className="modal-jogos" onClick={(e) => {
          if (e.target.classList.contains("modal-jogos")) {
            setModalJogosAberto(false);
          }
        }}>
          <div className="modal-content-jogos">
            <span
              className="close-jogos"
              onClick={() => setModalJogosAberto(false)}
            >
              &times;
            </span>

            <h2>Escolha um Jogo!</h2>

            <div className="jogos-grid">
              <iframe
                src="https://playpager.com/embed/checkers/index.html"
                title="Online Checkers Game"
                scrolling="no"
              ></iframe>
              <iframe
                src="https://playpager.com/embed/reversi/index.html"
                title="Online Othello Game"
                scrolling="no"
              ></iframe>
              <iframe
                src="https://playpager.com/embed/cubes/index.html"
                title="Cubes Game"
                scrolling="no"
              ></iframe>
            </div>

          </div>
        </div>
      )}

    </div >


  );
}
