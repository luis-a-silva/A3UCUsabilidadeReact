import logo from "../../assets/logo_edugames_horizontal.png";
import "./Admin.css";
import { Link, useLocation } from "react-router-dom";

export default function HeaderAdmin() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const location = useLocation();

    const isActive = (path) => location.pathname.includes(path) ? "nav-btn ativo" : "nav-btn";

    return (
        <header className="admin-header">

            <div className="header-logo-area">
                <Link to="/">
                    <img 
                        src={logo} 
                        alt="EduGames" 
                        className="logo-icone"
                    />
                </Link>
            </div>

            <nav className="header-nav-container">
                <span className="titulo-painel-nav">Painel Administrativo:</span>
                
                <Link to="/admin/dashboard" className={isActive("dashboard")}>
                    Dashboard
                </Link>
                <Link to="/admin/usuarios" className={isActive("usuarios")}>
                    Usuários
                </Link>
                <Link to="/admin/empresas" className={isActive("empresas")}>
                    Empresas
                </Link>
                <Link to="/admin/jogos" className={isActive("jogos")}>
                    Jogos
                </Link>
            </nav>

            <div className="header-sair-area">
                <button className="btn-sair" onClick={handleLogout}>
                    Sair ➡
                </button>
            </div>
        </header>
    );
}