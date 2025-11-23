import "./footer.css";
import torreEsquerda from "../../assets/torre-relogio-lado-esquerdo.png";
import torreDireita from "../../assets/torre-relogio-lado-direito.png";

export default function Footer() {
  return (
     <div className="footer-wrapper">
      <img
        src={torreEsquerda}
        alt="Torre decorativa esquerda"
        className="torre-decorativa torre-esquerda"
      />
      <img
        src={torreDireita}
        alt="Torre decorativa direita"
        className="torre-decorativa torre-direita"
      />
      <footer className="rodape">
        <div className="rodape-links">
          <a href="#">Sobre</a>
          <a href="#">Suporte</a>
          <a href="#">Contato</a>
        </div>

        <p>© 2025 EduGames. Todos os direitos reservados.</p>

        <div className="icones-sociais">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-youtube"></i></a>
        </div>
      </footer>
    </div>
  );
}
