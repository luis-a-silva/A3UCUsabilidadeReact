// ===== DADOS NO LOCALSTORAGE =====
const storage = {
  get: (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data))
};

// ===== DADOS INICIAIS =====
if (!storage.get('empresas').length) {
  storage.set('empresas', [
    { id: 1, nome: 'Sony Interactive Entertainment', descricao: 'Líder global em tecnologia e entretenimento, criando jogos icônicos.' },
    { id: 2, nome: 'CD Projekt RED', descricao: 'Estúdio polonês conhecido por RPGs narrativos de alta qualidade.' }
  ]);
}
if (!storage.get('categorias').length) {
  storage.set('categorias', [
    { id: 1, nome: 'Ação', descricao: 'Jogos de ação e aventura.' },
    { id: 2, nome: 'RPG', descricao: 'Role-playing games com narrativa profunda.' }
  ]);
}
if (!storage.get('jogos').length) {
  storage.set('jogos', [
    { id: 1, nome: 'The Witcher 3', descricao: 'Aventura épica de mundo aberto.', preco: '129.99', imagem: 'https://example.com/witcher.jpg', empresa: 2, categoria: 2 }
  ]);
}

// ===== ELEMENTOS =====
const menuItems = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('.section-content');
const modals = document.querySelectorAll('.modal');
const modalCloses = document.querySelectorAll('.modal-close');
const btnsAdd = document.querySelectorAll('.btn-add');
const forms = document.querySelectorAll('form[id^="form-"]');

// ===== FUNÇÕES DE TROCA DE ABA =====
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.section;

    // Atualiza menu
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Mostra seção
    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(target).classList.add('active');

    // Renderiza cards da seção
    renderCards(target);

    // Atualiza contadores
    updateCounts();
  });
});

// ===== ABRIR MODAL =====
btnsAdd.forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.dataset.modal;
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset form
    const form = modal.querySelector('form');
    form.reset();
    const hiddenId = form.querySelector('[name="id"]');
    if (hiddenId) hiddenId.removeAttribute('value');

    // Atualiza título do modal para jogo
    if (modalId === 'modal-jogo') {
      modal.querySelector('#modal-jogo-title').textContent = 'Cadastrar Jogo';
      populateSelect('empresa', storage.get('empresas'));
      populateSelect('categoria', storage.get('categorias'));
    }
  });
});

// ===== FECHAR MODAL =====
modalCloses.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').classList.remove('active');
    document.body.style.overflow = '';
  });
});

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== POPULAR SELECT =====
function populateSelect(name, data) {
  const select = document.querySelector(`[name="${name}"]`);
  if (!select) return;
  select.innerHTML = '<option value="">Selecione...</option>';
  data.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.nome;
    select.appendChild(opt);
  });
}

// ===== RENDERIZAR CARDS =====
function renderCards(type) {
  const grid = document.getElementById(`${type}-grid`);
  if (!grid) return;
  const data = storage.get(type);
  grid.innerHTML = '';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'empresa-card'; // Usar classe genérica
    card.innerHTML = `
      <div class="card-header">
        <h3>${item.nome}</h3>
      </div>
      <p>${item.descricao}</p>
      <div class="card-actions">
        <button class="btn-edit" onclick="editItem('${type}', ${item.id})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn-delete" onclick="deleteItem('${type}', ${item.id})">
          <i class="fas fa-trash"></i> Excluir
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== EDITAR ITEM =====
window.editItem = (type, id) => {
  const data = storage.get(type);
  const item = data.find(i => i.id === id);
  if (!item) return;

  let modalId = `modal-${type === 'jogos' ? 'jogo' : type.slice(0, -1)}`;
  const modal = document.getElementById(modalId);
  const form = modal.querySelector('form');
  if (!modal || !form) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  form.querySelector('[name="id"]').value = id;
  form.querySelector('[name="nome"]').value = item.nome;
  form.querySelector('[name="descricao"]').value = item.descricao;

  if (type === 'jogos') {
    form.querySelector('[name="preco"]').value = item.preco;
    form.querySelector('[name="imagem"]').value = item.imagem;
    form.querySelector('[name="empresa"]').value = item.empresa;
    form.querySelector('[name="categoria"]').value = item.categoria;
    modal.querySelector('#modal-jogo-title').textContent = 'Editar Jogo';
    populateSelect('empresa', storage.get('empresas'));
    populateSelect('categoria', storage.get('categorias'));
  }
};

// ===== EXCLUIR ITEM =====
window.deleteItem = (type, id) => {
  if (confirm(`Tem certeza que deseja excluir "${storage.get(type).find(i => i.id === id)?.nome || 'este item'}?"`)) {
    let data = storage.get(type);
    data = data.filter(i => i.id !== id);
    storage.set(type, data);
    renderCards(type);
    updateCounts();
  }
};

// ===== SUBMIT FORMS  =====
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const id = formData.get('id');
    const type = form.id === 'form-jogo' ? 'jogos' : form.id === 'form-empresa' ? 'empresas' : 'categorias';
    const data = { id: id ? parseInt(id) : Date.now() };

    // Coleta dados do form
    for (let [key, value] of formData.entries()) {
      if (key !== 'id') data[key] = value;
    }

    let items = storage.get(type);
    if (id) {
      items = items.map(i => i.id === parseInt(id) ? data : i);
    } else {
      items.push(data);
    }
    storage.set(type, items);

    renderCards(type);
    updateCounts();
    form.closest('.modal').classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== ATUALIZAR CONTADORES =====
function updateCounts() {
  document.getElementById('count-empresas').textContent = storage.get('empresas').length;
  document.getElementById('count-categorias').textContent = storage.get('categorias').length;
  document.getElementById('count-jogos').textContent = storage.get('jogos').length;
}

// ===== INICIALIZAÇÃO =====
function init() {
  renderCards('empresas');
  renderCards('categorias');
  renderCards('jogos');
  updateCounts();
}

init();