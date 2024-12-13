const { Router } = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // conexão com o banco de dados

const roteador = Router();

// Exibe o formulário de login
roteador.get('/login', (req, res) => {
    let erro = ""
    res.render('usuarios/login', {erro});
});

// Exibe o formulário de cadastro
roteador.get('/novo', (req, res) => {
    let erro = "";
    res.render('usuarios/novo', {erro});
});

// Processa o login do usuário
roteador.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE NomeUsuario = ? LIMIT 1';

    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Erro ao consultar banco de dados:', err);
            return res.render('usuarios/login', { erro: 'Erro interno. Tente novamente mais tarde.' });
        }

        if (results.length === 0) {
            return res.render('usuarios/login', { erro: 'Usuário ou senha incorretos.' });
        }

        const usuario = results[0];
        // Verificar a senha
        bcrypt.compare(password, usuario.Senha, (err, isMatch) => {
            if (err) {
                console.error('Erro ao verificar senha:', err);
                return res.render('usuarios/login', { erro: 'Erro interno. Tente novamente mais tarde.' });
            }
            if (!isMatch) {
                return res.render('usuarios/login', { erro: 'Usuário ou senha incorretos.' });
            }

            req.session.usuario_id = usuario.id;
            req.session.NomeUsuario = usuario.NomeUsuario;
            req.session.login = true;
            console.log(`Usuário ${usuario.NomeUsuario} logado!`);
            res.redirect('/');
        });
    });
});


//Criar um novo usuario
roteador.post('/cadastro', (req, res) => {
    const { nomeCompleto, email, NomeUsuario, Senha, dataNascimento } = req.body;

    // Verificar se todos os campos estão preenchidos
    if (!nomeCompleto || !email || !NomeUsuario || !Senha || !dataNascimento) {
        return res.render('usuarios/noivo', {
            erro: 'Por favor, preencha todos os campos.',
        });
    }

    // Verificar se o NomeUsuario ou Email já existem
    const sqlCheck = 'SELECT * FROM usuarios WHERE NomeUsuario = ? OR email = ? LIMIT 1';
    db.query(sqlCheck, [NomeUsuario, email], (err, results) => {
        if (err) {
            console.error(err);
            return res.render('usuarios/novo', {
                erro: 'Erro ao verificar se o usuário já existe. Tente novamente mais tarde.',
            });
        }

        if (results.length > 0) {
            return res.render('usuarios/novo', {
                erro: 'Nome de usuário ou e-mail já está em uso.',
            });
        }

        // Criptografar a senha antes de salvar
        bcrypt.hash(Senha, 10, (err, hashedPassword) => {
            if (err) {
                console.error(err);
                return res.render('usuarios/novo', {
                    erro: 'Erro ao criptografar senha. Tente novamente.',
                });
            }

            const sql = `
                INSERT INTO usuarios 
                (NomeCompleto, email, NomeUsuario, Senha, dataNascimento) 
                VALUES (?, ?, ?, ?, ?)
            `;
            db.query(sql, [nomeCompleto, email, NomeUsuario, hashedPassword, dataNascimento], (err) => {
                if (err) {
                    console.error(err);
                    return res.render('usuarios/novo', {
                        erro: 'Erro ao cadastrar usuário. Tente novamente.',
                    });
                }
                console.log(`Usuário ${NomeUsuario} cadastrado com sucesso!`);
                res.redirect('/usuarios/login');
            });
        });
    });
});


//logout
roteador.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Erro ao encerrar sessão');
        }

        // Redireciona para a página de login após o logout
        res.redirect('/');
    });
});

// Deleta a conta do usuário
roteador.delete('/deletar', (req, res) => {
    const userId = req.session.usuario_id;  // Pegue o userId da sessão

    if (!userId) {
        return res.status(401).send('Usuário não autenticado');
    }

    const sql = 'DELETE FROM usuarios WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Erro ao excluir usuário: ", err);
            return res.status(500).send('Erro ao excluir conta');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Se a conta for excluída com sucesso, destrói a sessão
        req.session.destroy((err) => {
            if (err) {
                console.error("Erro ao encerrar sessão: ", err);
                return res.status(500).send('Erro ao encerrar sessão');
            }

            console.log('Usuário deletado com sucesso!');
            res.redirect('/');  // Redireciona para a página inicial após a exclusão
        });
    });
});

module.exports = roteador;
