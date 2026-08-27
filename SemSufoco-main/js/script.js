function CadastroConta(){
    nomeUsuario = document.getElementById("nomeUsuario").value;
    emailUsuario = document.getElementById("emailUsuario").value;
    rendaMensal = document.getElementById("rendaMensal").value;

    if (nomeUsuario != "" && emailUsuario != "" && rendaMensal > 0){
        window.location.href = "telaInicial.html";
        return nomeUsuario, emailUsuario, rendaMensal;
    } else{
        document.getElementById("aviso").innerHTML = "<strong>Preencha todos os campos corretamente!</strong>"
    };
    document.getElementById("saudacao").innerHTML = "Olá, " + nomeUsuario + "!";
};