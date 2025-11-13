// ===== LOCALSTORAGE =====
const usuario = {
  get: () => {
    const data = localStorage.getItem('admin-perfil');
    return data ? JSON.parse(data) : { nome: 'João Silva', email: 'admin@edugames.com' };
  },
  set: (data) => localStorage.setItem('admin-perfil', JSON.stringify(data))
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  const dados = usuario.get();
  document.getElementById('input-nome').value = dados.nome;
  document.getElementById('input-email').value = dados.email;
  document.getElementById('display-nome').textContent = dados.nome;
});

// ===== EDITAR =====
document.querySelectorAll('.btn-editar').forEach(btn => {
  btn.addEventListener('click', () => {
    const inputId = btn.dataset.target;
    const input = document.getElementById(inputId);
    input.removeAttribute('readonly');
    input.focus();
  });
});

// ===== SALVAR =====
document.getElementById('btn-salvar').addEventListener('click', () => {
  const nome = document.getElementById('input-nome').value.trim();
  const email = document.getElementById('input-email').value.trim();

  if (!nome || !email) {
    alert('Preencha todos os campos!');
    return;
  }

  usuario.set({ nome, email });
  document.getElementById('display-nome').textContent = nome;

  document.getElementById('input-nome').setAttribute('readonly', true);
  document.getElementById('input-email').setAttribute('readonly', true);

  alert('Perfil salvo com sucesso!');
});