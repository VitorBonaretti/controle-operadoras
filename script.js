import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let dados = [];
let indexEditando = null;

// 🔐 LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    await signInWithEmailAndPassword(window.auth, email, senha);
  } catch (error) {
    alert("Erro: " + error.message);
  }
};

// 🔄 CONTROLE DE LOGIN
onAuthStateChanged(window.auth, user => {
  if (user) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("app").style.display = "block";
  } else {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});

// 📊 RENDERIZA TABELA
function renderizar() {
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  dados.forEach((op, index) => {
    const linha = `
      <tr>
        <td>${op.nome}</td>
        <td>
          <span class="${op.funcionandoEdi === 'SIM' ? 'status-ok' : 'status-erro'}">
            ${op.funcionandoEdi}
          </span>
        </td>
        <td>
          <span class="${op.funcionandoPlanilha === 'SIM' ? 'status-ok' : 'status-erro'}">
            ${op.funcionandoPlanilha}
          </span>
        </td>
        <td>${op.versao}</td>
        <td>${op.observacao}</td>
        <td>
          <button onclick="editar(${index})">Editar</button>
          <button onclick="excluir(${index})">Excluir</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += linha;
  });
}

function carregarDados() {
  const q = collection(window.db, "operadoras");

  onSnapshot(q, (snapshot) => {
    dados = [];

    snapshot.forEach(doc => {
      dados.push({
        id: doc.id,
        ...doc.data()
      });
    });

    renderizar();
  });
}

// ➕ MODAL ADICIONAR
function abrirModalAdicionar() {
  document.getElementById("modalAdd").style.display = "flex";
}

function fecharModalAdd() {
  document.getElementById("modalAdd").style.display = "none";
}

window.salvarNova = async function () {
  const nome = document.getElementById("add-nome").value;
  const funcionandoEdi = document.getElementById("add-EDI").value;
  const funcionandoPlanilha = document.getElementById("add-Planilha").value;
  const versao = document.getElementById("add-versao").value;
  const observacao = document.getElementById("add-observacao").value;

  if (!nome) {
    alert("Preencha o nome!");
    return;
  }

  await addDoc(collection(window.db, "operadoras"), {
    nome,
    funcionandoEdi,
    funcionandoPlanilha,
    versao,
    observacao
  });

  fecharModalAdd();
};

// ✏️ EDITAR
function editar(index) {
  const op = dados[index];

  document.getElementById("edit-nome").value = op.nome;
  document.getElementById("edit-EDI").value = op.funcionandoEdi;
  document.getElementById("edit-Planilha").value = op.funcionandoPlanilha;
  document.getElementById("edit-versao").value = op.versao;
  document.getElementById("edit-observacao").value = op.observacao;

  indexEditando = index;

  document.getElementById("modal").style.display = "flex";
}

window.salvarEdicao = async function () {
  const id = dados[indexEditando].id;

  await updateDoc(doc(window.db, "operadoras", id), {
    nome: document.getElementById("edit-nome").value,
    funcionandoEdi: document.getElementById("edit-EDI").value,
    funcionandoPlanilha: document.getElementById("edit-Planilha").value,
    versao: document.getElementById("edit-versao").value,
    observacao: document.getElementById("edit-observacao").value
  });

  fecharModal();
};

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// ❌ EXCLUIR
window.excluir = async function (index) {
  const id = dados[index].id;

  await deleteDoc(doc(window.db, "operadoras", id));
};

// 🌍 EXPOR FUNÇÕES PARA HTML (IMPORTANTE)
window.abrirModalAdicionar = abrirModalAdicionar;
window.fecharModalAdd = fecharModalAdd;
window.salvarNova = salvarNova;
window.editar = editar;
window.fecharModal = fecharModal;

carregarDados();