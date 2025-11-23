import { useState, useEffect } from "react";
import { getUsuarios, updateUser, getPerfis } from "../../api/adminApi";
import { registerUser } from "../../api/authService";
import HeaderAdmin from "./HeaderAdmin";

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [perfis, setPerfis] = useState([]);
    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);

    function formatarDataParaInput(data) {
        if (!data) return "";

        // Se vier no formato BR: "10/02/2002"
        if (data.includes("/")) {
            const [dia, mes, ano] = data.split("/");
            return `${ano}-${mes}-${dia}`;
        }

        // Se vier com T: "2002-02-10T00:00:00"
        if (data.includes("T")) {
            return data.split("T")[0];
        }

        // Se já estiver em "yyyy-mm-dd"
        return data;
    }

    function formatarDataParaBackend(isoDate) {
        if (!isoDate) return null;

        // vem "yyyy-mm-dd"
        const [ano, mes, dia] = isoDate.split("-");
        return `${dia}-${mes}-${ano}`; // formato aceito pela API
    }


    const [formCriar, setFormCriar] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        dataNascimento: "",
        perfil: "",
    });

    const [formEditar, setFormEditar] = useState({
        id: "",
        nome: "",
        email: "",
        dataNascimento: "",
        fkPerfil: "",
    });

    useEffect(() => {
        carregarUsuarios();
        carregarPerfis();
    }, []);

    async function carregarUsuarios() {
        const lista = await getUsuarios();
        setUsuarios(lista);
    }

    async function carregarPerfis() {
        const pefis = await getPerfis();
        setPerfis(pefis);
    }

    // ============================
    // ABRIR MODAL DE EDITAR
    // ============================
    function abrirEditar(usuario) {
        setUsuarioEditar(usuario);
        setFormEditar({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            dataNascimento: formatarDataParaInput(usuario.dataNascimento),
            fkPerfil: usuario.fkPerfil,
        });


        setModalEditar(true);
    }

    // ============================
    // SALVAR EDIÇÃO
    // ============================
    async function salvarEdicao() {
        await updateUser(
            formEditar.id,
            formEditar.nome,
            formEditar.dataNascimento,
            formEditar.fkPerfil
        );
        setModalEditar(false);
        carregarUsuarios();
    }

    // ============================
    // CRIAR NOVO USUÁRIO
    // ============================


    async function criarNovoUsuario() {
        try {
            const dataFormatada = formatarDataParaBackend(formCriar.dataNascimento);

            await registerUser(
                formCriar.nome,
                formCriar.email,
                formCriar.senha,
                dataFormatada
            );

            mostrarMensagem("Usuário criado com sucesso");
            setModalCriar(false);
        } catch (err) {
            console.error("Erro ao criar usuário:", err);
            mostrarMensagem("Erro ao criar usuário", "erro");
        }
    }

    return (
        <>
            <HeaderAdmin />
            <div className="usuarios-pagina">

                <h4 className="page-title">Gerenciamento de Usuários</h4>

                <button className="btn-criar" onClick={() => setModalCriar(true)}>
                    ➕ Criar Usuário
                </button>

                {/* ============================TABELA============================ */}
                <table className="tabela-usuarios">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Nascimento</th>
                            <th>Perfil</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.nome}</td>
                                <td>{u.email}</td>
                                <td>{u.dataNascimento ?? "-"}</td>
                                <td>{perfis.find((p) => p.id === u.fkPerfil)?.nome}</td>

                                <td className="acoes">
                                    <button
                                        className="btn-edit"
                                        onClick={() => abrirEditar(u)}
                                        title="Editar"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>



                {/* ============================MODAL CRIAR USUÁRIO============================ */}
                {modalCriar && (
                    <div className="modal-bg" onClick={() => setModalCriar(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>Criar Usuário</h2>

                            <input
                                type="text"
                                placeholder="Nome"
                                value={formCriar.nome}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, nome: e.target.value })
                                }
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={formCriar.email}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, email: e.target.value })
                                }
                            />

                            <input
                                type="date"
                                value={formCriar.dataNascimento}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, dataNascimento: e.target.value })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                                value={formCriar.senha}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, senha: e.target.value })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Confirmar Senha"
                                value={formCriar.confirmarSenha}
                                onChange={(e) =>
                                    setFormCriar({ ...formCriar, confirmarSenha: e.target.value })
                                }
                            />

                            <div className="modal-actions">
                                <button className="btn-salvar" onClick={criarNovoUsuario}>
                                    Salvar
                                </button>
                                <button className="btn-cancelar" onClick={() => setModalCriar(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================MODAL EDITAR USUÁRIO============================ */}
                {modalEditar && (
                    <div className="modal-bg" onClick={() => setModalEditar(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>Editar Usuário</h2>

                            <input
                                type="text"
                                value={formEditar.nome}
                                onChange={(e) =>
                                    setFormEditar({ ...formEditar, nome: e.target.value })
                                }
                            />

                            <input type="email" value={formEditar.email} disabled />

                            <input
                                type="date"
                                value={formEditar.dataNascimento}
                                onChange={(e) =>
                                    setFormEditar({
                                        ...formEditar,
                                        dataNascimento: e.target.value,
                                    })
                                }
                            />

                            <select
                                value={formEditar.fkPerfil}
                                onChange={(e) =>
                                    setFormEditar({ ...formEditar, fkPerfil: e.target.value })
                                }
                            >
                                <option value="">Selecione o perfil</option>
                                {perfis.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nome}
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
