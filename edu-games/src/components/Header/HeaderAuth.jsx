import { useEffect } from "react";
import logo from "../../assets/logo_edugames_horizontal.png";
import { alternarModos } from "../../utils/tema";
import { inicializarDropdownPerfil } from "../../utils/perfilDropdown";
import { inicializarMenuLateral } from "../../utils/menuLateral";
import "./Header.css";

export default function HeaderAuth() {
  useEffect(() => {
    // Inicializa comportamentos utilitários
    alternarModos();
    inicializarDropdownPerfil();
    inicializarMenuLateral();
  }, []);

  // 🔹 Função para sair da conta
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="cabecalho">
      {/* Botão do menu lateral */}
      <button
        className="btn-menu-hamburger"
        id="btn-menu"
        aria-label="Abrir menu"
        aria-expanded="false"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Logo */}
      <a href="/" className="logo">
        <img src={logo} alt="EduGames Logo" />
      </a>

      {/* Barra de busca */}
      <div className="barra-busca">
        <input type="text" placeholder="Procurar jogos..." />
        <button aria-label="Buscar">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Navegação principal */}
      <nav className="navegacao">
        {/* Dropdown do perfil */}
        <div className="dropdown perfil-dropdown">
          <button className="btn-secundario" id="btnPerfil">
            <i className="fas fa-user"></i> Meu Perfil{" "}
            <i className="fas fa-chevron-down"></i>
          </button>

          <ul className="dropdown-menu" id="menuPerfil">
            <li><a href="#">Acessar meu perfil</a></li>
            <li><a href="#">Lista de Favoritos</a></li>
            <li>
              <button className="btn-link" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Sair
              </button>
            </li>
          </ul>
        </div>

        {/* Botão do carrinho */}
        <button className="btn-primario" id="btnCarrinho" aria-label="Carrinho">
          <i className="fas fa-shopping-cart"></i>
          <span className="badge" id="cartCount">0</span>
        </button>

        {/* Botões de tema */}
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
