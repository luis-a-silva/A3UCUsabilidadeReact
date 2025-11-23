import { useState, useEffect } from "react";
import {
    getAllJogos,
    getCategorias
} from "../../api/jogos";
import {
    getEmpresas
} from "../../api/empresa";
import {
    createJogo,
    updateJogo,
    deleteJogo
} from "../../api/adminApi";
import HeaderAdmin from "./HeaderAdmin";

export default function Jogos() {
    const [jogos, setJogos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [empresas, setEmpresas] = useState([]);

    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);

    const [formCriar, setFormCriar] = useState({
        nome: "",
        descricao: "",
        preco: "",
        ano: "",
        fkCategoria: "",
        fkEmpresa: "",
    });

    const [formEditar, setFormEditar] = useState({
        id: "",
        nome: "",
        descricao: "",
        preco: "",
        ano: "",
        fkCategoria: "",
        fkEmpresa: "",
    });

    useEffect(() => {
        carregarJogos();
        carregarCategorias();
        carregarEmpresas();
    }, []);

    async function carregarJogos() {
        const lista = await getAllJogos();
        setJogos(lista);
    }

    async function carregarCategorias() {
        const lista = await getCategorias();
        setCategorias(lista);
    }

    async function carregarEmpresas() {
        const lista = await getEmpresas();
        setEmpresas(lista);
    }

    // ============================
    //  ABRIR MODAL EDITAR
    // ============================
    function abrirEditar(jogo) {
        setFormEditar({
            id: jogo.id,
            nome: jogo.nome,
            descricao: jogo.descricao,
            preco: jogo.preco,
            ano: jogo.ano,
            fkCategoria: jogo.fkCategoria,
            fkEmpresa: jogo.fkEmpresa,
        });
        setModalEditar(true);
    }

    // ============================
    //  SALVAR EDIÇÃO
    // ============================
    async function salvarEdicao() {
        const payload = {
            nome: formEditar.nome,
            descricao: formEditar.descricao,
            preco: Number(formEditar.preco),
            ano: Number(formEditar.ano),
            fkCategoria: Number(formEditar.fkCategoria),
            fkEmpresa: Number(formEditar.fkEmpresa),
        };

        await updateJogo(formEditar.id, payload);
        setModalEditar(false);
        carregarJogos();
    }

    // ============================
    //  CRIAR NOVO JOGO
    // ============================
    async function criarNovoJogo() {
        const payload = {
            nome: formCriar.nome,
            descricao: formCriar.descricao,
            preco: Number(formCriar.preco),
            ano: Number(formCriar.ano),
            fkCategoria: Number(formCriar.fkCategoria),
            fkEmpresa: Number(formCriar.fkEmpresa),
        };

        await createJogo(payload);

        setModalCriar(false);
        carregarJogos();

        setFormCriar({
            nome: "",
            descricao: "",
            preco: "",
            ano: "",
            fkCategoria: "",
            fkEmpresa: "",
        });
    }

    // ============================
    //  APAGAR
    // ============================
    async function apagarJogo(id) {
        if (confirm("Deseja excluir este jogo?") === false) return;
        await deleteJogo(id);
        carregarJogos();
    }

    return (
        <>
            <HeaderAdmin />

            <div className="usuarios-pagina">
                <h4 className="page-title">Gerenciamento de Jogos</h4>

                <button className="btn-criar" onClick={() => setModalCriar(true)}>
                    ➕ Criar Jogo
                </button>

                {/* ============================TABELA============================ */}
                <table className="tabela-usuarios">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Ano</th>
                            <th>Categoria</th>
                            <th>Empresa</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {jogos.map((j) => (
                            <tr key={j.id}>
                                <td>{j.id}</td>
                                <td>{j.nome}</td>
                                <td>R$ {Number(j.preco).toFixed(2)}</td>
                                <td>{j.ano}</td>
                                <td>{categorias.find((c) => c.id === j.fkCategoria)?.nome}</td>
                                <td>{empresas.find((e) => e.id === j.fkEmpresa)?.nome}</td>

                                <td className="acoes">
                                    <button className="btn-edit" onClick={() => abrirEditar(j)}>
                                        <i className="fas fa-edit"></i>
                                    </button>

                                    <button className="btn-delete" onClick={() => apagarJogo(j.id)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ============================ MODAL CRIAR ============================ */}
                {modalCriar && (
                    <div className="modal-bg" onClick={() => setModalCriar(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>Criar Jogo</h2>

                            <input
                                type="text"
                                placeholder="Nome"
                                value={formCriar.nome}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, nome: e.target.value })
                                }
                            />

                            <textarea
                                placeholder="Descrição"
                                value={formCriar.descricao}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, descricao: e.target.value })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Preço"
                                value={formCriar.preco}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, preco: e.target.value })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Ano de lançamento"
                                value={formCriar.ano}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, ano: e.target.value })
                                }
                            />

                            <select
                                value={formCriar.fkCategoria}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, fkCategoria: e.target.value })
                                }
                            >
                                <option value="">Selecione a categoria</option>
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={formCriar.fkEmpresa}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, fkEmpresa: e.target.value })
                                }
                            >
                                <option value="">Selecione a empresa</option>
                                {empresas.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.nome}
                                    </option>
                                ))}
                            </select>

                            <div className="modal-actions">
                                <button className="btn-salvar" onClick={criarNovoJogo}>
                                    Salvar
                                </button>
                                <button
                                    className="btn-cancelar"
                                    onClick={() => setModalCriar(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================ MODAL EDITAR ============================ */}
                {modalEditar && (
                    <div className="modal-bg" onClick={() => setModalEditar(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>Editar Jogo</h2>

                            <input
                                type="text"
                                value={formEditar.nome}
                                onChange={(e) =>
                                    setFormEditar({ ...formEditar, nome: e.target.value })
                                }
                            />

                            <textarea
                                value={formEditar.descricao}
                                onChange={(e) =>
                                    setFormEditar({ ...formEditar, descricao: e.target.value })
                                }
                            />

                            <input
                                type="number"
                                value={formEditar.preco}
                                onChange={(e) =>
                                    setFormEditar({ ...formEditar, preco: e.target.value })
                                }
                            />

                            <input
                                type="number"
                                value={formEditar.ano}
                                onChange={(e) =>
                                    setFormEditar({ ...formEditar, ano: e.target.value })
                                }
                            />

                            <select
                                value={formEditar.fkCategoria}
                                onChange={(e) =>
                                    setFormEditar({ ...formEditar, fkCategoria: e.target.value })
                                }
                            >
                                {categorias.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nome}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={formEditar.fkEmpresa}
                                onChange={(e) =>
                                    setFormEditar({ ...formEditar, fkEmpresa: e.target.value })
                                }
                            >
                                {empresas.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.nome}
                                    </option>
                                ))}
                            </select>

                            <div className="modal-actions">
                                <button className="btn-salvar" onClick={salvarEdicao}>
                                    Salvar
                                </button>
                                <button
                                    className="btn-cancelar"
                                    onClick={() => setModalEditar(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
