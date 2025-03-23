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
