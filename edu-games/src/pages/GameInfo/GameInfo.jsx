import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import { isAuthenticated } from "../../utils/auth";
import { getJogoById, getAvaliacoesByJogo, getMediaAvaliacao, getJogosPorCategoria } from "../../api/jogos";
import { getEmpresaById } from "../../api/empresa";
import "./GameInfo.css";

export default function GameInfo() {
  const { jogoId } = useParams();
  const [jogo, setJogo] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(0);
  const [categoria, setCategoria] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const tokenExiste = isAuthenticated();
        setAutenticado(tokenExiste);

        const jogoData = await getJogoById(jogoId);
        setJogo(jogoData);
        console.log("Dados do jogo:", jogoData);
        if (jogoData?.fkEmpresa) {
          const empresaData = await getEmpresaById(jogoData.fkEmpresa);
          setEmpresa(empresaData);
        }

        // 🔹 Categoria
        if (jogoData?.fkCategoria) {
          try {
            const categoriaData = await getJogosPorCategoria(jogoData.fkCategoria);
            // A API pode retornar { id: 20, nome: "Aventura" }
            setCategoria(categoriaData?.nome || "Sem categoria");
          } catch {
            setCategoria("Sem categoria");
          }
        } else {
          setCategoria("Sem categoria");
        }


        const [avaliacoesData, mediaData] = await Promise.all([
          getAvaliacoesByJogo(jogoId),
          getMediaAvaliacao(jogoId),
        ]);

        setAvaliacoes(avaliacoesData);
        setMedia(mediaData);
      } catch (err) {
        console.error("Erro ao carregar dados do jogo:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [jogoId]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "30px" }}>Carregando...</p>;
  }

  if (!jogo) {
    return <p style={{ textAlign: "center", marginTop: "30px" }}>Jogo não encontrado.</p>;
  }

  return (
    <>
      {autenticado ? <HeaderAuth /> : <Header />}

      <main className="container">
        {/* 🔹 Detalhes do Jogo */}
        <section className="secao-detalhes-jogo">
          <div className="imagem-jogo">
            <img
              src={
                jogo.imagem ||
                "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop"
              }
              alt={`Capa do jogo ${jogo.nome}`}
            />
          </div>

          <div className="info-jogo">
            <h1 className="nome-jogo">{jogo.nome}</h1>

            <p className="empresa-jogo">
              Empresa:{" "}
              {empresa ? (
                <a href="#">{empresa.nome}</a>
              ) : (
                <span>Não informada</span>
              )}
            </p>

            <div className="categorias-jogo">
              <span className="tag">{categoria || "Sem categoria"}</span>
            </div>

            <p className="preco-jogo">
              R${" "}
              {Number(jogo.preco).toFixed(2).replace(".", ",")}
            </p>

            <button className="btn-comprar btn-comprar-grande">
              Comprar Agora
            </button>

            <h2 className="titulo-descricao">Descrição completa do jogo</h2>
            <p className="texto-descricao">
              {jogo.descricao?.replace(/"/g, "") || "Descrição não disponível."}
            </p>
          </div>
        </section>

        {/* 🔹 Avaliações */}
        <section className="secao-avaliacoes">
          <h2 className="titulo-secao-avaliacoes">Avaliações e Comentários</h2>

          <div className="avaliacao-geral">
            <span>Avaliação Média:</span>
            <div className="estrelas">
              {Array.from({ length: 5 }, (_, i) => {
                const rating = i + 1;
                return (
                  <i
                    key={i}
                    className={`fas ${rating <= Math.floor(media)
                      ? "fa-star"
                      : rating - media <= 0.5
                        ? "fa-star-half-alt"
                        : "fa-star-o"
                      }`}
                  ></i>
                );
              })}
            </div>
            <span className="info-avaliacoes">
              ({media ? media.toFixed(1) : "0"} de 5) –{" "}
              {avaliacoes.length > 0
                ? `baseada em ${avaliacoes.length} avaliações`
                : "sem avaliações ainda."}
            </span>
          </div>

          {avaliacoes.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Nenhuma avaliação encontrada para este jogo.
            </p>
          ) : (
            <div className="lista-comentarios">
              {avaliacoes.map((av) => (
                <div
                  key={av.id}
                  className="comentario-usuario"
                  data-avaliacao-id={av.id}
                >
                  <div className="comentario-cabecalho">
                    <span className="nome-usuario">
                      Usuário: {av.usuario || "Anônimo"}
                    </span>
                    <span className="nota-usuario">Nota: {av.nota} ★</span>
                  </div>
                  <p className="texto-comentario">
                    {av.comentario || "Sem comentário."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
