const mysql = require('mysql');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const databaseName = process.env.DB_NAME;

function createDatabaseIfNotExists(connection) {
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``, (err) => {
        if (err) {
            console.error('Erro ao tentar criar o banco de dados:', err.stack);
            return;
        }
        console.log(`Banco de dados '${databaseName}' garantido.`);
        
        connection.changeUser({ database: databaseName }, (err) => {
            if (err) {
                console.error('Erro ao alterar para o banco de dados:', err.stack);
                return;
            }
            console.log(`Conectado ao banco de dados '${databaseName}'`);
        });
    });
}

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.stack);
        return;
    }
    console.log('Conectado ao MySQL.');
    createDatabaseIfNotExists(connection);
});

module.exports = connection;