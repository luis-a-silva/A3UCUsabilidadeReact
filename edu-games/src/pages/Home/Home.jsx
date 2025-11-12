import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import HeaderAuth from "../../components/Header/HeaderAuth";
import { isAuthenticated } from "../../utils/auth";
import { getAllJogos, getPublicJogos } from "../../api/jogos";
import { addCarrinho, removeCarrinho, getCarrinho } from "../../api/carrinho";
import { addFavorito, removeFavorito, getFavoritos } from "../../api/favoritos";
import { mostrarMensagem } from "../../utils/alerta";
import "./Home.css";
import { atualizarHeaderCarrinho } from "../../utils/headerUtil";

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [autenticado, setAutenticado] = useState(null);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    async function carregarTudo() {
      try {
        const tokenExiste = isAuthenticated();
        setAutenticado(tokenExiste);

        const dadosJogos = tokenExiste
          ? await getAllJogos()
          : await getPublicJogos();

        setJogos(Array.isArray(dadosJogos) ? dadosJogos : []);

        if (tokenExiste) {
          const [carrinhoAPI, favoritosAPI] = await Promise.all([
            getCarrinho(),
            getFavoritos(),
          ]);

          // já vem normalizado
          setCarrinho(carrinhoAPI);
          setFavoritos(
            Array.isArray(favoritosAPI)
              ? favoritosAPI.map((f) => ({
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
      }
    }

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
    <div className="content">
      {autenticado ? <HeaderAuth /> : <Header />}

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
                    <p className="categoria">{jogo.categoria?.trim() || "Sem categoria"}</p>
                    <div className="preco-comprar">
                      <p className="preco">
                        R$ {Number(jogo.preco).toFixed(2).replace(".", ",")}
                      </p>


                      <div className="acoes-jogo">

                        {autenticado ?
                        <Link to={`/jogo/${jogo.id}`} className="btn-comprar">
                          <i className="fas fa-arrow-right"></i> Ir para
                        </Link>
                        
                        :
                         <buttons className="btn-comprar" onClick={() => mostrarMensagem("Você precisa estar logado para comprar jogos.", "info")}>
                          <i className="fas fa-arrow-right"></i> Ir para
                        </buttons>
                        }

                        {/* Carrinho */}
                        <button
                          className={`btn-add-cart ${noCarrinho ? "ativo" : ""}`}
                          onClick={() => toggleCarrinho(jogo.id)}
                        >
                          <i
                            className={`fas ${noCarrinho ? "fa-cart-arrow-down" : "fa-cart-plus"
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
