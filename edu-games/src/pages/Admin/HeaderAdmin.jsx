import logo from "../../assets/logo_edugames_horizontal.png";
import "./Admin.css";
import { Link, useLocation } from "react-router-dom";

export default function HeaderAdmin() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const location = useLocation();

    // Função para marcar o botão ativo
    const isActive = (path) => location.pathname === path ? "nav-btn ativo" : "nav-btn";

    return (
        <header className="admin-header">
            {/* Esquerda: Logo */}
            <div className="header-logo-area">
                <Link to="/">
                    <img 
                        src={logo} 
                        alt="EduGames" 
                        className="logo-icone"
                    />
                </Link>
            </div>

            {/* Centro: Navegação Unificada */}
            <nav className="header-nav-container">
                <span className="titulo-painel-nav">Painel Administrativo:</span>
                
                <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
                    Dashboard
                </Link>
                <Link to="/admin/user" className={isActive("/admin/user")}>
                    Usuários
                </Link>
                <Link to="/admin/empresa" className={isActive("/admin/empresa")}>
                    Empresas
                </Link>
                <Link to="/admin/jogos" className={isActive("/admin/jogos")}>
                    Jogos
                </Link>
            </nav>

            {/* Direita: Botão Sair */}
            <div className="header-sair-area">
                <button className="btn-sair" onClick={handleLogout}>
                    Sair ➡
                </button>
            </div>
        </header>
    );
}