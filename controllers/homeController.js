const { Router } = require('express');
const roteador = Router();



roteador.get('/cadastro', (req, res)=>{
    res.render('home/cadastro');
});

roteador.get('/consulta', (req, res)=>{
    res.render('home/consulta');
});

// roteador.get('*', (req, res)=>{
//     res.status(404).render('error');
// });

module.exports = roteador;