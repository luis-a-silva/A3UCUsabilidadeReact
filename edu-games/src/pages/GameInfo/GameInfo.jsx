import { useEffect, useState } from "react";
import { mostrarMensagem } from "../../utils/alerta";
import { getJogoById, getAvaliacoesByJogo, getMediaAvaliacao } from "../../api/jogos";
import { useParams, useNavigate } from "react-router-dom";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import { isAuthenticated } from "../../utils/auth";
import { addCarrinho, removeCarrinho, getCarrinho } from "../../api/carrinho";
import { getEmpresaById } from "../../api/empresa";
import "./GameInfo.css";
import { atualizarHeaderCarrinho } from "../../utils/headerUtil";

export default function GameInfo() {
  const navigate = useNavigate(); // 👈 usado para redirecionar
  const { jogoId } = useParams();
  const [jogo, setJogo] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(0);
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [noCarrinho, setNoCarrinho] = useState(false); // 👈 controla o botão

  useEffect(() => {

    const tokenExiste = isAuthenticated();

    // 👇 Se o usuário não estiver autenticado, redireciona
    if (!tokenExiste) {
      mostrarMensagem("Você precisa estar logado para acessar esta página.", "info");
      navigate("/login");
      return;
    }

    async function carregarDados() {
      try {
        setAutenticado(tokenExiste);

        // 🔹 Jogo
        const jogoData = await getJogoById(jogoId);
        setJogo(jogoData);

        // 🔹 Empresa
        if (jogoData?.fkEmpresa) {
          const empresaData = await getEmpresaById(jogoData.fkEmpresa);
          setEmpresa(empresaData);
        }

        // 🔹 Categoria
        if (jogoData?.fkCategoria) {
          try {
            const categoriaData = await getCategoriaById(jogoData.fkCategoria);
            setCategoria(categoriaData?.nome || "Sem categoria");
          } catch {
            setCategoria("Sem categoria");
          }
        }

        // 🔹 Avaliações
        const [avaliacoesData, mediaData] = await Promise.all([
          getAvaliacoesByJogo(jogoId),
          getMediaAvaliacao(jogoId),
        ]);
        setAvaliacoes(avaliacoesData);
        setMedia(mediaData);

        // 🔹 Carrinho — só se logado
        if (tokenExiste) {
          const carrinhoItens = await getCarrinho();
          const estaNoCarrinho = carrinhoItens.some(
            (item) => item.jogoId === Number(jogoId)
          );
          setNoCarrinho(estaNoCarrinho);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do jogo:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [jogoId]);

  // 🔹 Alternar carrinho
  async function toggleCarrinho(jogoId) {
    if (!autenticado) {
      mostrarMensagem("Você precisa estar logado para adicionar ao carrinho.", "info");
      return;
    }

    try {
      if (noCarrinho) {
        const res = await removeCarrinho(jogoId);
        mostrarMensagem(res.message || "Item removido do carrinho!", "info");
        setNoCarrinho(false);
      } else {
        const res = await addCarrinho(jogoId);
        mostrarMensagem(res.message || "Item adicionado ao carrinho!", "success");
        setNoCarrinho(true);
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

  // 🔹 Estados de carregamento e erro
  if (loading) return <p style={{ textAlign: "center", marginTop: "30px" }}>Carregando...</p>;
  if (!jogo) return <p style={{ textAlign: "center", marginTop: "30px" }}>Jogo não encontrado.</p>;

  return (
    <>
      {autenticado ? <HeaderAuth /> : <Header />}

      <main className="container">
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
              Empresa: {empresa ? <a href="#">{empresa.nome}</a> : <span>Não informada</span>}
            </p>

            <div className="categorias-jogo">
              <span className="tag">{categoria || "Sem categoria"}</span>
            </div>

            <p className="preco-jogo">
              R$ {Number(jogo.preco).toFixed(2).replace(".", ",")}
            </p>

            <div className="area-botoes">
              <button className="btn-comprar-grande">Comprar Agora</button>

              {/* 🔹 Botão dinâmico do carrinho */}
              <button
                className={`btn-adicionar-carrinho-grande ${noCarrinho ? "ativo" : ""}`}
                onClick={() => toggleCarrinho(jogo.id)}
              >
                <i
                  className={`fas ${noCarrinho ? "fa-cart-arrow-down" : "fa-cart-plus"
                    }`}
                ></i>{" "}
                {noCarrinho ? "Remover do carrinho" : "Adicionar ao carrinho"}
              </button>
            </div>

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
                <div key={av.id} className="comentario-usuario">
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
