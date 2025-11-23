import logo from "../../assets/logo_edugames_horizontal.png";
import "./Admin.css"
import { Link } from "react-router-dom";

export default function HeaderAdmin() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };
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

            {/* Navegação principal */}
            <nav className="navegacao-admin">
        <div className="links">
                <Link to="/admin/dashboard" className="link-admin">  Dashboard</Link>
                <Link to="/admin/user" className="link-admin">  Usuário</Link>
                <Link to="/admin/empresa" className="link-admin"> Empresa</Link>
                <Link to="/admin/jogo" className="link-admin">  Jogos</Link>
        </div>

                <button className="btn-primario" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Sair
                </button>
            </nav>
            <section className="admin-panel">
                <h2>Painel Administrativo</h2>
                <p>Gerencie jogos, usuários e pedidos.</p>
            </section>
        </>
    )
}