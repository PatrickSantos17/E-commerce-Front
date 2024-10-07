// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

data = [];

var produtosIDCarrinho = JSON.parse(localStorage.getItem("produtos")) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProduto();
    console.log(produtosIDCarrinho);
})

async function fetchProduto() {
    try {
        const response = await fetch(`http://localhost:8080/produto/listagemAtivos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log(result);  // Verifique a estrutura da resposta
        data = result.produtos; // Acessa o array de produtos
        montarLayoutExibicao(data);

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function montarLayoutExibicao(produtos) {
    const listaProdutos = document.getElementById('product-list');
    listaProdutos.innerHTML = '';

    let produtosHTML = '';

    produtos.forEach(produto => {
        if (produto.ativo) {  // Apenas exibe produtos ativos
            // Gerar estrelas com base na avaliação
            const avaliacao = produto.avaliacao;
            let estrelasHTML = '';
            const estrelasCheias = Math.floor(avaliacao); // Número de estrelas cheias
            const temEstrelaMeia = (avaliacao % 1) >= 0.5; // Verifica se tem estrela meia

            // Adiciona estrelas cheias (SVG)
            for (let i = 0; i < estrelasCheias; i++) {
                estrelasHTML += `
                    <svg height="24px" width="24px" class="star filled" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521
                            c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506
                            c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625
                            c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191
                            s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586
                            s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></g></g>
                    </svg>`;
            }

            // Adiciona estrela meia se necessário (SVG)
            if (temEstrelaMeia) {
                estrelasHTML += `
                    <svg height="24px" width="24px" class="star half" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="50%" style="stop-color:#ffeb49;stop-opacity:1" />
                                <stop offset="50%" style="stop-color:#666;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <g>
                            <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521
                                c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506
                                c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625
                                c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191
                                s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586
                                s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z">
                            </path>
                        </g>
                    </svg>
                `;
            }
            

            // Adiciona estrelas vazias (SVG)
            const estrelasVazias = 5 - estrelasCheias - (temEstrelaMeia ? 1 : 0);
            for (let i = 0; i < estrelasVazias; i++) {
                estrelasHTML += `
                    <svg height="24px" width="24px" class="star empty" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521
                            c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506
                            c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625
                            c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191
                            s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586
                            s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></g></g>
                    </svg>`;
            }

            produtosHTML += `
                <div class="col product-col">
                    <div class="card h-100 card-sm">
                        <img src="${produto.urlImagemPrincipal}" class="card-img-top img-sm" alt="${produto.nomeProduto}">
                        <div class="card-body">
                            <div class="produtos-nome">
                                <h5 class="card-title">${produto.nomeProduto}</h5>
                                <hr>
                            </div>
                            <p class="card-text"><strong>R$ ${formatarCasasDecimais(produto.preco)}</strong></p>
                            <p> ${estrelasHTML}</p> <!-- Aqui estão as estrelas -->
                            <a href="TelaDetalheProduto.html?produtoId=${produto.id}" class="btn btn-primary">Detalhes do produto</a>

                            <button onclick="adicionarCarrinho(${produto.id})" class="btn btn-primary">Comprar</button>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    listaProdutos.innerHTML = produtosHTML;
}

function formatarCasasDecimais(numero) {
    return Number(numero).toFixed(2);
}

function redirecionarTelaLogin() {
    window.location.href = "Login.html"
}

function adicionarCarrinho(produtoId) {
    produtosIDCarrinho.push(produtoId);
    localStorage.setItem("produtos", JSON.stringify(produtosIDCarrinho));
    window.location.href = "TelaCarrinho.html";
}