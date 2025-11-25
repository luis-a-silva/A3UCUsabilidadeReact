import { mostrarMensagem } from "./alerta";

export function mostrarConfirmacao(mensagem, onConfirm) {
  // Remove qualquer modal existente
  const existente = document.querySelector(".confirmacao-container");
  if (existente) existente.remove();

  //  Cria o container principal com estilos inline
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
  });

  //  Cria o modal
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "10px",
    boxShadow: "0 0 25px rgba(0,0,0,0.3)",
    textAlign: "center",
    animation: "fadeIn 0.3s ease",
    maxWidth: "400px",
    width: "90%",
  });

  const texto = document.createElement("p");
  texto.textContent = mensagem;
  Object.assign(texto.style, {
    color: "#222",
    fontSize: "1.1rem",
    marginBottom: "20px",
  });

  //  Cria o container dos botões
  const botoes = document.createElement("div");
  Object.assign(botoes.style, {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  });

  //  Botão "Sim"
  const btnSim = document.createElement("button");
  btnSim.textContent = "Sim";
  Object.assign(btnSim.style, {
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  });
  btnSim.addEventListener("mouseenter", () => (btnSim.style.background = "#0056b3"));
  btnSim.addEventListener("mouseleave", () => (btnSim.style.background = "#007bff"));

  //  Botão "Não"
  const btnNao = document.createElement("button");
  btnNao.textContent = "Não";
  Object.assign(btnNao.style, {
    background: "#e0e0e0",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  });
  btnNao.addEventListener("mouseenter", () => (btnNao.style.background = "#c2c2c2"));
  btnNao.addEventListener("mouseleave", () => (btnNao.style.background = "#e0e0e0"));

  //  Adiciona os elementos ao DOM
  botoes.appendChild(btnSim);
  botoes.appendChild(btnNao);
  modal.appendChild(texto);
  modal.appendChild(botoes);
  container.appendChild(modal);
  document.body.appendChild(container);

  //  Ações dos botões
  btnSim.addEventListener("click", async () => {
    try {
      await onConfirm();
      mostrarMensagem("Ação efetuada com sucesso!", "success");
    } catch (err) {
      mostrarMensagem(err?.message || "Erro ao executar ação!", "danger");
    } finally {
      container.remove();
    }
  });

  btnNao.addEventListener("click", () => {
    mostrarMensagem("Ação cancelada.", "info");
    container.remove();
  });
}
