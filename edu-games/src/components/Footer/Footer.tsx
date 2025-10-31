import "./footer.css";

export default function Footer() {
  return (
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
  );
}
