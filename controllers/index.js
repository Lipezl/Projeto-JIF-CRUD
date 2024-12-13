const usersController = require('./usersController');
const atletaController = require('./atletaController');
const homeController = require ('./homeController');
const comissaoController = require('./comissaoController');
const coordenacaoController = require('./coordenacaoController');
const campusController = require('./campusController');

controllers = {
    users: usersController,
    home: homeController,
    atleta: atletaController,
    comissao: comissaoController,
    coordenacao: coordenacaoController,
    campus: campusController
}

module.exports = controllers;