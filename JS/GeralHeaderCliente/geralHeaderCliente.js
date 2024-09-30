let grupo = localStorage.getItem("grupo");
let nome = localStorage.getItem("nome");

//pega o primeiro nome do usuario
let palavras = nome.split(" ");
let primeiroNome = palavras[0];

let iconUsuario = document.getElementById('iconUsuario');
let nomeUsuario = document.querySelector('.nome-usuario');

if (grupo === "Admin") {
    iconUsuario.src = "src/img/profile-user-admin.png"
} else {
    iconUsuario.src = "src/img/icon-cliente.png"
}

nomeUsuario.innerHTML = "Olá, " + primeiroNome;