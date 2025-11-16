import { useEffect, useState } from "react";
import { mostrarMensagem } from "../../utils/alerta";
import { getJogoById, getAvaliacoesByJogo, getMediaAvaliacao, getCategoriaById, addAvaliacao} from "../../api/jogos";
import { useParams, useNavigate } from "react-router-dom";
import HeaderAuth from "../../components/Header/HeaderAuth";
import { isAuthenticated } from "../../utils/auth";
import { addCarrinho, removeCarrinho, getCarrinho } from "../../api/carrinho";
import { getEmpresaById } from "../../api/empresa";
import "./GameInfo.css";
import { atualizarHeaderCarrinho } from "../../utils/headerUtil";
import axios from "axios";


export default function GameInfo() {
  const navigate = useNavigate();
  const { jogoId } = useParams();
  const [jogo, setJogo] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(0);
  const [autenticado, setAutenticado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [carrinho, setCarrinho] = useState([]);
  const [novaNota, setNovaNota] = useState(0);
  const [novoComentario, setNovoComentario] = useState("");
  const [jogoComprado, setJogoComprado] = useState(false);

  useEffect(() => {
    const tokenExiste = isAuthenticated();

    if (!tokenExiste) {
      mostrarMensagem("Você precisa estar logado para acessar esta página.", "info");
      navigate("/login");
      return;
    }

    async function carregarDados() {
      try {
        setAutenticado(tokenExiste);

        // 🔹 Busca jogo
        const jogoData = await getJogoById(jogoId);
        setJogo(jogoData);

        // 🔹 Empresa
        if (jogoData?.fkEmpresa) {
          const empresaData = await getEmpresaById(jogoData.fkEmpresa);
          setEmpresa(empresaData);
        }

        // 🔹 Categoria
        const categoriaData = await getCategoriaById(jogoData.fkCategoria);
        setCategoria(categoriaData?.nome || "Sem categoria");

        // 🔹 Avaliações 
        const avaliacoesData = await getAvaliacoesByJogo(jogoId);
        setAvaliacoes(avaliacoesData);
        console.log("Avaliações carregadas:", avaliacoesData);

        // 🔹 Médias 
        const mediaData = await getMediaAvaliacao(jogoId);
        setMedia(mediaData);
        console.log("Média carregada:", mediaData);

        // 🔹 Carrinho
        const carrinhoAPI = await getCarrinho();
        const jaComprou = carrinhoAPI.some(
          (item) => item.jogoId === Number(jogoId) && item.status === "F"
        );
        setCarrinho(carrinhoAPI);
        setJogoComprado(jaComprou);


      } catch (err) {
        console.error("Erro ao carregar dados do jogo:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [jogoId]);

  // 🔹 Função para verificar status do jogo
  function statusDoJogo(id) {
    const item = carrinho.find((i) => i.jogoId === Number(id));
    if (!item) return "fora"; // não está no carrinho
    if (item.status === "F") return "comprado"; // já comprado
    return "ativo"; // no carrinho ativo
  }

  // 🔹 Alternar carrinho (adicionar/remover)
  async function toggleCarrinho(jogoId) {
    if (!autenticado) {
      mostrarMensagem("Você precisa estar logado para adicionar ao carrinho.", "info");
      return;
    }

    const jogoStatus = statusDoJogo(jogoId);

    try {
      if (jogoStatus === "comprado") {
        mostrarMensagem("Você já comprou este jogo.", "info");
        return;
      }

      if (jogoStatus === "ativo") {
        const res = await removeCarrinho(jogoId);
        mostrarMensagem(res.message || "Item removido do carrinho!", "info");
        setCarrinho((prev) => prev.filter((i) => i.jogoId !== Number(jogoId)));
      } else {
        const res = await addCarrinho(jogoId);
        mostrarMensagem(res.message || "Item adicionado ao carrinho!", "success");
        setCarrinho((prev) => [
          ...prev,
          { jogoId: Number(jogoId), status: "A" },
        ]);
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

  // 🔹 Estados de carregamento
  if (loading)
    return <p style={{ textAlign: "center", marginTop: "30px" }}>Carregando...</p>;

  if (!jogo)
    return <p style={{ textAlign: "center", marginTop: "30px" }}>Jogo não encontrado.</p>;

  // 🔹 Status atual do jogo
  const jogoStatus = statusDoJogo(jogo.id);

  async function handleEnviarAvaliacao(e) {
    e.preventDefault();

    if (novaNota < 1 || novaNota > 5) {
      mostrarMensagem("Selecione uma nota de 1 a 5 estrelas.", "warning");
      return;
    }

    try {
      await addAvaliacao(Number(jogoId), novaNota, novoComentario);

      mostrarMensagem("Avaliação enviada com sucesso!", "success");

      // limpa o formulário
      setNovaNota(0);
      setNovoComentario("");

      // recarrega as avaliações
      const novasAvaliacoes = await getAvaliacoesByJogo(jogoId);
      setAvaliacoes(novasAvaliacoes);
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      mostrarMensagem(
        err.response?.data?.message || "Erro ao enviar avaliação.",
        "danger"
      );
    }
  }

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

              {/* 🔹 Botão dinâmico do carrinho */}
              <button
                className={`btn-adicionar-carrinho-grande ${jogoStatus === "ativo"
                  ? "ativo"
                  : jogoStatus === "comprado"
                    ? "comprado"
                    : ""
                  }`}
                onClick={() => toggleCarrinho(jogo.id)}
              >
                <i
                  className={`fas ${jogoStatus === "ativo"
                    ? "fa-cart-arrow-down"
                    : jogoStatus === "comprado"
                      ? "fa-check"
                      : "fa-cart-plus"
                    }`}
                ></i>
                {jogoStatus === "comprado"
                  ? " Você já comprou este jogo"
                  : jogoStatus === "ativo"
                    ? " Remover do carrinho"
                    : " Adicionar ao carrinho"}
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
                    <span>
                     Avaliador
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

          {jogoComprado && (
            <div className="form-avaliacao">
              <h3>Deixe sua Avaliação</h3>

              <form onSubmit={handleEnviarAvaliacao}>
                <div className="campo-estrelas">
                  <label htmlFor="nota">Nota:</label>
                  <div className="estrelas-input">
                    {Array.from({ length: 5 }, (_, i) => {
                      const rating = i + 1;
                      return (
                        <i
                          key={rating}
                          className={`fas fa-star ${rating <= novaNota ? "selecionada" : ""
                            }`}
                          onClick={() => setNovaNota(rating)}
                        ></i>
                      );
                    })}
                  </div>
                </div>

                <div className="campo-textarea">
                  <label htmlFor="comentario">Comentário:</label>
                  <textarea
                    id="comentario"
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    required
                    placeholder="Escreva o que achou do jogo..."
                  ></textarea>
                </div>

                <button type="submit" className="btn-primario">
                  Enviar Avaliação
                </button>
              </form>
            </div>
          )}

        </section>
      </main>
    </>
  );
}
