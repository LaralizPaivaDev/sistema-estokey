const conexao = require("./conexao");

// Definindo o modelo Produto
const Produto = conexao.sequelize.define(
  "tbl_produto", // Nome da tabela no banco de dados
  {
    pk_produto: {
      type: conexao.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    descricao_produto: {
      type: conexao.Sequelize.STRING,
      allowNull: false,
    },
    categoria_produto: {
      type: conexao.Sequelize.STRING,
      allowNull: false,
    },
    valor_compra_produto: {
      type: conexao.Sequelize.DOUBLE,
      allowNull: false,
    },
    valor_bruto_venda_produto: {
      type: conexao.Sequelize.DOUBLE,
      allowNull: false,
    },
    quantidade_produto: {
      type: conexao.Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { freezeTableName: true } // Impede que o Sequelize altere o nome da tabela
);

// Sincronizando o modelo com o banco de dados
Produto.sync({ force: true }) // Isso irá apagar e recriar a tabela a cada execução
  .then(() => {
    console.log("Tabela 'tbl_produto' foi criada/recriada com sucesso!");
  })
  .catch((erro) => {
    console.error("Erro ao criar a tabela: ", erro);
  });

module.exports = Produto;
