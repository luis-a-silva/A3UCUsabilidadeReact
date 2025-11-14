import { useEffect, useState } from "react";
import HeaderAuth from "../../components/Header/HeaderAuth";
import { mostrarMensagem } from "../../utils/alerta";
import { getHistoricoCompras } from "../../api/vendas"; // ✅ novo endpoint completo
import { jwtDecode } from "jwt-decode";
import "./User.css";

export default function User() {
    const [usuario, setUsuario] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [ultimaCompra, setUltimaCompra] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarPerfil() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    mostrarMensagem("Você precisa estar logado para acessar o perfil.", "info");
                    window.location.href = "/login";
                    return;
                }

                // 🔹 Decodifica token
                const decoded = jwtDecode(token);
                setUsuario({
                    nome: decoded.nome || decoded.name || "Usuário",
                    email: decoded.email || "Não informado",
                });

                // 🔹 Busca histórico de compras
                const dadosHistorico = await getHistoricoCompras();
                console.log("📦 Histórico de compras:", dadosHistorico);
                setHistorico(dadosHistorico);

                if (Array.isArray(dadosHistorico) && dadosHistorico.length > 0) {
                    // Ordena pela data (mais recente primeiro)
                    const ordenado = [...dadosHistorico].sort(
                        (a, b) => new Date(b.data) - new Date(a.data)
                    );
                    setUltimaCompra(ordenado[0]);
                }
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
                mostrarMensagem("Erro ao carregar dados do perfil.", "danger");
            } finally {
                setLoading(false);
            }
        }

        carregarPerfil();
    }, []);

    if (loading)
        return <p style={{ textAlign: "center", marginTop: "30px" }}>Carregando...</p>;

    return (
        <>
            <HeaderAuth />
            <div className="content">

                <main className="layout-perfil">
                    {/* 🔹 Sidebar com dados do usuário */}
                    <aside className="perfil-sidebar">
                        <h2>Meu Perfil</h2>

                        <div className="perfil-info-box">
                            <div className="foto-placeholder">
                                <span>Foto do Usuário</span>
                            </div>

                            <div className="info-item">
                                <span>Nome</span>
                                <p>{usuario?.nome}</p>
                            </div>

                            <div className="info-item">
                                <span>Alterar sua credencial de acesso</span>
                                <input type="password" name="password" id="password" placeholder="Digite sua nova senha"/>
                                <button className="btn-secundario">Alterar credencial</button>
                            </div>
                        </div>

                    </aside>

                    {/* 🔹 Histórico de pedidos */}
                    <section className="pedidos-secao">
                        <h2>Seus Pedidos</h2>

                        {historico.length === 0 ? (
                            <p style={{ textAlign: "center", marginTop: "20px" }}>
                                Nenhuma compra realizada ainda.
                            </p>
                        ) : (
                            <div className="pedidos-container">
                                {historico.map((pedido) => (
                                    <div key={pedido.id} className="pedido-card">
                                        <h3>Compra #{pedido.id}</h3>
                                        <p>
                                            {pedido.itens?.length || 0} itens - Total: R${" "}
                                            {Number(pedido.total || 0).toFixed(2).replace(".", ",")}
                                        </p>
                                        <p>
                                            Data:{" "}
                                            {new Date(pedido.data).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </p>

                                        {/* 🔹 Lista de jogos comprados */}
                                        <ul className="lista-jogos-compra">
                                            {pedido.itens.map((jogo, idx) => (
                                                <li key={idx}>
                                                    🎮 <strong>{jogo.nomeJogo}</strong> —{" "}
                                                    R$ {Number(jogo.preco || 0).toFixed(2).replace(".", ",")}
                                                    <br />

                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}
