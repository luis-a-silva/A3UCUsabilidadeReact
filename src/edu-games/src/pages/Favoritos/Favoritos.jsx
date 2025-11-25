import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { getFavoritos, removeFavorito } from "../../api/favoritos";
import { getJogoById } from "../../api/jogos";
import { mostrarMensagem } from "../../utils/alerta";
import "./Favoritos.css"; // opcional se quiser estilizar separado
import HeaderAuth from "../../components/Header/HeaderAuth";

export default function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Carrega a lista de jogos favoritados
    async function carregarFavoritos() {
        try {
            const lista = await getFavoritos();

            // Cada item pode ser só o ID, então buscamos os dados do jogo
            const detalhes = await Promise.all(
                lista.map(async (item) => {
                    const jogoId = item.jogoId || item.id || item.fkJogo;
                    const jogo = await getJogoById(jogoId);
                    return {
                        id: jogo.id,
                        nome: jogo.nome,
                        preco: jogo.preco,
                    };
                })
            );

            setFavoritos(detalhes);
        } catch (err) {
            console.error("Erro ao carregar favoritos:", err);
            mostrarMensagem("Erro ao carregar lista de desejos.", "danger");
        } finally {
            setLoading(false);
        }
    }

    // 🔹 Remover dos favoritos
    async function handleRemoverFavorito(jogoId) {
        try {
            await removeFavorito(jogoId);
            mostrarMensagem("Jogo removido dos favoritos com sucesso!", "success");
            carregarFavoritos(); // recarrega a lista
        } catch (err) {
            console.error("Erro ao remover favorito:", err);
            mostrarMensagem("Erro ao remover dos favoritos.", "danger");
        }
    }

    useEffect(() => {
        carregarFavoritos();
    }, []);

    if (loading) {
        return (
            <>
                <Header />
                <p style={{ textAlign: "center", marginTop: "30px" }}>Carregando...</p>
            </>
        );
    }

    return (
        <>
            <HeaderAuth />
            <div className="content">

                {/* 🔹 Lista de jogos favoritados */}
                <main className="layout-perfil">
                    <h2>Seus Favoritos</h2>
                    <section className="pedidos-secao">

                        {favoritos.length === 0 ? (
                            <p style={{ textAlign: "center", marginTop: "20px" }}>
                                Nenhum jogo adicionado aos favoritos ainda.
                            </p>
                        ) : (
                            <div className="pedidos-container">
                                {favoritos.map((jogo) => (
                                    <div key={jogo.id} className="pedido-card">
                                        <h3>{jogo.nome}</h3>
                                        <p>
                                            R$ {Number(jogo.preco || 0).toFixed(2).replace(".", ",")}
                                        </p>

                                        <button
                                            className="btn-secundario"
                                            onClick={() => handleRemoverFavorito(jogo.id)}
                                        >
                                            <i className="fas fa-trash"></i> Remover dos Favoritos
                                        </button>
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
