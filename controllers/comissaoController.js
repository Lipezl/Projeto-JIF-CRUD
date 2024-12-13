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
        res.render('comissao/cadastroComissao', { campus: resultados });
    });
});

//create
roteador.post('/cadastro', (req, res) => {
    const { nome, dataNascimento, documento, modalidade, campus_id } = req.body;
    const id_usuario = req.session.usuario_id;

    const sql = `
        INSERT INTO comissao (nome, dataNascimento, documento, modalidade, campus_id, id_usuario)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, dataNascimento, documento, modalidade, campus_id, id_usuario], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao cadastrar comissão');
        }
        console.log(`Comissão ${nome} cadastrada com sucesso!`);
        res.redirect('/comissao/consulta');
    });
});

//read
roteador.get('/consulta', (req, res) => {
    const sql = `
        SELECT 
            comissao.*, 
            usuarios.NomeUsuario AS responsavel,
            campus.nome AS campus
        FROM comissao
        INNER JOIN usuarios ON comissao.id_usuario = usuarios.id
        INNER JOIN campus ON comissao.campus_id = campus.id
    `;

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao consultar comissões');
        }
        res.render('comissao/consultaComissao', { comissao: resultados });
    });
});

roteador.get('/editar/:id', (req, res) => {
    const { id } = req.params;

    const sqlComissao = 'SELECT * FROM comissao WHERE id = ?';
    const sqlCampus = 'SELECT * FROM campus';

    db.query(sqlComissao, [id], (err, comissaoResultados) => {
        if (err || comissaoResultados.length === 0) {
            console.error(err);
            return res.status(404).send('Comissão não encontrada');
        }

        db.query(sqlCampus, (err, campusResultados) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao carregar campi');
            }

            res.render('comissao/editarComissao', { 
                comissao: comissaoResultados[0],
                campus: campusResultados 
            });
        });
    });
});

//update
roteador.patch('/editar/:id', (req, res) => {
    const { nome, dataNascimento, documento, modalidade, campus_id } = req.body;
    const { id } = req.params;

    const sql = `
        UPDATE comissao 
        SET nome = ?, dataNascimento = ?, documento = ?, modalidade = ?, campus_id = ?
        WHERE id = ?
    `;

    db.query(sql, [nome, dataNascimento, documento, modalidade, campus_id, id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao atualizar comissão');
        }
        res.redirect('/comissao/consulta');
    });
});


//delete
roteador.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM comissao WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao excluir comissão');
        }
        res.redirect('/comissao/consulta');
    });
});

module.exports = roteador;