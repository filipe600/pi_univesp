const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatosController = require('./src/controllers/contatosController');
const reservasController = require('./src/controllers/reservaController');

const {loginRequired} = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);
route.get('/index/:data', homeController.index);
route.get('/contatos/cadastro', loginRequired, contatosController.cadastro);
route.post('/contatos/register', loginRequired, contatosController.register);
route.post('/contatos/edit/:id', loginRequired, contatosController.edit);
route.get('/contatos/index/:id', loginRequired, contatosController.editIndex);
route.get('/contatos/delete/:id', loginRequired, contatosController.delete);

// Rotas reservas
route.get('/reservas/cadastro', loginRequired, reservasController.cadastro);
route.post('/reservas/register', loginRequired, reservasController.register);
route.post('/reservas/edit/:id', loginRequired, reservasController.edit);
route.get('/reservas/index', loginRequired, reservasController.index);
route.get('/reservas/index/:id', loginRequired, reservasController.editIndex);
route.get('/reservas/delete/:id', loginRequired, reservasController.delete);

// Rotas de login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

module.exports = route;
