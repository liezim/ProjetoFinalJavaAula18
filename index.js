document.addEventListener('DOMContentLoaded', function() {
    const produtosContainer = document.getElementById('produtos');
    const carrinhoResumo = document.getElementById('carrinho-resumo');
    const finalizarCompraButton = document.getElementById('finalizar-compra');
    const loginForm = document.getElementById('login-form');
    const mensagemLogin = document.getElementById('mensagem-login');

    let carrinho = [];
   
    
    function carregarProdutos() {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                exibirProdutos(data);
            });
    }
    
    function exibirProdutos(produtos) {
        produtosContainer.innerHTML = '';
        produtos.forEach(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('produto');
            produtoDiv.innerHTML = `
                <img src="${produto.image}" alt="${produto.title}">
                <h3>${produto.title}</h3>                
                <p>Preço: R$ ${produto.price.toFixed(2)}</p>
                <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
            `;
            produtosContainer.appendChild(produtoDiv);
        });
    }

    // Função para adicionar produtos ao carrinho
    window.adicionarAoCarrinho = function(id) {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then(response => response.json())
            .then(produto => {
                const produtoNoCarrinho = carrinho.find(p => p.id === produto.id);
                if (produtoNoCarrinho) {
                    produtoNoCarrinho.quantidade++;
                } else {
                    produto.quantidade = 1;
                    carrinho.push(produto);
                }
                atualizarCarrinho();
            });
    }
    
    function atualizarCarrinho() {
        carrinhoResumo.innerHTML = '';
        let total = 0;
        carrinho.forEach(produto => {
            const subtotal = produto.price * produto.quantidade;
            total += subtotal;
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <p>${produto.title} - ${produto.quantidade} x R$ ${produto.price.toFixed(2)} = R$ ${subtotal.toFixed(2)}</p>
            `;
            carrinhoResumo.appendChild(itemDiv);
        });
        const totalDiv = document.createElement('div');
        totalDiv.innerHTML = `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
        carrinhoResumo.appendChild(totalDiv);
    }
    
    finalizarCompraButton.addEventListener('click', function() {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio.');
            return;
        }

        const mensagem = {
            email: 'user@example.com', 
            message: `Seu pedido foi confirmado! Detalhes: ${carrinho.map(produto => `${produto.title} (${produto.quantidade})`).join(', ')}. Total: R$ ${carrinho.reduce((total, produto) => total + produto.price * produto.quantidade, 0).toFixed(2)}`
        };
       
        fetch('https://api.aftership.com/v4/notifications', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer asat_cb9aec46eca14fabbda26831b308c459',  
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mensagem)
        }).then(response => response.json())
          .then(data => {
              alert('Compra finalizada com sucesso!');
              carrinho = [];
              atualizarCarrinho();
          }).catch(error => {
              console.error('Erro ao finalizar compra:', error);
              alert('Erro ao finalizar a compra.');
          });
    });
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'admin' && password === 'admin') {
            mensagemLogin.textContent = 'Login bem-sucedido!';
        } else {
            mensagemLogin.textContent = 'Usuário ou senha incorretos.';
        }
    });

    carregarProdutos();
});


document.addEventListener('DOMContentLoaded', () => {
    const formFrete = document.getElementById('form-frete');
    const cepInput = document.getElementById('cep');
    const resultadoFrete = document.getElementById('resultado-frete');
    const endereco = document.getElementById('endereco');
    const erro = document.getElementById('erro');
    const freteValor = resultadoFrete.querySelector('.frete-valor');

    formFrete.addEventListener('submit', async (event) => {
        event.preventDefault();

        const cep = cepInput.value.replace(/\D/g, ''); 
        if (cep.length !== 8) {
            erro.textContent = 'CEP inválido. Deve conter 8 dígitos.';
            endereco.textContent = '';
            freteValor.textContent = 'Frete: R$ 50,00';
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                erro.textContent = 'CEP não encontrado.';
                endereco.textContent = '';
            } else {
                erro.textContent = '';
                endereco.textContent = `Endereço: ${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
            }
        } catch (error) {
            erro.textContent = 'Ocorreu um erro ao buscar o CEP.';
            endereco.textContent = '';
        }
        freteValor.textContent = 'Frete: R$ 50,00';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const carrinho = {
        itens: [],
        quantidade: 0,
        total: 0,
    };
    
    function atualizarCarrinho() {
        const carrinhoLista = document.getElementById('carrinho-lista');
        const carrinhoQuantidade = document.getElementById('carrinho-quantidade');
        const carrinhoTotal = document.getElementById('carrinho-total-valor');

        carrinhoLista.innerHTML = ''; 

        carrinho.itens.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}`;
            carrinhoLista.appendChild(itemElement);
        });

        carrinhoQuantidade.textContent = carrinho.quantidade;
        carrinhoTotal.textContent = `R$ ${carrinho.total.toFixed(2)}`;
    }
   
    function adicionarItem(nome, preco) {
        const itemIndex = carrinho.itens.findIndex(item => item.nome === nome);

        if (itemIndex > -1) {
            carrinho.itens[itemIndex].quantidade += 1;
        } else {
            carrinho.itens.push({ nome, preco, quantidade: 1 });
        }

        carrinho.quantidade += 1;
        carrinho.total += preco;

        atualizarCarrinho();
    }
    
    document.querySelectorAll('.adicionar-carrinho').forEach(button => {
        button.addEventListener('click', (event) => {
            const produtoElement = event.target.closest('.produto');
            const nome = produtoElement.querySelector('.produto-nome').textContent;
            const preco = parseFloat(produtoElement.querySelector('.produto-preco').textContent.replace('R$ ', '').replace(',', '.'));

            adicionarItem(nome, preco);
        });
    });
});