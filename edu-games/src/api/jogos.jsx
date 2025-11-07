import { useEffect, useState, useRef } from "react";
import Header from "../../components/Header/Header";
import HeaderAuth from "../../components/Header/HeaderAuth";
import { isAuthenticated } from "../../utils/auth";
import { getAllJogos, getPublicJogos } from "../../api/jogos"; // 👈 importa funções prontas
import "./Home.css";

export default function Home() {
  const [jogos, setJogos] = useState([]);
  const [autenticado, setAutenticado] = useState(null);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    console.log("🔹 useEffect executado");
    const tokenExiste = isAuthenticated();
    console.log("🔹 Token encontrado?", tokenExiste);
    setAutenticado(tokenExiste);

    // 🔹 Carrega jogos conforme autenticação
    async function carregarJogos() {
      try {
        const dados = tokenExiste
          ? await getAllJogos() // usa endpoint autenticado
          : await getPublicJogos(); // usa endpoint público

        setJogos(dados);
      } catch (err) {
        console.error("Erro ao carregar jogos:", err);
      }
    }

    carregarJogos();
  }, []);

  console.log("Valor de autenticado:", autenticado);

  if (autenticado === null) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Carregando...</p>;
  }

  return (
    <div className="content">
      {/* Header correto conforme login */}
      {autenticado ? <HeaderAuth /> : <Header />}

      <section className="games-section">
        <div className="titulo-secao">
          <span className="subtitulo">CONFIRA TAMBÉM</span>
          <h2>Todos os Jogos</h2>
        </div>

        <div className="grade-jogos">
          {jogos.length > 0 ? (
            jogos.map((jogo, index) => (
              <div className="cartao-jogo" key={index}>
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
            <p style={{ textAlign: "center", marginTop: "20px" }}>Nenhum jogo encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}
