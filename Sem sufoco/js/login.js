// ============================================================
// CADASTRO DO USUÁRIO
// Este arquivo é usado apenas na página index.html.
// ============================================================

function CadastroConta() {
    // 1. Pegamos os valores digitados pelo usuário.
    const nomeUsuario = document.getElementById("nomeUsuario").value.trim();
    const emailUsuario = document.getElementById("emailUsuario").value.trim();
    const rendaMensal = Number(document.getElementById("rendaMensal").value);
    const aviso = document.getElementById("aviso");

    // 2. Conferimos se todos os campos foram preenchidos corretamente.
    if (nomeUsuario !== "" && emailUsuario !== "" && rendaMensal > 0) {
        // localStorage guarda informações no navegador mesmo após mudar de página.
        localStorage.setItem("nomeUsuario", nomeUsuario);
        localStorage.setItem("emailUsuario", emailUsuario);
        localStorage.setItem("rendaMensal", rendaMensal);

        // 3. Só depois de salvar os dados fazemos o redirecionamento.
        window.location.href = "telaInicial.html";
        return;
    }

    aviso.innerHTML = "<strong>Preencha todos os campos corretamente!</strong>";
}
