let dados = JSON.parse(localStorage.getItem("dados")) || [];
let indexEditando = null;

function renderizar() {
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  dados.forEach((op, index) => {
    const linha = `
      <tr>
        <td>${op.nome}</td>
        <td>${op.funcionando}</td>
        <td>${op.versao}</td>
        <td>${op.motivo}</td>
        <td>
          <button onclick="editar(${index})">Editar</button>
          <button onclick="excluir(${index})">Excluir</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += linha;
  });
}

function salvarDados() {
    localStorage.setItem("dados", JSON.stringify(dados));
}

function adicionar() {
  const nome = document.getElementById("nome").value;
  const funcionando = document.getElementById("funcionando").value;
  const versao = document.getElementById("versao").value;
  const motivo = document.getElementById("motivo").value;

  if (!nome) {
    alert("Preencha o nome!");
    return;
  }

  dados.push({ nome, funcionando, versao, motivo });

  salvarDados();

  renderizar();

  // limpar campos
  document.getElementById("nome").value = "";
  document.getElementById("versao").value = "";
  document.getElementById("motivo").value = "";
}

function abrirModalAdicionar() {
  document.getElementById("modalAdd").style.display = "flex";
}

function fecharModalAdd() {
  document.getElementById("modalAdd").style.display = "none";
}

function salvarNova() {
  const nome = document.getElementById("add-nome").value;
  const funcionando = document.getElementById("add-funcionando").value;
  const versao = document.getElementById("add-versao").value;
  const motivo = document.getElementById("add-motivo").value;

  if (!nome) {
    alert("Preencha o nome!");
    return;
  }

  dados.push({ nome, funcionando, versao, motivo });

  salvarDados();
  renderizar();
  fecharModalAdd();

  // limpar campos
  document.getElementById("add-nome").value = "";
  document.getElementById("add-versao").value = "";
  document.getElementById("add-motivo").value = "";
}

function editar(index) {
    const op = dados[index];
    document.getElementById("edit-nome").value = op.nome;
    document.getElementById("edit-funcionando").value = op.funcionando;
    document.getElementById("edit-versao").value = op.versao;
    document.getElementById("edit-motivo").value = op.motivo;

    indexEditando = index;

    document.getElementById("modal").style.display = "flex";

}

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
  renderizar();
  fecharModal();
}

function excluir(index) {
  dados.splice(index, 1);
  salvarDados();
  renderizar();
}

// iniciar tabela
renderizar();