import "./gameInfo.css";
import { useParams } from "react-router-dom";

export default function GameInfo() {
  const { id } = useParams(); // pegar id pela URL

  return (
    <section className="game-info">
      <h2>Detalhes do Jogo - {id}</h2>
      <button className="btn-primario">Adicionar ao Carrinho</button>
    </section>
  );
}
