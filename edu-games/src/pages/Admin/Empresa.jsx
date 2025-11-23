import { useState, useEffect } from "react";
import { createEmpresa, updateEmpresa, deleteEmpresa } from "../../api/adminApi";
import { getEmpresas } from "../../api/empresa";
import HeaderAdmin from "./HeaderAdmin";
import "./Admin.css";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [empresaEditar, setEmpresaEditar] = useState(null);
  const [formCriar, setFormCriar] = useState({ nome: "" });
  const [formEditar, setFormEditar] = useState({ id: "", nome: "" });

  useEffect(() => {
    carregarEmpresas();
  }, []);

  async function carregarEmpresas() {
    try {
        const lista = await getEmpresas();
        setEmpresas(lista || []);
    } catch (error) {
        console.error("Erro ao carregar empresas", error);
    }
  }

  function abrirEditar(emp) {
    setEmpresaEditar(emp);
    setFormEditar({ id: emp.id, nome: emp.nome });
    setModalEditar(true);
  }

  async function salvarEdicao() {
    try {
        await updateEmpresa(formEditar.id, formEditar.nome);
        setModalEditar(false);
        carregarEmpresas();
    } catch (error) {
        alert("Erro ao atualizar empresa");
    }
  }

  async function criarNovaEmpresa() {
    if (!formCriar.nome) {
      alert("O nome da empresa é obrigatório!");
      return;
    }
    try {
        await createEmpresa(formCriar.nome);
        setModalCriar(false);
        carregarEmpresas();
        setFormCriar({ nome: "" });
    } catch (error) {
        alert("Erro ao criar empresa");
    }
  }

  return (
    <div className="admin-container">
      <HeaderAdmin />

      <div className="admin-content-body">
          <div className="secao-titulo-central">
              <h1 className="titulo-painel">Painel Administrativo</h1>
              <h3 className="subtitulo-gerenciamento">Gerenciamento de Empresas</h3>
          </div>

          <div className="top-controls">
              <button className="btn-criar-verde" onClick={() => setModalCriar(true)}>
                  ➕ Criar Empresa
              </button>
              <span className="contador-texto">Quantidade de Empresas cadastradas: {empresas.length}</span>
          </div>

          <div className="grid-cards">
              {empresas.map((emp) => (
                  <div className="card-item" key={emp.id}>
                      <div className="card-header">
                          <span className="card-title">{emp.nome}</span>
                          <span className="card-id">#{emp.id}</span>
                      </div>
                      <div className="card-body">
                          <p><strong>Empresa:</strong> {emp.nome}</p>
                      </div>
                      <div className="card-footer">
                          <button className="btn-acao-amarelo" onClick={() => abrirEditar(emp)}>Ações</button>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {modalCriar && (
        <div className="modal-bg" onClick={() => setModalCriar(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Empresa</h2>
            <input type="text" placeholder="Nome da Empresa" value={formCriar.nome} onChange={(e) => setFormCriar({ ...formCriar, nome: e.target.value })} />
            <div className="modal-actions">
              <button className="btn-salvar" onClick={criarNovaEmpresa}>Salvar</button>
              <button className="btn-cancelar" onClick={() => setModalCriar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {modalEditar && (
        <div className="modal-bg" onClick={() => setModalEditar(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Empresa</h2>
            <input type="text" value={formEditar.nome} onChange={(e) => setFormEditar({ ...formEditar, nome: e.target.value })} />
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