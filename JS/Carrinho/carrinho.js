// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var totalProdutos;
var totalFrete;
let listaSalva = JSON.parse(localStorage.getItem("produtos"));
var frete = 0.00;

document.addEventListener('DOMContentLoaded', () => {
    const carrinhoBuscarNLRequestDTO = {
        "listaIds": listaSalva
    }
    buscarCarrinhoNL(carrinhoBuscarNLRequestDTO);
});

async function buscarCarrinhoNL(listaIdProdutos) {
    await carregaCarrinho(listaIdProdutos);
    totalFrete = totalProdutos += parseFloat(frete);
    const conteudo = document.querySelector(".content");
    conteudo.innerHTML += `<aside>
                <div class="box">
                    <header>
                        <img src="src/img/carrinho-de-compras.png" alt="imagem carrinho"/>
                        <p>Resumo da compra</p>
                    </header>
                    <div class="info">
                        <div><span>Produtos:</span><span>R$ ${totalProdutos.toFixed(2)}</span></div>
                        <div><span>Frete</span><span>R$ 0.00</span></div>
                    </div>
                    <footer>
                        <span>Total</span>
                        <span>R$ ${totalFrete.toFixed(2)}</span>
                    </footer>
                </div>
                <div class="box entrega">
                    <header>
                        <img src="src/img/entrega-rapida.png" alt="imagem carrinho"/>
                        <p>Entrega</p>
                    </header>
                    <div class="box-cep">
                        <div class="input-cep">
                            <input type="text" class="cep" id="cep" placeholder="Digite seu CEP..."
                                            maxlength="9" required>
                            <div class="invalid-feedback">
                                Digite um CPF válido.
                            </div>
                            <div class="valid-cep">
                            </div>
                        </div>
                        <button class="btn-cep">OK</button>
                    </div>
                </div>
                <div class="btn-finali-conti">
                    <button class="btn-finalizar">FINALIZAR COMPRA</button>
                    <button class="btn-continuar" onclick="directToTelaProdutos()">CONTINUAR COMPRANDO</button>
                </div>
            </aside>`;
    // Agora que o botão foi adicionado ao DOM, podemos adicionar o event listener e a máscara
    const cepInput = document.querySelector('#cep');
    cepInput.addEventListener('input', aplicarMascaraCEP);

    document.querySelector('.btn-cep').addEventListener('click', async function (event) {
        event.preventDefault();
        const cep = cepInput.value.trim();

        // Expressão regular para validar o formato do CEP
        const cepRegex = /^\d{5}-\d{3}$/;

        if (!cepRegex.test(cep)) {
            mostrarMensagemErro('Digite um CEP válido.');
            return;
        }

        try {
            const endereco = await buscarEnderecoViaCEP(cep);
            if (endereco.erro) {
                mostrarMensagemErro('CEP não encontrado.');
            } else {
                console.log('Endereço encontrado:', endereco);
                mostrarEndereco(endereco);
            }
        } catch (error) {
            mostrarMensagemErro('Erro ao buscar o CEP.');
            console.error('Erro:', error);
        }
    });
}

async function carregaCarrinho(listaIdProdutos) {
    const response = await fetch('http://' + API + ':8080/api/carrinho/buscarCarrinhoNL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listaIdProdutos)
    });

    if (!response.ok) {
        throw new Error('Erro ao cadastrar produto: ' + response.statusText);
    }

    totalProdutos = 0;
    const result = await response.json();
    const prodCarrinho = document.querySelector(".produtoCarrinho");
    prodCarrinho.innerHTML = '';
    prodCarrinho.innerHTML = `<thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Total</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>`;
    result.produtos.forEach(produtoCarrinho => {
        const row = document.createElement('tbody');
        row.innerHTML = `
                        <tr>
                            <td>
                                <img src="${produtoCarrinho.produto.urlImagemPrincipal}" alt="Imagem produto" />
                            </td>
                            <td>
                                <div class="product">
                                    <div class="info">
                                        <div class="name">${produtoCarrinho.produto.nomeProduto}</div>
                                        <div class="category">${produtoCarrinho.produto.categoria}</div>
                                    </div>
                                </div>
                            </td>
                            <td>R$ ${produtoCarrinho.produto.preco}</td>
                            <td>
                                <div class="qty">
                                    <button class="btn-diminuir" onclick="diminuirQtd(${produtoCarrinho.produto.id})"><i class="bx bx-minus"></i></button>
                                    <span class="quantidade">${produtoCarrinho.quantidade}</span>
                                    <button class="btn-aumentar" onclick="aumentarQtd(${produtoCarrinho.produto.id})"><i class="bx bx-plus"></i></button>
                                </div>
                            </td>
                            <td>R$ ${(produtoCarrinho.produto.preco * produtoCarrinho.quantidade).toFixed(2)}</td>
                            <td>
                                <button class="remove"><i class="bx bx-x"></i></button>
                            </td>
                        </tr>
            `;
        totalProdutos += produtoCarrinho.produto.preco * produtoCarrinho.quantidade;
        prodCarrinho.appendChild(row);
    });
}

// Função para aplicar a máscara no campo de CEP
function aplicarMascaraCEP(event) {
    let cep = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (cep.length > 5) {
        cep = cep.replace(/(\d{5})(\d)/, '$1-$2'); // Aplica a máscara 12345-678
    }
    event.target.value = cep; // Atualiza o campo com a máscara
}

// Função para buscar o endereço usando a API ViaCEP
async function buscarEnderecoViaCEP(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return response.json();
}

// Função para mostrar mensagem de erro
function mostrarMensagemErro(mensagem) {
    const feedback = document.querySelector('.invalid-feedback');
    feedback.textContent = mensagem;
    feedback.style.display = 'block';
}

// Função para exibir o endereço e os valores de frete
function mostrarEndereco(endereco) {
    const feedback = document.querySelector('.invalid-feedback');
    feedback.style.display = 'none';  // Esconder a mensagem de erro

    // Verifica se já existe a div de info-cep, para não duplicar a exibição
    let infoCepDiv = document.querySelector('.info-cep');
    if (!infoCepDiv) {
        const caixaEntrega = document.querySelector('.entrega');
        infoCepDiv = document.createElement('div');
        infoCepDiv.classList.add('info-cep');
        caixaEntrega.appendChild(infoCepDiv);
    }

    // Gera três valores de frete aleatórios entre 10 e 100 reais, com diferenças pequenas entre eles
    const frete1 = (Math.random() * (90) + 10).toFixed(2);
    const frete2 = (parseFloat(frete1) + (Math.random() * 10)).toFixed(2);
    const frete3 = (parseFloat(frete2) + (Math.random() * 10)).toFixed(2);

    // Cria o conteúdo com os valores de frete
    infoCepDiv.innerHTML = `
        <p><strong>Entregar em:</strong> ${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}</p>
        <p><strong>Escolha o valor do frete:</strong></p>
        <div class="frete-options">
            <div class="fretes">
                <input type="radio" id="frete1" name="frete" value="${frete1}">
                <p>Entrega Econômica</p>
                <label for="frete1">R$ ${frete1}</label><br>
            </div>
            <div class="fretes">
                <input type="radio" id="frete2" name="frete" value="${frete2}">
                <p>Entrega Rápida</p>
                <label for="frete2">R$ ${frete2}</label><br>
            </div>
            <div class="fretes">
                <input type="radio" id="frete3" name="frete" value="${frete3}">
                <p>Entrega Expressa</p>
                <label for="frete3">R$ ${frete3}</label>
            </div>
        </div>
    `;

    // Adiciona o event listener para atualizar o frete no total quando o usuário selecionar uma opção
    document.querySelectorAll('input[name="frete"]').forEach(radio => {
        radio.addEventListener('change', atualizarFrete);
    });
}

// Função para atualizar o frete e o total da compra
function atualizarFrete() {
    let freteSelecionado;
    if (document.querySelector('input[name="frete"]:checked')) {
        freteSelecionado = document.querySelector('input[name="frete"]:checked').value;
        const totalFrete = totalProdutos + parseFloat(freteSelecionado);

        const resumoFrete = document.querySelector('.info div:nth-child(2) span:last-child');
        const resumoTotal = document.querySelector('footer span:last-child');

        resumoFrete.textContent = `R$ ${freteSelecionado}`;
        resumoTotal.textContent = `R$ ${totalFrete.toFixed(2)}`;
    } else {
        const resumoTotal = document.querySelector('footer span:last-child');
        resumoTotal.textContent = `R$ ${totalProdutos.toFixed(2)}`;
    }
}

function aumentarQtd(produtoId) {
    listaSalva.push(produtoId);
    localStorage.setItem("produtos", JSON.stringify(listaSalva));
    atualizarCarrinho();
}

function diminuirQtd(produtoId) {
    // Remove um ID do produto da listaSalva
    listaSalva.splice(listaSalva.indexOf(produtoId), 1);
    localStorage.setItem("produtos", JSON.stringify(listaSalva));
    atualizarCarrinho();
}

async function atualizarCarrinho() {
    let qtdCarrinho = document.querySelector('.qtd-carrinho');
    const carrinhoBuscarNLRequestDTO = {
        "listaIds": listaSalva
    }
    await carregaCarrinho(carrinhoBuscarNLRequestDTO);
    const resumoProdutos = document.querySelector('.info div:nth-child(1) span:last-child');
    resumoProdutos.textContent = `R$ ${totalProdutos.toFixed(2)}`;
    atualizarFrete();
    qtdCarrinho.innerHTML = listaSalva.length;
}

function directToTelaProdutos() {
    window.location.href = "TelaProduto.html";
}
