// Importando modulos
const { FOREIGNKEYS } = require("sequelize/lib/query-types");
const conexao = require("./conexao");

//----------------------- Tela de Produto ---------------------------
const Produto = conexao.sequelize.define(
  "tbl_produto",
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
  { freezeTableName: true }
);

Post.sync({ force: true });

module.exports = Produto;
