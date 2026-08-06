function CadastroConta(){
    nomeUsuario = document.getElementById("nomeUsuario").value;
    emailUsuario = document.getElementById("emailUsuario").value;
    rendaMensal = document.getElementById("rendaMensal").value;

    if (nomeUsuario != "" && emailUsuario != "" && rendaMensal > 0){
        document.getElementById("TelaLogin").style.display = "none"
    } else{
        document.getElementById("aviso").innerHTML = "<strong>Preencha todos os campos corretamente!</strong>"
    }
};