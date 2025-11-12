import { useEffect, useState } from "react";
import HeaderAuth from "../../components/Header/HeaderAuth";
import { getCarrinho, removeCarrinho } from "../../api/carrinho";
import { getJogoById } from "../../api/jogos";
import { mostrarMensagem } from "../../utils/alerta";
import "./Cart.css";

export default function Cart() {
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarCarrinho() {
      try {
        const data = await getCarrinho();
        const ativos = data.filter((i) => i.status === "A");

        // 🔹 Busca detalhes dos jogos e adiciona o preço
        const itensComPreco = await Promise.all(
          ativos.map(async (item) => {
            try {
              const jogo = await getJogoById(item.jogoId);
              return {
                ...item,
                nome: jogo.nome,
                preco: jogo.preco,
                imagem: jogo.imagem || null,
              };
            } catch (err) {
              console.error(`Erro ao buscar jogo ${item.jogoId}:`, err);
              return { ...item, nome: "Jogo não encontrado", preco: 0 };
            }
          })
        );

        setItens(itensComPreco);

        // 🔹 Soma total
        const soma = itensComPreco.reduce((acc, i) => acc + (i.preco || 0), 0);
        setTotal(soma);
      } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
        mostrarMensagem("Erro ao carregar carrinho!", "danger");
      } finally {
        setLoading(false);
      }
    }

    carregarCarrinho();
  }, []);

  async function removerItem(jogoId) {
    try {
      const res = await removeCarrinho(jogoId);
      mostrarMensagem(res.message || "Item removido do carrinho!", "info");

      const atualizado = itens.filter((i) => i.jogoId !== jogoId);
      setItens(atualizado);

      const soma = atualizado.reduce((acc, i) => acc + (i.preco || 0), 0);
      setTotal(soma);
    } catch (err) {
      console.error("Erro ao remover item:", err);
      mostrarMensagem("Erro ao remover item do carrinho!", "danger");
    }
  }

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "30px" }}>Carregando carrinho...</p>;
  }

  return (
    <>
      <HeaderAuth />
      <div className="content">

        <nav className="passos-progresso">
          <div className="passo passo-ativo">
            <span>1</span>
            <span className="rotulo-passo">Carrinho</span>
          </div>
          <div className="passo">
            <span>2</span>
            <span className="rotulo-passo">Pagamento</span>
          </div>
          <div className="passo">
            <span>3</span>
            <span className="rotulo-passo">Compra Realizada</span>
          </div>
        </nav>

        <main>
          <div className="layout-carrinho">
            <section className="carrinho-secao">
              <h2>Carrinho</h2>

              {itens.length === 0 ? (
                <div className="carrinho-vazio">
                  <div className="icone-carrinho-vazio">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </div>
                  <h3>Seu Carrinho Está Vazio</h3>
                  <p>
                    Você ainda não adicionou nenhum item no seu carrinho. Navegue no website
                    para encontrar ofertas incríveis!
                  </p>
                  <a href="/home" className="btn-descobrir">Descobrir Jogos</a>
                </div>
              ) : (
                <div className="lista-itens-carrinho">
                  {itens.map((item) => (
                    <div className="item-carrinho" key={item.jogoId}>
                      <img
                        src={item.imagem || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=200&h=200&fit=crop"}
                        alt={item.nome}
                      />
                      <div className="info-item-carrinho">
                        <h4>{item.nome}</h4>
                        <p>R$ {Number(item.preco || 0).toFixed(2).replace(".", ",")}</p>
                      </div>
                      <button
                        className="btn-add-cart"
                        onClick={() => removerItem(item.jogoId)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <aside className="resumo-compra-secao">
              <h3>Resumo da Compra</h3>
              <div className="linha-resumo">
                <span>Preço Oficial</span>
                <span>R$ {Number(total).toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="linha-resumo">
                <span>Desconto</span>
                <span>R$ 0,00</span>
              </div>
              <div className="total-resumo">
                <span>Total</span>
                <span>R$ {Number(total).toFixed(2).replace(".", ",")}</span>
              </div>
              {itens.length > 0 ? (
                <a href="/pagamento" className="btn-finalizar">
                  CONTINUAR PARA O PAGAMENTO
                </a>
              ) : (
                <a href="/home" className="btn-descobrir">
                  Descobrir Jogos
                </a>
              )}
              <span className="divisor-ou">Ou</span>
              <a href="/home" className="link-continuar-comprando">
                Continuar Comprando
              </a>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
