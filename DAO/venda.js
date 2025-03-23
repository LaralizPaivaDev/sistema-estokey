// Importando modulos
const { FOREIGNKEYS } = require("sequelize/lib/query-types");
const conexao = require("./conexao");
const produto = require("./produto");

//----------------------- Tela de Venda -----------------------------
const Venda = conexao.sequelize.define(
  "tbl_venda",
  {
    pk_venda: {
      type: conexao.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    data_venda: {
      type: conexao.Sequelize.DATE,
      allowNull: false,
    },
    fk_produto: {
      type: conexao.Sequelize.INTEGER,
      allowNull: false,
    },
    fk_valor_venda_produto: {
      type: conexao.Sequelize.INTEGER,
      allowNull: false,
    },
    quantidade_venda_produto: {
      type: conexao.Sequelize.INTEGER,
      allowNull: false,
    },
    total_pedido_venda: {
      type: conexao.Sequelize.DOUBLE,
      allowNull: false,
    },
    desconto_venda: {
      type: conexao.Sequelize.DOUBLE,
      allowNull: false,
    },
    total_pago_venda: {
      type: conexao.Sequelize.DOUBLE,
      allowNull: false,
    },
    forma_pag_venda: {
      type: conexao.Sequelize.STRING,
      allowNull: false,
    },
  },
  { freezeTableName: true }
);

// Definir relacionamento (Uma Venda tem um Produto)
Venda.belongsTo(produto, {
  constraint: true,
  foreignKey: "fk_produto",
  as: "tbl_produto",
});

Post.sync({ force: true });

module.exports = Venda;
