const { Router } = require('express');
const db = require('../db');
const roteador = Router();

roteador.get('/cadastro', (req, res) => {
    const sql = 'SELECT * FROM campus';
    db.query(sql, (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao carregar campi');
        }
        res.render('coordenacao/cadastroCoordenacao', { campus: resultados });
    });
});

roteador.post('/cadastro', (req, res) => {
    const { nome, dataNascimento, documento, campus_id } = req.body; // Alterado para usar campus_id
    const id_usuario = req.session.usuario_id;

    const sql = 'INSERT INTO coordenacao (nome, dataNascimento, documento, campus_id, id_usuario) VALUES (?, ?, ?, ?, ?)'; // Alterado para incluir campus_id

    db.query(sql, [nome, dataNascimento, documento, campus_id, id_usuario], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Erro ao cadastrar coordenador');
        }
        console.log(`Coordenador ${nome} adicionado!`);
        res.redirect('/coordenacao/consulta');
    });
});

roteador.get('/consulta', (req, res) => {
    const sql = `
        SELECT coordenacao.*, usuarios.NomeUsuario AS responsavel, campus.nome AS campus
        FROM coordenacao
        INNER JOIN usuarios ON coordenacao.id_usuario = usuarios.id
        INNER JOIN campus ON coordenacao.campus_id = campus.id
    `; // Alterado para incluir o campus

    db.query(sql, (err, resultados) => {
        if (err) throw err;
        res.render('coordenacao/consultacoordenacao', { coordenacao: resultados });
    });
});

roteador.get('/editar/:id', (req, res) => {
    const { id } = req.params;
    const sqlAtleta = 'SELECT * FROM coordenacao WHERE id = ?';
    const sqlCampus = 'SELECT * FROM campus'; // Para listar os campi disponíveis

    db.query(sqlAtleta, [id], (err, resultados) => {
        if (err) throw err;
    
        if (resultados.length === 0) {
            return res.status(404).send('Coordenação não encontrada');
        }

        db.query(sqlCampus, (err, campusResultados) => {
            if (err) throw err;
            res.render('coordenacao/editarcoordenacao', { 
                coordenacao: resultados[0], 
                campus: campusResultados 
            });
        });
    });
});

roteador.patch('/editar/:id', (req, res) => {
    const { nome, dataNascimento, documento, campus_id } = req.body; // Alterado para usar campus_id
    const { id } = req.params;

    const sql = 'UPDATE coordenacao SET nome = ?, dataNascimento = ?, documento = ?, campus_id = ? WHERE id = ?'; // Alterado para incluir campus_id

    db.query(sql, [nome, dataNascimento, documento, campus_id, id], (err) => {
        if (err) throw err;
        res.redirect('/coordenacao/consulta');
    });
});

roteador.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM coordenacao WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.redirect('/coordenacao/consulta');
    });
});

module.exports = roteador;