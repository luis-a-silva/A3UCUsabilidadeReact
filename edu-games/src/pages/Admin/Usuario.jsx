import { useState, useEffect } from "react";
import { getUsuarios, updateUser, getPerfis } from "../../api/adminApi";
import { registerUser } from "../../api/authService";
import HeaderAdmin from "./HeaderAdmin";
import "./Admin.css";


export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [perfis, setPerfis] = useState([]);
    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [usuarioEditar, setUsuarioEditar] = useState(null);
    const [formCriar, setFormCriar] = useState({ nome: "", email: "", senha: "", confirmarSenha: "", dataNascimento: "", perfil: "" });
    const [formEditar, setFormEditar] = useState({ id: "", nome: "", email: "", dataNascimento: "", fkPerfil: "" });


    function formatarDataParaInput(data) {
        if (!data) return "";
        if (data.includes("/")) {
            const [dia, mes, ano] = data.split("/");
            return `${ano}-${mes}-${dia}`;
        }
        if (data.includes("T")) return data.split("T")[0];
        return data;
    }


    function formatarDataParaBackend(isoDate) {
        if (!isoDate) return null;
        const [ano, mes, dia] = isoDate.split("-");
        return `${dia}-${mes}-${ano}`;
    }


    useEffect(() => {
        carregarUsuarios();
        carregarPerfis();
    }, []);


    async function carregarUsuarios() {
        try {
            const lista = await getUsuarios();
            setUsuarios(lista || []);
        } catch (error) {
            console.error("Erro ao carregar usuários", error);
        }
    }


    async function carregarPerfis() {
        try {
            const pefis = await getPerfis();
            setPerfis(pefis || []);
        } catch (error) {
            console.error("Erro ao carregar perfis", error);
        }
    }


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


    async function salvarEdicao() {
        try {
            await updateUser(formEditar.id, formEditar.nome, formEditar.dataNascimento, formEditar.fkPerfil);
            setModalEditar(false);
            carregarUsuarios();
        } catch (error) {
            alert("Erro ao editar usuário");
        }
    }


    async function criarNovoUsuario() {
        try {
            const dataFormatada = formatarDataParaBackend(formCriar.dataNascimento);
            await registerUser(formCriar.nome, formCriar.email, formCriar.senha, dataFormatada);
            alert("Usuário criado com sucesso");
            setModalCriar(false);
            carregarUsuarios();
        } catch (err) {
            console.error("Erro", err);
            alert("Erro ao criar usuário");
        }
    }


    return (
        <div className="admin-container">
            <HeaderAdmin />


            <div className="admin-content-body">
                <div className="secao-titulo-central">
                    <h3 className="subtitulo-gerenciamento">Gerenciamento de Usuários</h3>
                </div>


                <div className="top-controls">
                    <button className="btn-criar-verde" onClick={() => setModalCriar(true)}>
                        ➕ Criar Usuário
                    </button>
                    <span className="contador-texto">Quantidade de Usuários cadastrados: {usuarios.length}</span>
                </div>


                <div className="grid-cards">
                    {usuarios.map((u) => (
                        <div className="card-item" key={u.id}>
                            <div className="card-header">
                                <span className="card-title">{u.nome}</span>
                                <span className="card-id">#{u.id}</span>
                            </div>
                            <div className="card-body">
                                <p><strong>Email:</strong> {u.email}</p>
                                <p><strong>Nasc:</strong> {u.dataNascimento ?? "--/--/--"}</p>
                                <p><strong>Perfil:</strong> {perfis.find((p) => p.id === u.fkPerfil)?.nome || "N/A"}</p>
                            </div>
                            <div className="card-footer">
                                <button className="btn-acao-amarelo" onClick={() => abrirEditar(u)}>Ações</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {modalCriar && (
                <div className="modal-bg" onClick={() => setModalCriar(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Criar Usuário</h2>
                        <input type="text" placeholder="Nome" value={formCriar.nome} onChange={(e) => setFormCriar({ ...formCriar, nome: e.target.value })} />
                        <input type="email" placeholder="Email" value={formCriar.email} onChange={(e) => setFormCriar({ ...formCriar, email: e.target.value })} />
                        <input type="date" value={formCriar.dataNascimento} onChange={(e) => setFormCriar({ ...formCriar, dataNascimento: e.target.value })} />
                        <input type="password" placeholder="Senha" value={formCriar.senha} onChange={(e) => setFormCriar({ ...formCriar, senha: e.target.value })} />
                        <input type="password" placeholder="Confirmar Senha" value={formCriar.confirmarSenha} onChange={(e) => setFormCriar({ ...formCriar, confirmarSenha: e.target.value })} />
                        <div className="modal-actions">
                            <button className="btn-salvar" onClick={criarNovoUsuario}>Salvar</button>
                            <button className="btn-cancelar" onClick={() => setModalCriar(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}


            {modalEditar && (
                <div className="modal-bg" onClick={() => setModalEditar(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Editar Usuário</h2>
                        <input type="text" value={formEditar.nome} onChange={(e) => setFormEditar({ ...formEditar, nome: e.target.value })} />
                        <input type="email" value={formEditar.email} disabled style={{opacity: 0.5}} />
                        <input type="date" value={formEditar.dataNascimento} onChange={(e) => setFormEditar({ ...formEditar, dataNascimento: e.target.value })} />
                        <select value={formEditar.fkPerfil} onChange={(e) => setFormEditar({ ...formEditar, fkPerfil: e.target.value })}>
                            <option value="">Selecione o perfil</option>
                            {perfis.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                        <div className="modal-actions">
                            <button className="btn-salvar" onClick={salvarEdicao}>Salvar</button>
                            <button className="btn-cancelar" onClick={() => setModalEditar(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

