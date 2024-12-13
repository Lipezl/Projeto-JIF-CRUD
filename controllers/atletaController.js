const { Router } = require('express');
const db = require('../db');
const roteador = Router();

// Exibe formulário de cadastro de atleta
roteador.get('/cadastro', (req, res) => {
    const sql = 'SELECT * FROM campus'; // Para listar os campi disponíveis
    db.query(sql, (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao carregar campi');
        }
        res.render('atleta/cadastroAtleta', { campus: resultados });
    });
});

// Cadastra novo atleta
roteador.post('/cadastro', (req, res) => {
    const { nome, dataNascimento, documento, modalidade, campus_id } = req.body;
    const id_usuario = req.session.usuario_id; // ID do usuário logado

    const sql = `
        INSERT INTO atletas (nome, dataNascimento, documento, modalidade, campus_id, id_usuario)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, dataNascimento, documento, modalidade, campus_id, id_usuario], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao cadastrar atleta');
        }
        console.log(`Atleta ${nome} cadastrado com sucesso!`);
        res.redirect('/atleta/consulta');
    });
});

// Consulta lista de atletas
roteador.get('/consulta', (req, res) => {
    const sql = `
        SELECT 
            atletas.*, 
            usuarios.NomeUsuario AS responsavel,
            campus.nome AS campus
        FROM atletas
        INNER JOIN usuarios ON atletas.id_usuario = usuarios.id
        INNER JOIN campus ON atletas.campus_id = campus.id
    `;

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao consultar atletas');
        }
        res.render('atleta/consultaAtleta', { atletas: resultados });
    });
});

// Exibe formulário de edição de atleta
roteador.get('/editar/:id', (req, res) => {
    const { id } = req.params;

    const sqlAtleta = 'SELECT * FROM atletas WHERE id = ?';
    const sqlCampus = 'SELECT * FROM campus'; // Definindo a consulta para obter os campi

    db.query(sqlAtleta, [id], (err, atletaResultados) => {
        if (err || atletaResultados.length === 0) {
            console.error(err);
            return res.status(404).send('Atleta não encontrado');
        }

        db.query(sqlCampus, (err, campusResultados) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao carregar campi');
            }

            res.render('atleta/editarAtleta', { 
                atleta: atletaResultados[0],
                campus: campusResultados 
            });
        });
    });
});

// Atualiza dados de um atleta
roteador.patch('/editar/:id', (req, res) => {
    const { nome, dataNascimento, documento, modalidade, campus_id } = req.body;
    const { id } = req.params;

    const sql = `
        UPDATE atletas 
        SET nome = ?, dataNascimento = ?, documento = ?, modalidade = ?, campus_id = ?
        WHERE id = ?
    `;

    db.query(sql, [nome, dataNascimento, documento, modalidade, campus_id, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao atualizar atleta');
        }
        res.redirect('/atleta/consulta');
    });
});

// Exclui atleta
roteador.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM atletas WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao excluir atleta');
        }
        res.redirect('/atleta/consulta');
    });
});


module.exports = roteador;