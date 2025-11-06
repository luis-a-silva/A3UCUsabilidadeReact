export function mostrarMensagem(mensagem, tipo = "info") {
  const alertaExistente = document.getElementById("alerta-centralizado-login");
  if (alertaExistente) alertaExistente.remove();

  const icones = {
    success: `<svg class="alerta-icone-animado" width="40" height="40" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#4BB543"/><path d="M10 17l4 4 8-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    danger: `<svg class="alerta-icone-animado" width="40" height="40" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#FF3333"/><path d="M11 11l10 10M21 11l-10 10" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    info: `<svg class="alerta-icone-animado" width="40" height="40" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#1976d2"/><rect x="15" y="8" width="2" height="12" fill="#fff"/><rect x="15" y="22" width="2" height="2" fill="#fff"/></svg>`,
  };

  const cores = {
    success: "#e6f9ec",
    danger: "#fdeaea",
    info: "#f0f4fa",
  };

  const alerta = document.createElement("div");
  alerta.id = "alerta-centralizado-login";
  alerta.innerHTML = `
    <div class="alerta-login-conteudo">
      <span class="alerta-login-icone">${icones[tipo] || icones.info}</span>
      <span class="alerta-login-texto">${mensagem}</span>
    </div>
  `;

  const style = document.createElement("style");
  style.id = "alerta-centralizado-login-style";
  style.innerHTML = `
    #alerta-centralizado-login {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.35); z-index: 9999;
    }
    .alerta-login-conteudo {
      background: ${cores[tipo] || "#f0f4fa"};
      color: #222;
      padding: 32px 28px;
      border-radius: 12px;
      box-shadow: 0 2px 24px rgba(0,0,0,0.25);
      min-width: 260px;
      font-size: 1.1rem;
      text-align: center;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      animation: alertaFadeIn 0.2s;
    }
    .alerta-login-icone { display: flex; justify-content: center; align-items: center; margin-bottom: 4px; }
    .alerta-icone-animado { animation: alertaIconePop 0.5s cubic-bezier(.68,-0.55,.27,1.55); }
    @keyframes alertaFadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
    @keyframes alertaIconePop {
      0% { transform: scale(0.2) rotate(-30deg); opacity: 0; }
      60% { transform: scale(1.15) rotate(8deg); opacity: 1; }
      80% { transform: scale(0.95) rotate(-4deg);}
      100% { transform: scale(1) rotate(0);}
    }
  `;

  document.body.appendChild(style);
  document.body.appendChild(alerta);

  setTimeout(() => {
    alerta.remove();
    style.remove();
  }, 3000);
}
