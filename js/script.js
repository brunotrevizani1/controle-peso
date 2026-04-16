const STORAGE_KEY = "controlePesoApp_v4";

let state = {
  pesoAtual: 70,
  pesoMeta: 80,
  treinos: [
    {
      id: 1,
      dia: "Terça",
      treino: "Peito e tríceps",
      detalhes: "Supino, crucifixo, tríceps corda e mergulho",
      feito: false
    },
    {
      id: 2,
      dia: "Quarta",
      treino: "Costas e bíceps",
      detalhes: "Puxada frontal, remada, rosca direta e martelo",
      feito: true
    }
  ],
  alimentacao: [
    {
      id: 1,
      refeicao: "Café da manhã",
      horario: "08:00",
      alimentos: "2 ovos, pão, banana e leite",
      feito: false
    },
    {
      id: 2,
      refeicao: "Almoço",
      horario: "12:30",
      alimentos: "Arroz, feijão, frango e salada",
      feito: true
    }
  ]
};

let modalTipo = "";
let editandoId = null;

function salvarStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function carregarStorage() {
  const salvo = localStorage.getItem(STORAGE_KEY);

  if (salvo) {
    const dados = JSON.parse(salvo);

    state = {
      ...state,
      ...dados,
      treinos: (dados.treinos || []).map(item => ({
        ...item,
        feito: item.feito ?? false
      })),
      alimentacao: (dados.alimentacao || []).map(item => ({
        ...item,
        feito: item.feito ?? false
      }))
    };
  }
}

function formatarKg(valor) {
  return `${Number(valor).toFixed(1).replace(".", ",")} kg`;
}

function atualizarCards() {
  document.getElementById("pesoAtual").textContent = formatarKg(state.pesoAtual);
  document.getElementById("pesoMeta").textContent = formatarKg(state.pesoMeta);

  const falta = state.pesoMeta - state.pesoAtual;
  let texto = "";

  if (falta > 0) {
    texto = `Faltam ${formatarKg(falta)}`;
  } else if (falta === 0) {
    texto = "";
  } else {
    texto = `Passou ${formatarKg(Math.abs(falta))}`;
  }

  document.getElementById("faltamMeta").textContent = texto;
}

function ativarEdicaoPeso(tipo) {
  if (tipo === "atual") {
    const texto = document.getElementById("pesoAtual");
    const input = document.getElementById("inputPesoAtualInline");

    texto.style.display = "none";
    input.style.display = "inline-block";
    input.value = state.pesoAtual;
    input.focus();
    input.select();
  }

  if (tipo === "meta") {
    const texto = document.getElementById("pesoMeta");
    const input = document.getElementById("inputPesoMetaInline");

    texto.style.display = "none";
    input.style.display = "inline-block";
    input.value = state.pesoMeta;
    input.focus();
    input.select();
  }
}

function salvarPesoInline(tipo) {
  if (tipo === "atual") {
    const texto = document.getElementById("pesoAtual");
    const input = document.getElementById("inputPesoAtualInline");

    const valor = parseFloat(String(input.value).replace(",", "."));

    if (!isNaN(valor) && valor > 0) {
      state.pesoAtual = valor;
      salvarStorage();
      atualizarCards();
    }

    input.style.display = "none";
    texto.style.display = "inline-block";
  }

  if (tipo === "meta") {
    const texto = document.getElementById("pesoMeta");
    const input = document.getElementById("inputPesoMetaInline");

    const valor = parseFloat(String(input.value).replace(",", "."));

    if (!isNaN(valor) && valor > 0) {
      state.pesoMeta = valor;
      salvarStorage();
      atualizarCards();
    }

    input.style.display = "none";
    texto.style.display = "inline-block";
  }
}

function handlePesoKey(event, tipo) {
  if (event.key === "Enter") {
    salvarPesoInline(tipo);
  }
}

function renderTreinos() {
  const tbody = document.getElementById("treinoTabela");
  const vazio = document.getElementById("treinoVazio");

  tbody.innerHTML = "";

  if (state.treinos.length === 0) {
    vazio.style.display = "block";
    return;
  }

  vazio.style.display = "none";

  state.treinos.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.dia}</td>
      <td>${item.treino}</td>
      <td>${item.detalhes}</td>
      <td>
        <div class="status-wrap">
          <div class="status-bolinha ${item.feito ? "status-ok" : ""}" onclick="toggleStatusTreino(${item.id})">
            ✓
          </div>
        </div>
      </td>
      <td>
        <div class="acoes">
          <button class="btn-editar" onclick="editarItem('treino', ${item.id})">✏️</button>
          <button class="btn-excluir" onclick="excluirItem('treino', ${item.id})">🗑️</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function renderAlimentacao() {
  const tbody = document.getElementById("alimentacaoTabela");
  const vazio = document.getElementById("alimentacaoVazio");

  tbody.innerHTML = "";

  if (state.alimentacao.length === 0) {
    vazio.style.display = "block";
    return;
  }

  vazio.style.display = "none";

  state.alimentacao.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.refeicao}</td>
      <td>${item.horario}</td>
      <td>${item.alimentos}</td>
      <td>
        <div class="status-wrap">
          <div class="status-bolinha ${item.feito ? "status-ok" : ""}" onclick="toggleStatusAlimentacao(${item.id})">
            ✓
          </div>
        </div>
      </td>
      <td>
        <div class="acoes">
          <button class="btn-editar" onclick="editarItem('alimentacao', ${item.id})">✏️</button>
          <button class="btn-excluir" onclick="excluirItem('alimentacao', ${item.id})">🗑️</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function toggleStatusTreino(id) {
  const item = state.treinos.find(t => t.id === id);
  if (!item) return;

  item.feito = !item.feito;
  salvarStorage();
  renderTreinos();
}

function toggleStatusAlimentacao(id) {
  const item = state.alimentacao.find(a => a.id === id);
  if (!item) return;

  item.feito = !item.feito;
  salvarStorage();
  renderAlimentacao();
}

function abrirModal(tipo) {
  modalTipo = tipo;
  editandoId = null;

  const overlay = document.getElementById("modalOverlay");
  const titulo = document.getElementById("modalTitulo");
  const form = document.getElementById("formConteudo");

  if (tipo === "treino") {
    titulo.textContent = "Novo treino";
    form.innerHTML = `
      <div class="form-group">
        <label>Dia</label>
        <input type="text" id="campo1" placeholder="Ex: Terça" />
      </div>
      <div class="form-group">
        <label>Treino</label>
        <input type="text" id="campo2" placeholder="Ex: Peito e tríceps" />
      </div>
      <div class="form-group full">
        <label>Detalhes</label>
        <textarea id="campo3" placeholder="Exercícios ou observações"></textarea>
      </div>
    `;
  } else {
    titulo.textContent = "Nova refeição";
    form.innerHTML = `
      <div class="form-group">
        <label>Refeição</label>
        <input type="text" id="campo1" placeholder="Ex: Almoço" />
      </div>
      <div class="form-group">
        <label>Horário</label>
        <input type="text" id="campo2" placeholder="Ex: 12:30" />
      </div>
      <div class="form-group full">
        <label>O que comer</label>
        <textarea id="campo3" placeholder="Digite os alimentos"></textarea>
      </div>
    `;
  }

  overlay.style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalOverlay").style.display = "none";
}

function salvarItemModal() {
  const campo1 = document.getElementById("campo1").value.trim();
  const campo2 = document.getElementById("campo2").value.trim();
  const campo3 = document.getElementById("campo3").value.trim();

  if (!campo1 || !campo2 || !campo3) {
    alert("Preencha todos os campos.");
    return;
  }

  if (modalTipo === "treino") {
    if (editandoId) {
      const item = state.treinos.find(t => t.id === editandoId);

      if (item) {
        item.dia = campo1;
        item.treino = campo2;
        item.detalhes = campo3;
      }
    } else {
      state.treinos.push({
        id: Date.now(),
        dia: campo1,
        treino: campo2,
        detalhes: campo3,
        feito: false
      });
    }
  }

  if (modalTipo === "alimentacao") {
    if (editandoId) {
      const item = state.alimentacao.find(a => a.id === editandoId);

      if (item) {
        item.refeicao = campo1;
        item.horario = campo2;
        item.alimentos = campo3;
      }
    } else {
      state.alimentacao.push({
        id: Date.now(),
        refeicao: campo1,
        horario: campo2,
        alimentos: campo3,
        feito: false
      });
    }
  }

  salvarStorage();
  renderTudo();
  fecharModal();
}

function editarItem(tipo, id) {
  modalTipo = tipo;
  editandoId = id;

  const overlay = document.getElementById("modalOverlay");
  const titulo = document.getElementById("modalTitulo");
  const form = document.getElementById("formConteudo");

  if (tipo === "treino") {
    const item = state.treinos.find(t => t.id === id);
    if (!item) return;

    titulo.textContent = "Editar treino";
    form.innerHTML = `
      <div class="form-group">
        <label>Dia</label>
        <input type="text" id="campo1" value="${item.dia}" />
      </div>
      <div class="form-group">
        <label>Treino</label>
        <input type="text" id="campo2" value="${item.treino}" />
      </div>
      <div class="form-group full">
        <label>Detalhes</label>
        <textarea id="campo3">${item.detalhes}</textarea>
      </div>
    `;
  } else {
    const item = state.alimentacao.find(a => a.id === id);
    if (!item) return;

    titulo.textContent = "Editar refeição";
    form.innerHTML = `
      <div class="form-group">
        <label>Refeição</label>
        <input type="text" id="campo1" value="${item.refeicao}" />
      </div>
      <div class="form-group">
        <label>Horário</label>
        <input type="text" id="campo2" value="${item.horario}" />
      </div>
      <div class="form-group full">
        <label>O que comer</label>
        <textarea id="campo3">${item.alimentos}</textarea>
      </div>
    `;
  }

  overlay.style.display = "flex";
}

function excluirItem(tipo, id) {
  if (tipo === "treino") {
    state.treinos = state.treinos.filter(item => item.id !== id);
  } else {
    state.alimentacao = state.alimentacao.filter(item => item.id !== id);
  }

  salvarStorage();
  renderTudo();
}

function renderTudo() {
  atualizarCards();
  renderTreinos();
  renderAlimentacao();
}

carregarStorage();
renderTudo();