// Importando modulos
const mysql2 = require("mysql2");
const Sequelize = require("sequelize");

// Configuração da conexão com o banco de dados MySQL
//const sequelize = new Sequelize('railway', 'root', 'oAOJnWCesZqqRJkmdUaSWCyYEGBfYZzJ', {
// timestamps - retirada da criacao automatica das colunas createAt e updatedAt
//define: {
//    timestamps: false,
//},
//host: 'viaduct.proxy.rlwy.net',
//dialect: 'mysql',
//dialectModule: mysql2,
//port: '45429'
//})

/*
// Configuração da conexão com o banco de dados MySQL
const sequelize = new Sequelize(
  "railway",
  "root",
  "GYDOVyIMKnlNsIVFdYiemzKvThOSpaLb",
  {
    //timestamps - retirada da criacao automatica das colunas createAt e updatedAt
    define: {
      timestamps: false,
      //mysql://root:GYDOVyIMKnlNsIVFdYiemzKvThOSpaLb@ballast.proxy.rlwy.net:18118/railway
    },
    host: "ballast.proxy.rlwy.net",
    dialect: "mysql",
    dialectModule: mysql2,
    port: "18118",
  }
);*/

// Configuração da conexão com o banco de dados MySQL usando variáveis de ambiente
const sequelize = new Sequelize(
  process.env.railway, // Nome do banco de dados
  process.env.root, // Usuário do banco
  process.env.GYDOVyIMKnlNsIVFdYiemzKvThOSpaLb, // Senha do banco
  {
    host: process.env.mysql.railway.internal, // Host do banco de dados
    dialect: "mysql",
    dialectModule: mysql2, // Usando o mysql2 como dialect
    port: process.env.MYSQL_PORT || 3306 || 18118, // Porta padrão do MySQL (caso a variável não esteja definida)
    define: {
      timestamps: false, // Retirando as colunas createAt e updateAt
    },
  }
);

/*
// Configuração da conexão com o banco de dados MySQL
const sequelize = new Sequelize('sistema_estokey', 'root', '', {
    // timestamps - retirada da criacao automatica das colunas createAt e updatedAt
    define: {
        timestamps: false,
    },
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2,
    port: '3306'

})*/

// Verificacao da conexao com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão bem sucedida ao banco de dados MySQL");
  })
  .catch((erro) => {
    console.error("Erro ao conectar ao banco de dados: ", erro);
  });

// Exportando modulos
module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};
