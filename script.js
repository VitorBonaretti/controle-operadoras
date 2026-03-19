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

    carregarDados();
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
  const funcionando = document.getElementById("add-funcionando").value;
  const versao = document.getElementById("add-versao").value;
  const motivo = document.getElementById("add-motivo").value;

  if (!nome) {
    alert("Preencha o nome!");
    return;
  }

  await addDoc(collection(window.db, "operadoras"), {
    nome,
    funcionando,
    versao,
    motivo
  });

  fecharModalAdd();
};

// ✏️ EDITAR
function editar(index) {
  const op = dados[index];

  document.getElementById("edit-nome").value = op.nome;
  document.getElementById("edit-funcionando").value = op.funcionando;
  document.getElementById("edit-versao").value = op.versao;
  document.getElementById("edit-motivo").value = op.motivo;

  indexEditando = index;

  document.getElementById("modal").style.display = "flex";
}

window.salvarEdicao = async function () {
  const id = dados[indexEditando].id;

  await updateDoc(doc(window.db, "operadoras", id), {
    nome: document.getElementById("edit-nome").value,
    funcionando: document.getElementById("edit-funcionando").value,
    versao: document.getElementById("edit-versao").value,
    motivo: document.getElementById("edit-motivo").value
  });

  fecharModal();
};

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function salvarEdicao() {
  dados[indexEditando] = {
    nome: document.getElementById("edit-nome").value,
    funcionando: document.getElementById("edit-funcionando").value,
    versao: document.getElementById("edit-versao").value,
    motivo: document.getElementById("edit-motivo").value
  };

  salvarDados();
  carregarDados();
  fecharModal();
}

// ❌ EXCLUIR
function excluir(index) {
  dados.splice(index, 1);
  salvarDados();
  carregarDados();
}

window.excluir = async function (index) {
  const id = dados[index].id;

  await deleteDoc(doc(window.db, "operadoras", id));
};

// 🌍 EXPOR FUNÇÕES PARA HTML (IMPORTANTE)
window.abrirModalAdicionar = abrirModalAdicionar;
window.fecharModalAdd = fecharModalAdd;
window.salvarNova = salvarNova;
window.editar = editar;
window.excluir = excluir;
window.salvarEdicao = salvarEdicao;
window.fecharModal = fecharModal;

// 🚀 INICIAR
carregarDados();