// Importando modulos
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8083;
const { engine } = require("express-handlebars");
const Produto = require("./DAO/produto");
const Venda = require("./DAO/venda");
const { Op } = require("sequelize");
const methodOverride = require("method-override");

// Template de engine
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// Emular o método PUT para formulários
app.use(methodOverride("_method"));

// Middleware para fazer o parsing do corpo da requisição HTTP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Servir arquivos estáticos do diretório 'public'
app.use(express.static(__dirname + "/public"));

//----------------------- Tela de Produto ---------------------------
// Rotas
/**
 * ------- Rota para ir para a lista de produtos --------
 * Adiciona "async" na função --> requisições e respostas assincronas
 * note: o async deve ser utilizado apenas para recuperar dados dinamicos (neste caso, a tabela produtos)
 */
app.get("/consultaProduto", async (req, res) => {
  try {
    const posts = await Produto.findAll();
    res.render("listagemProduto", { posts: posts });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return sendErrorResponse(
      res,
      "Erro ao buscar produtos!",
      "/consultaProduto"
    );
  }
});

// Rota para ir para a tela de cadastro de produtos
app.get("/cadastroProduto", (req, res) => {
  res.render("formularioProduto");
});

// Rota para ir para a pagina inicial - Estokey
app.get("/", (req, res) => {
  res.render("inicial");
});

// Rota para deletar os produtos cadastrados
app.get("/deletar/:pk_produto", (req, res) => {
  Produto.destroy({ where: { pk_produto: req.params.pk_produto } })
    .then(() => {
      res.send(`
            <script>              
                window.location.href = '/consultaProduto'; // Redirecionar para a tela de consulta
            </script>
        `);
    })
    .catch((error) => {
      console.error("Erro ao apagar produto: ", error);
      return sendErrorResponse(res, "Este produto não existe", "/consulta");
    });
});

// Rota para salvar um novo produto
app.post("/tbl_produto", (req, res) => {
  Produto.create({
    descricao_produto: req.body.descProduto.toUpperCase(),
    categoria_produto: req.body.catProduto.toUpperCase(),
    valor_compra_produto: req.body.valorCompraProduto,
    valor_bruto_venda_produto: req.body.valorBrutoVendaProduto,
    quantidade_produto: req.body.quantidadeProduto,
  })
    .then(() => {
      // Exibir mensagem de aletar ao cadastrar novo produto
      return sendSuccessResponse(
        res,
        "Produto cadastrado com sucesso",
        "/cadastroProduto"
      );
    })
    .catch((error) => {
      console.send("Erro ao inserir produto no banco de dados: " + error);
      return sendErrorResponse(
        res,
        "Erro ao inserir produto no banco de dados!",
        "/cadastroProduto"
      );
    });
});

/**
 * Rotas para ir a tela de edicao de produto (editarProduto)
 */
app.get("/editar/:id", async (req, res) => {
  try {
    const produto = await Produto.findByPk(req.params.id); // Buscar o produto com o ID passado
    if (produto) {
      // Renderiza a pagina de edicao com os dados do produto
      res.render("editarProduto", { produto });
    } else {
      res.send("Produto não encontrado");
    }
  } catch (error) {
    console.error("Erro ao ir a tela de edicao de produto:", error);
    return sendErrorResponse(
      res,
      "Erro ao editar ao ir a tela de edicao de produto!",
      "/consultaProduto"
    );
  }
});

/**
 * Metodo para atualizar o valores da tabela de produto
 * note que teve que instalar o method-override para simular uma requisicao put (atualizacao)
 */
app.put("/editar/:pk_produto", async (req, res) => {
  try {
    const { pk_produto } = req.params; // ID do produto passado na URL (pk_produto)
    const {
      descProduto,
      catProduto,
      valorCompraProduto,
      valorBrutoVendaProduto,
      quantidadeProduto,
    } = req.body;

    // Verifica se o produto existe
    const produto = await Produto.findByPk(pk_produto);
    if (!produto) {
      return sendErrorResponse(
        res,
        "Produto não encontrado!",
        "/consultaProduto"
      );
    }

    // Atualiza os dados do produto
    await Produto.update(
      {
        descricao_produto: descProduto,
        categoria_produto: catProduto,
        valor_compra_produto: valorCompraProduto,
        valor_bruto_venda_produto: valorBrutoVendaProduto,
        quantidade_produto: quantidadeProduto,
      },
      { where: { pk_produto: pk_produto } }
    );

    // Mensagem de sucesso
    return sendSuccessResponse(
      res,
      "Produto atualizado com sucesso!",
      "/consultaProduto"
    );
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    return sendErrorResponse(
      res,
      "Erro ao atualizar produto!",
      "/consultaProduto"
    );
  }
});

//----------------------- Tela de Venda -----------------------------
// Rotas
/**
 * ------- Rota para ir para a lista de vendas --------
 * Adiciona "async" na função --> requisições e respostas assincronas
 * note: o async deve ser utilizado apenas para recuperar dados dinamicos (neste caso, a tabela vendas (inner join))
 */
app.get("/consultaVenda", async (req, res) => {
  try {
    const venda = await Venda.findAll({
      // Adicionando "await" e armazenando o resultado
      attributes: [
        "pk_venda",
        "data_venda",
        "quantidade_venda_produto",
        "total_pago_venda",
        "forma_pag_venda",
      ],
      include: [
        {
          model: Produto,    // Importando de /DAO/produto
          as: "tbl_produto", // Nome do alias definido na associacao
          required: true,    // INNER JOIN - retorna apenas vendas com produtos existentes
          attributes: ["descricao_produto", "valor_bruto_venda_produto"],
        },
      ],
    });

    console.log(JSON.stringify(venda, null, 2)); // Definindo variavel (apenas no console)

    res.render("listagemVenda", { posts: venda }); // Alterado "posts" para receber o valor de "venda"
  } catch (error) {
    console.error("Erro ao buscar vendas: ", error);
    return sendErrorResponse(res, "Erro ao buscar vendas!", "/consultaVenda");
  }
});

// Rota para ir para a tela de cadastro de vendas
app.get("/cadastroVenda", (req, res) => {
  res.render("formularioVenda");
});

// Rota para deletar as vendas cadastradas
app.get("/deletarVenda/:pk_venda", (req, res) => {
  Venda.destroy({ where: { pk_venda: req.params.pk_venda } })
    .then(() => {
      res.send(`
        <script>              
            window.location.href = '/consultaVenda'; // Redirecionar para a tela de consulta de venda
        </script>
    `);
    })
    .catch((error) => {
      console.error("Erro ao deletar venda (banco de dados): ", error);
      return sendErrorResponse(
        res,
        "Erro ao deletar venda (banco de dados)!",
        "/consultaVenda"
      );
    });
});

app.get("/buscar-produto", async (req, res) => {
  try {
    const termoBusca = req.query.q;

    const produtos = await Produto.findAll({
      where: {
        descricao_produto: {
          [Op.like]: `%${termoBusca}%`,
        },
      },
    });

    if (produtos.length === 0) {
      return res.json([]);
    }

    // Log para verificar se `valor_venda` está presente
    console.log("Produtos encontrados: ", produtos);

    res.json(
      produtos.map((produto) => ({
        descricao_produto: produto.descricao_produto,
        valor_bruto_venda_produto: produto.valor_bruto_venda_produto,
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar produtos no campo texto:", error);
    return sendErrorResponse(
      res,
      "Erro ao buscar produtos no  campo texto!",
      "/cadastroVenda"
    );
  }
});

app.post("/tbl_venda", async (req, res) => {
  try {
    let {
      descProduto,
      qntVendaProduto,
      totalPedidoVenda,
      descontoVenda,
      totalPagoVenda,
      formaPagVenda,
    } = req.body;

    // Buscar o produto pelo nome da descrição
    const produto = await Produto.findOne({
      where: { descricao_produto: descProduto },
    });

    if (!produto) {
      return sendErrorResponse(
        res,
        "Produto não encontrado!",
        "/cadastroVenda"
      );
    }

    // Verificar se há estoque suficiente
    if (produto.quantidade_produto < qntVendaProduto) {
      return sendErrorResponse(res, "Estoque insuficiente!", "/cadastroVenda");
    }

    // Atualizar a quantidade do produto no banco de dados
    await Produto.update(
      { quantidade_produto: produto.quantidade_produto - qntVendaProduto },
      { where: { pk_produto: produto.pk_produto } }
    );

    // Insere a data atual da venda
    const dataVenda = new Date().toLocaleDateString("en-CA");

    // Verifica se o desconto foi preenchido, caso contrário, atribui 0
    descontoVenda = descontoVenda || 0;

    // Criar a venda no banco de dados
    await Venda.create({
      data_venda: dataVenda,
      fk_produto: produto.pk_produto,
      fk_valor_venda_produto: produto.pk_produto,
      quantidade_venda_produto: qntVendaProduto,
      total_pedido_venda: totalPedidoVenda,
      desconto_venda: descontoVenda,
      total_pago_venda: totalPagoVenda,
      forma_pag_venda: formaPagVenda,
    });

    return sendSuccessResponse(
      res,
      "Venda realizada com sucesso!",
      "/cadastroVenda"
    );
  } catch (error) {
    console.error("Erro ao processar a venda:", error);
    return sendErrorResponse(
      res,
      "Erro ao cadastrar a venda. Tente novamente.",
      "/cadastroVenda"
    );
  }
});

// Função para enviar mensagens de erro de forma reutilizável
function sendErrorResponse(res, message, redirectUrl) {
  res.send(`
        <script>
            alert('${message}');
            window.location.href = '${redirectUrl}';
        </script>
    `);
}

// Função para enviar mensagens de sucesso de forma reutilizável
function sendSuccessResponse(res, message, redirectUrl) {
  res.send(`
        <script>
            alert('${message}');
            window.location.href = '${redirectUrl}';
        </script>
    `);
}

// Abrindo uma requisição com o servidor
app.listen(port, () => {
  console.info(`Servidor rodando em http://localhost:${port}`);
});
