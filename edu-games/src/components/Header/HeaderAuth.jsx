import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo_edugames_horizontal.png";
import { alternarModos } from "../../utils/tema";
import { atualizarHeaderCarrinho } from "../../utils/headerUtil";
import { inicializarDropdownPerfil } from "../../utils/perfilDropdown";
import "./Header.css";

export default function HeaderAuth() {

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        alternarModos();
        inicializarDropdownPerfil();
        atualizarHeaderCarrinho(); // ✅ Atualiza ao montar
    }, []);

    // 🔹 Função para sair da conta
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleDropDown = () => {
        inicializarDropdownPerfil();
    }

    return (
        <>
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

                {/* 🔹 Campo de busca central */}
                <div className="barra-busca">
                    <input
                        type="text"
                        placeholder="Buscar jogos..."
                        aria-label="Buscar jogos"
                    />
                    <button aria-label="Buscar">
                        <i className="fas fa-search"></i>
                    </button>
                </div>


                {/* Navegação principal */}
                <nav className="navegacao">


                    {/* Dropdown do perfil */}
                    <div className="dropdown perfil-dropdown">
                        <button className="btn-secundario" id="btnPerfil" onClick={handleDropDown}>
                            <i className="fas fa-user"></i> Meu Perfil{" "}
                            <i className="fas fa-chevron-down"></i>
                        </button>

                        <ul className="dropdown-menu" id="menuPerfil">
                            <li><a href="#">Acessar meu perfil</a></li>
                            <li><a href="#">Lista de Favoritos</a></li>
                            <li>
                                <button className="btn-primario" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i> Sair
                                </button>
                            </li>
                        </ul>
                    </div>



                    {/* Botão do carrinho com contador dinâmico */}
                    <Link to="/cart" className="btn-secundario" id="btnCarrinho" aria-label="Carrinho">
                        <i className="fas fa-shopping-cart"></i>
                        <span className="badge" id="cartCount">{cartCount}</span>
                    </Link>

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
            </nav>
        </>
    );
}
