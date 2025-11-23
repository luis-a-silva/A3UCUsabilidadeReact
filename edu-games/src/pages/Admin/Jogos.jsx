import { useState, useEffect } from "react";
import { getAllJogos, getCategorias } from "../../api/jogos";
import { getEmpresas } from "../../api/empresa";
import { createJogo, updateJogo, deleteJogo } from "../../api/adminApi";
import HeaderAdmin from "./HeaderAdmin";
import "./Admin.css";


export default function Jogos() {
    const [jogos, setJogos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);


    const [modalCriar, setModalCriar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);


    const [formCriar, setFormCriar] = useState({ nome: "", descricao: "", preco: "", ano: "", fkCategoria: "", fkEmpresa: "" });
    const [formEditar, setFormEditar] = useState({ id: "", nome: "", descricao: "", preco: "", ano: "", fkCategoria: "", fkEmpresa: "" });


    useEffect(() => {
        carregarDados();
    }, []);


    async function carregarDados() {
        try {
            setLoading(true);
            const [listaJogos, listaCats, listaEmpresas] = await Promise.all([
                getAllJogos(),
                getCategorias(),
                getEmpresas()
            ]);
           
            setJogos(listaJogos || []);
            setCategorias(listaCats || []);
            setEmpresas(listaEmpresas || []);
        } catch (error) {
            console.error("Erro ao carregar dados dos jogos:", error);
        } finally {
            setLoading(false);
        }
    }


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


    async function salvarEdicao() {
        try {
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
           
            const lista = await getAllJogos();
            setJogos(lista || []);
        } catch (error) {
            alert("Erro ao editar jogo");
        }
    }


    async function criarNovoJogo() {
        try {
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
           
            const lista = await getAllJogos();
            setJogos(lista || []);


            setFormCriar({ nome: "", descricao: "", preco: "", ano: "", fkCategoria: "", fkEmpresa: "" });
        } catch (error) {
            alert("Erro ao criar jogo");
        }
    }


    if (loading) {
        return (
            <div className="admin-container">
                <HeaderAdmin />
                <div className="admin-content-body">
                    <p style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>Carregando Jogos...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="admin-container">
            <HeaderAdmin />


            <div className="admin-content-body">
                <div className="secao-titulo-central">
                    <h3 className="subtitulo-gerenciamento">Gerenciamento de Jogos</h3>
                </div>


                <div className="top-controls">
                    <button className="btn-criar-verde" onClick={() => setModalCriar(true)}>
                        ➕ Criar Jogo
                    </button>
                    <span className="contador-texto">Quantidade de Jogos cadastrados: {jogos.length}</span>
                </div>


                <div className="grid-cards">
                    {jogos.length === 0 && <p style={{color: '#888', textAlign: 'center', gridColumn: '1/-1'}}>Nenhum jogo encontrado.</p>}
                   
                    {jogos.map((j) => (
                        <div className="card-item" key={j.id}>
                            <div className="card-header">
                                <span className="card-title">{j.nome}</span>
                                <span className="card-id">#{j.id}</span>
                            </div>


                            <div className="card-body">
                                <p><strong>Preço:</strong> R$ {Number(j.preco).toFixed(2)}</p>
                                <p><strong>Ano:</strong> {j.ano}</p>
                                <p><strong>Categoria:</strong> {categorias.find((c) => c.id === j.fkCategoria)?.nome || "..."}</p>
                                <p><strong>Empresa:</strong> {empresas.find((e) => e.id === j.fkEmpresa)?.nome || "..."}</p>
                            </div>


                            <div className="card-footer">
                                <button className="btn-acao-amarelo" onClick={() => abrirEditar(j)}>
                                    Ações
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {modalCriar && (
                <div className="modal-bg" onClick={() => setModalCriar(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Criar Jogo</h2>
                        <input type="text" placeholder="Nome" value={formCriar.nome} onChange={(e) => setFormCriar({ ...formCriar, nome: e.target.value })} />
                        <textarea placeholder="Descrição" value={formCriar.descricao} onChange={(e) => setFormCriar({ ...formCriar, descricao: e.target.value })} />
                        <input type="number" placeholder="Preço" value={formCriar.preco} onChange={(e) => setFormCriar({ ...formCriar, preco: e.target.value })} />
                        <input type="number" placeholder="Ano de lançamento" value={formCriar.ano} onChange={(e) => setFormCriar({ ...formCriar, ano: e.target.value })} />
                       
                        <select value={formCriar.fkCategoria} onChange={(e) => setFormCriar({ ...formCriar, fkCategoria: e.target.value })}>
                            <option value="">Selecione a categoria</option>
                            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>


                        <select value={formCriar.fkEmpresa} onChange={(e) => setFormCriar({ ...formCriar, fkEmpresa: e.target.value })}>
                            <option value="">Selecione a empresa</option>
                            {empresas.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
                        </select>


                        <div className="modal-actions">
                            <button className="btn-salvar" onClick={criarNovoJogo}>Salvar</button>
                            <button className="btn-cancelar" onClick={() => setModalCriar(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}


            {modalEditar && (
                <div className="modal-bg" onClick={() => setModalEditar(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Editar Jogo</h2>
                        <input type="text" value={formEditar.nome} onChange={(e) => setFormEditar({ ...formEditar, nome: e.target.value })} />
                        <textarea value={formEditar.descricao} onChange={(e) => setFormEditar({ ...formEditar, descricao: e.target.value })} />
                        <input type="number" value={formEditar.preco} onChange={(e) => setFormEditar({ ...formEditar, preco: e.target.value })} />
                        <input type="number" value={formEditar.ano} onChange={(e) => setFormEditar({ ...formEditar, ano: e.target.value })} />


                        <select value={formEditar.fkCategoria} onChange={(e) => setFormEditar({ ...formEditar, fkCategoria: e.target.value })}>
                            <option value="">Selecione a categoria</option>
                            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>


                        <select value={formEditar.fkEmpresa} onChange={(e) => setFormEditar({ ...formEditar, fkEmpresa: e.target.value })}>
                            <option value="">Selecione a empresa</option>
                            {empresas.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
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

