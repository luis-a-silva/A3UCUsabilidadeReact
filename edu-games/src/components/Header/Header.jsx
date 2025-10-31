import "./Header.css";
import logo from "../../assets/logo_edugames.png";

export default function Header() {
  return (
    <header className="cabecalho">
      <a href="/" className="logo">
        <img src={logo} alt="EduGames Logo" className="logo-login" />
      </a>
      
      <nav className="navegacao">
        <button className="btn-secundario">Entrar</button>
        <button className="btn-primario">Cadastre-se</button>
        <button aria-label="Modo claro" className="btn-primario">
          <i className="fas fa-sun"></i>
        </button>

        <button aria-label="Modo escuro" className="btn-secundario">
          <i className="fas fa-moon"></i>
        </button>
      </nav>
    </header>
  );
}
