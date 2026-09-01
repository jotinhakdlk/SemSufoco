// ============================================================
// TELA INICIAL - SEM SUFOCO
// Responsável pela saudação, criação dos meses e produtos.
// ============================================================

// Nomes que serão mostrados para o usuário.
const nomesMeses = {
    janeiro: "Janeiro",
    fevereiro: "Fevereiro",
    marco: "Março",
    abril: "Abril",
    maio: "Maio",
    junho: "Junho",
    julho: "Julho",
    agosto: "Agosto",
    setembro: "Setembro",
    outubro: "Outubro",
    novembro: "Novembro",
    dezembro: "Dezembro"
};

// Objeto que guarda os produtos separados por mês.
// Exemplo: produtosPorMes.janeiro = [{ nome: "Arroz", quantidade: 2, ... }]
let produtosPorMes = carregarProdutos();

// Set guarda apenas os meses que já tiveram um campo criado na tela.
const mesesCriados = new Set();

// Quando o HTML terminar de carregar, executamos a preparação da página.
document.addEventListener("DOMContentLoaded", function () {
    mostrarSaudacao();

    const botaoAdicionarMes = document.getElementById("botaoAdicionarMes");

    if (botaoAdicionarMes) {
        botaoAdicionarMes.addEventListener("click", adicionarMes);
    }
});

// ============================================================
// 1. SAUDAÇÃO
// ============================================================

function mostrarSaudacao() {
    const saudacao = document.getElementById("saudacao");

    // Se não estivermos na telaInicial.html, não há o que fazer.
    if (!saudacao) return;

    const nomeCompleto = localStorage.getItem("nomeUsuario");

    if (nomeCompleto) {
        // Usamos apenas o primeiro nome para a saudação ficar mais natural.
        const primeiroNome = nomeCompleto.split(" ")[0];
        saudacao.textContent = `Olá, ${primeiroNome}!`;
    } else {
        saudacao.textContent = "Olá!";
    }
}

// ============================================================
// 2. CRIAÇÃO DOS MESES
// ============================================================

function adicionarMes() {
    const selectMes = document.getElementById("mesSelecionado");
    const avisoMes = document.getElementById("avisoMes");
    const mes = selectMes.value;

    avisoMes.textContent = "";

    // Não cria nada enquanto nenhum mês estiver selecionado.
    if (mes === "") {
        avisoMes.textContent = "Selecione um mês antes de continuar.";
        return;
    }

    // Impede que o mesmo mês seja criado duas vezes.
    if (mesesCriados.has(mes)) {
        avisoMes.textContent = `${nomesMeses[mes]} já foi adicionado.`;
        document.getElementById(`mes-${mes}`).scrollIntoView({ behavior: "smooth" });
        return;
    }

    criarCampoDoMes(mes);
    mesesCriados.add(mes);

    // Deixa o select pronto para uma nova escolha.
    selectMes.value = "";
}

function criarCampoDoMes(mes) {
    const containerMeses = document.getElementById("containerMeses");

    const campoMes = document.createElement("article");
    campoMes.classList.add("campoMes");
    campoMes.id = `mes-${mes}`;

    campoMes.innerHTML = `
        <div class="cabecalhoMes">
            <div>
                <p class="legendaMes">Gastos do mês</p>
                <h2>${nomesMeses[mes]}</h2>
            </div>
            <div class="resumoMes">
                <span>Total do mês</span>
                <strong id="total-${mes}">R$ 0,00</strong>
            </div>
        </div>

        <div class="formProduto">
            <input type="hidden" id="indiceEdicao-${mes}" value="">

            <div class="grupoCampo campoNome">
                <label for="nome-${mes}">Nome do produto</label>
                <input type="text" id="nome-${mes}" placeholder="Ex.: Arroz">
            </div>

            <div class="grupoCampo">
                <label for="quantidade-${mes}">Quantidade</label>
                <input type="number" id="quantidade-${mes}" min="1" step="1" placeholder="1">
            </div>

            <div class="grupoCampo">
                <label for="valor-${mes}">Valor unitário</label>
                <input type="number" id="valor-${mes}" min="0.01" step="0.01" placeholder="0,00">
            </div>

            <button
                type="button"
                class="botaoPrincipal botaoAdicionarProduto"
                id="botaoProduto-${mes}"
                onclick="adicionarOuSalvarProduto('${mes}')"
            >
                Adicionar
            </button>
        </div>

        <p id="aviso-${mes}" class="mensagemAviso"></p>

        <div class="tabelaResponsiva">
            <table>
                <thead>
                    <tr>
                        <th>Nome do produto</th>
                        <th>Quantidade</th>
                        <th>Valor unitário</th>
                        <th>Valor total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="corpoTabela-${mes}"></tbody>
            </table>
        </div>
    `;

    containerMeses.appendChild(campoMes);

    // Se já existirem produtos salvos para esse mês, eles aparecem na tabela.
    renderizarTabela(mes);
}

// ============================================================
// 3. PRODUTOS
// ============================================================

function adicionarOuSalvarProduto(mes) {
    const inputNome = document.getElementById(`nome-${mes}`);
    const inputQuantidade = document.getElementById(`quantidade-${mes}`);
    const inputValor = document.getElementById(`valor-${mes}`);
    const indiceEdicao = document.getElementById(`indiceEdicao-${mes}`);
    const aviso = document.getElementById(`aviso-${mes}`);

    const nome = inputNome.value.trim();
    const quantidade = Number(inputQuantidade.value);
    const valorUnitario = Number(inputValor.value);

    // O total não precisa ser digitado: é calculado automaticamente.
    const valorTotal = quantidade * valorUnitario;

    if (nome === "" || quantidade <= 0 || valorUnitario <= 0) {
        aviso.textContent = "Preencha nome, quantidade e valor unitário corretamente.";
        return;
    }

    aviso.textContent = "";

    const produto = {
        nome: nome,
        quantidade: quantidade,
        valorUnitario: valorUnitario,
        valorTotal: valorTotal
    };

    // Caso o mês ainda não tenha um array de produtos, criamos um.
    if (!produtosPorMes[mes]) {
        produtosPorMes[mes] = [];
    }

    if (indiceEdicao.value === "") {
        // Sem índice = produto novo.
        produtosPorMes[mes].push(produto);
    } else {
        // Com índice = estamos salvando uma modificação.
        const indice = Number(indiceEdicao.value);
        produtosPorMes[mes][indice] = produto;
    }

    salvarProdutos();
    renderizarTabela(mes);
    limparFormularioProduto(mes);
}

function editarProduto(mes, indice) {
    const produto = produtosPorMes[mes][indice];

    // Colocamos os dados do produto novamente nos campos do formulário.
    document.getElementById(`nome-${mes}`).value = produto.nome;
    document.getElementById(`quantidade-${mes}`).value = produto.quantidade;
    document.getElementById(`valor-${mes}`).value = produto.valorUnitario;
    document.getElementById(`indiceEdicao-${mes}`).value = indice;

    // O mesmo botão passa a salvar a alteração.
    const botao = document.getElementById(`botaoProduto-${mes}`);
    botao.textContent = "Salvar alteração";

    document.getElementById(`nome-${mes}`).focus();
}

function apagarProduto(mes, indice) {
    produtosPorMes[mes].splice(indice, 1);

    salvarProdutos();
    renderizarTabela(mes);
    limparFormularioProduto(mes);
}

function limparFormularioProduto(mes) {
    document.getElementById(`nome-${mes}`).value = "";
    document.getElementById(`quantidade-${mes}`).value = "";
    document.getElementById(`valor-${mes}`).value = "";
    document.getElementById(`indiceEdicao-${mes}`).value = "";

    document.getElementById(`botaoProduto-${mes}`).textContent = "Adicionar";
}

// ============================================================
// 4. MONTAGEM/ATUALIZAÇÃO DA TABELA
// ============================================================

function renderizarTabela(mes) {
    const corpoTabela = document.getElementById(`corpoTabela-${mes}`);
    const produtos = produtosPorMes[mes] || [];

    // Limpamos a tabela para recriá-la com os dados mais recentes.
    corpoTabela.innerHTML = "";

    if (produtos.length === 0) {
        corpoTabela.innerHTML = `
            <tr class="linhaVazia">
                <td colspan="5">Nenhum produto adicionado neste mês.</td>
            </tr>
        `;
    } else {
        produtos.forEach(function (produto, indice) {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${escaparHTML(produto.nome)}</td>
                <td>${produto.quantidade}</td>
                <td>${formatarDinheiro(produto.valorUnitario)}</td>
                <td><strong>${formatarDinheiro(produto.valorTotal)}</strong></td>
                <td class="acoesTabela">
                    <button
                        type="button"
                        class="botaoAcao botaoEditar"
                        onclick="editarProduto('${mes}', ${indice})"
                    >
                        Modificar
                    </button>
                    <button
                        type="button"
                        class="botaoAcao botaoApagar"
                        onclick="apagarProduto('${mes}', ${indice})"
                    >
                        Apagar
                    </button>
                </td>
            `;

            corpoTabela.appendChild(linha);
        });
    }

    atualizarTotalDoMes(mes);
}

function atualizarTotalDoMes(mes) {
    const produtos = produtosPorMes[mes] || [];

    const totalMes = produtos.reduce(function (soma, produto) {
        return soma + produto.valorTotal;
    }, 0);

    document.getElementById(`total-${mes}`).textContent = formatarDinheiro(totalMes);
}

// ============================================================
// 5. LOCALSTORAGE E FUNÇÕES AUXILIARES
// ============================================================

function salvarProdutos() {
    localStorage.setItem("produtosPorMes", JSON.stringify(produtosPorMes));
}

function carregarProdutos() {
    const produtosSalvos = localStorage.getItem("produtosPorMes");

    if (produtosSalvos) {
        return JSON.parse(produtosSalvos);
    }

    return {};
}

function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Evita que textos digitados pelo usuário sejam interpretados como HTML.
function escaparHTML(texto) {
    const elemento = document.createElement("div");
    elemento.textContent = texto;
    return elemento.innerHTML;
}
