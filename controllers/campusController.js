const { Router } = require('express');
const db = require('../db');
const roteador = Router();

roteador.get('/cadastro', (req, res)=>{
    res.render('campus/cadastroCampus');
});

roteador.post('/cadastro', (req, res) => {
    const { id, nome } = req.body;

    const sql = 'INSERT INTO campus (id, nome) VALUES (?, ?)';
    db.query(sql, [id, nome], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao cadastrar campus');
        }
        console.log(`Campus ${nome} cadastrado com sucesso!`);
        res.redirect('/campus/consulta');
    });
});


// Consulta todos os registros de campus
roteador.get('/consulta', (req, res) => {
    const sql = 'SELECT * FROM campus';

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao consultar campi');
        }

        res.render('campus/consultaCampus', { campus: resultados });
    });
});

// Exclusão de campus e registros relacionados (comissao, atletas, coordenacao)
roteador.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    // Excluindo os registros relacionados (comissao, atletas, coordenacao)
    const deleteComissao = 'DELETE FROM comissao WHERE campus_id = ?';
    const deleteAtletas = 'DELETE FROM atletas WHERE campus_id = ?';
    const deleteCoordenacao = 'DELETE FROM coordenacao WHERE campus_id = ?';
    
    // Primeiro, excluímos os registros relacionados
    db.query(deleteComissao, [id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao excluir comissões');
        }

        db.query(deleteAtletas, [id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erro ao excluir atletas');
            }

            db.query(deleteCoordenacao, [id], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erro ao excluir coordenações');
                }

                // Agora que os registros relacionados foram excluídos, excluímos o campus
                const deleteCampus = 'DELETE FROM campus WHERE id = ?';
                db.query(deleteCampus, [id], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Erro ao excluir campus');
                    }
                    res.redirect('/campus/consulta'); // Redireciona para a consulta após a exclusão
                });
            });
        });
    });
});

module.exports = roteador;
