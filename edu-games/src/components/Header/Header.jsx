import { useEffect } from "react";
import logo from "../../assets/logo_edugames_horizontal.png";
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
    <>
      <header className="cabecalho">
        <a href="/" className="logo">
          <img src={logo} alt="EduGames Logo" className="logo-login" />
        </a>

      </header>

      <nav className="navbar">
        {/* 🔹 Dropdowns à esquerda */}
        <div className="navbar-left">
          <ul className="navbar-menu">
            <li className="dropdown">
              <button className="dropdown-toggle">
                Categorias <i className="fas fa-chevron-down"></i>
              </button>
              <ul className="dropdown-menu">
                <li><a href="#">Ação</a></li>
                <li><a href="#">Aventura</a></li>
                <li><a href="#">RPG</a></li>
                <li><a href="#">Puzzle</a></li>
                <li><a href="#">Simulação</a></li>
              </ul>
            </li>

            <li className="dropdown">
              <button className="dropdown-toggle">
                Ajuda <i className="fas fa-chevron-down"></i>
              </button>
              <ul className="dropdown-menu">
                <li><a href="#">Central de Suporte</a></li>
                <li><a href="#">Políticas</a></li>
                <li><a href="#">Contato</a></li>
              </ul>
            </li>
          </ul>
        </div>

        
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
      </nav>
    </>
  );
}
