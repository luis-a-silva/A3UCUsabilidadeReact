import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import HeaderAuth from "../../components/Header/HeaderAuth";
import { isAuthenticated } from "../../utils/auth";
import axios from "axios";
import "./Home.css"; // opcional se tiver CSS da grade

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está logado
    setAutenticado(isAuthenticated());

    // Busca os jogos públicos
    async function carregarJogos() {
      try {
        const response = await axios.get("http://localhost:8080/public/jogos");
        setJogos(response.data);
      } catch (err) {
        console.error("Erro ao carregar jogos:", err);
      }
    }

    carregarJogos();
  }, []);

  return (
    <>
      {/* Header muda conforme login */}
      {autenticado ? <HeaderAuth /> : <Header />}

      {/* Seção de jogos */}
      <section className="games-section">
        <div className="titulo-secao">
          <span className="subtitulo">CONFIRA TAMBÉM</span>
          <h2>Todos os Jogos</h2>
        </div>

        <div className="grade-jogos">
          {jogos.length > 0 ? (
            jogos.map((jogo, index) => (
              <div className="cartao-jogo" key={index}>
                {/* Se a API não retornar imagem, usa placeholder */}
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
                    {jogo.categoria?.trim() || "Sem categoria"}
                  </p>
                  <div className="preco-comprar">
                    <p className="preco">
                      R$ {Number(jogo.preco).toFixed(2).replace(".", ",")}
                    </p>
                    <div className="acoes-jogo">
                      <button className="btn-comprar">
                        <i className="fas fa-shopping-bag"></i> Comprar
                      </button>
                      <button className="btn-add-cart">
                        <i className="fas fa-cart-plus"></i>
                      </button>
                      <button className="btn-favorito">
                        <i className="fas fa-star"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Carregando jogos...
            </p>
          )}
        </div>
      </section>
    </>
  );
}
