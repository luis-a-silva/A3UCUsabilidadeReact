import { useEffect } from "react";
import logo from "../../assets/logo_edugames.png";
import { alternarModos } from "../../utils/tema";
import "./Header.css";

export default function Header() {
  useEffect(() => {
    alternarModos();
  }, []);

  const irParaLogin = () => {
    window.location.href = "/login";
  };

  return (
    <header className="cabecalho">
      <a href="/" className="logo">
        <img src={logo} alt="EduGames Logo" className="logo-login" />
      </a>

      <nav className="navegacao">
        <button className="btn-primario" onClick={irParaLogin}>
          Entrar / Cadastre-se
        </button>

        {/* Botões do modo claro/escuro com IDs exigidos pelo tema.js */}
        <button aria-label="Modo claro" id="whiteMode" className="btn-primario">
          <i className="fas fa-sun"></i>
        </button>

        <button
          aria-label="Modo escuro"
          id="darkMode"
          className="btn-secundario"
          style={{ display: "none" }}
        >
          <i className="fas fa-moon"></i>
        </button>
      </nav>
    </header>
  );
}
