import { useState, useEffect } from "react";
import {
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../../api/adminApi";
import { getEmpresas } from "../../api/empresa";
import HeaderAdmin from "./HeaderAdmin";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [empresaEditar, setEmpresaEditar] = useState(null);

  const [formCriar, setFormCriar] = useState({
    nome: "",
  });

  const [formEditar, setFormEditar] = useState({
    id: "",
    nome: "",
  });

  useEffect(() => {
    carregarEmpresas();
  }, []);

  async function carregarEmpresas() {
    const lista = await getEmpresas();
    setEmpresas(lista);
  }

  // ============================
  //  Abrir modal para editar
  // ============================
  function abrirEditar(emp) {
    setEmpresaEditar(emp);
    setFormEditar({
      id: emp.id,
      nome: emp.nome,
    });
    setModalEditar(true);
  }

  // ============================
  //  Salvar edição
  // ============================
  async function salvarEdicao() {
    await updateEmpresa(formEditar.id, formEditar.nome);
    setModalEditar(false);
    carregarEmpresas();
  }

  // ============================
  //  Criar nova empresa
  // ============================
  async function criarNovaEmpresa() {
    if (!formCriar.nome) {
      alert("O nome da empresa é obrigatório!");
      return;
    }

    await createEmpresa(formCriar.nome);

    setModalCriar(false);
    carregarEmpresas();
    setFormCriar({ nome: "" });
  }

  // ============================
  //  Deletar
  // ============================
  async function apagarEmpresa(id) {
    if (!confirm("Deseja realmente excluir esta empresa?")) return;

    await deleteEmpresa(id);
    carregarEmpresas();
  }

  return (
    <>
      <HeaderAdmin />

      <div className="usuarios-pagina">
        <h4 className="page-title">Gerenciamento de Empresas</h4>

        <button className="btn-criar" onClick={() => setModalCriar(true)}>
          ➕ Criar Empresa
        </button>

        {/* ============================ TABELA ============================ */}
        <table className="tabela-usuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome da Empresa</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {empresas.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.nome}</td>

                <td className="acoes">
                  <button
                    className="btn-edit"
                    onClick={() => abrirEditar(emp)}
                    title="Editar"
                  >
                    <i className="fas fa-edit"></i>
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => apagarEmpresa(emp.id)}
                    title="Excluir"
                  >
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
              <h2>Criar Empresa</h2>

              <input
                type="text"
                placeholder="Nome da Empresa"
                value={formCriar.nome}
                onChange={(e) =>
                  setFormCriar({ ...formCriar, nome: e.target.value })
                }
              />

              <div className="modal-actions">
                <button className="btn-salvar" onClick={criarNovaEmpresa}>
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
              <h2>Editar Empresa</h2>

              <input
                type="text"
                value={formEditar.nome}
                onChange={(e) =>
                  setFormEditar({ ...formEditar, nome: e.target.value })
                }
              />

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
