const express = require('express');
const path = require('path');
const { users, home, atleta, comissao, coordenacao, campus } = require('./controllers'); // Importar o roteador de usuários
var methodOverride = require('method-override');
const app = express();
const port = 80;

const session = require('express-session');
const oneDay = 1000 * 60 * 60 * 24;
const sessionOptions = {
    secret: 'frasealeatoria',
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: false
};

app.use(session(sessionOptions));

function secure_pass(req, res, next) {
    if (req.session.login || req.path === '/login' || req.path === '/usuarios/novo') {
        next();
    } else {
        res.redirect('/usuarios/login');
    }
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

 // Verificar se o usuário está logado
app.use((req, res, next) => {
    const isLogin = req.session.usuario_id ? true : false;
    res.locals.isLogin = isLogin;
    next();
});

app.get('/', (req, res)=>{
    const isLogin = req.session.usuario_id ? true : false;
    const usuario = {NomeUsuario: req.session.NomeUsuario};
    res.render('home/home', { isLogin, usuarios:usuario});
});

app.use('/usuarios', users); // Roteador de usuários

app.use(secure_pass); // Protege todas as rotas a partir daqui

app.use(home);

app.use('/atleta', atleta);

app.use('/comissao', comissao);

app.use('/coordenacao', coordenacao);

app.use('/campus', campus);

app.listen(port, () => {
    console.log("Ouvindo na porta 80!");
});
