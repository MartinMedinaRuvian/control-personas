const express = require('express');
const morgan = require('morgan');
const path = require('path');

const flash = require('connect-flash');
const session = require('express-session');
const MysqlStore = require('express-mysql-session');
const passport =  require('passport');

//Importo la configuracion de mi base de datos mysql
const {configuracion_mysql} = require('./configuracion/llaves');

//Inicion la conexion a la base de datos mysql
require('./util/autenticar_cuenta');


//Importo las rutas que voy a utilizar en el servidor
const indexRutas = require('./rutas/indexRutas');
const usuariosRutas = require('./rutas/usuarioRutas');
const personasRutas = require('./rutas/personasRutas');
const controlPersonasRutas = require('./rutas/controlPersona');
const controlCedulaRutas = require('./rutas/controlCedula');


const app = express();


//Funciones o configuraciones que se ejecutan primero (MIDLEWARES)
//Configuraciones de nuestro servidor donde podemos utilizar librerias
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//Configuro mi carpeta publica la cual va obtener todos los archivos estaticos como estilos css, archivos js y imagenes
app.use(express.static(path.join(__dirname, 'publico')))


//Configuro las sessiones que se van a manejar en el servidor
app.use(session({
    secret:'clave_secreta',
    resave:false,
    saveUninitialized:false,
    store:new MysqlStore(configuracion_mysql)
}));

//Inicio flash para poder enviar mensajes entre las vistas
app.use(flash());
//Inicio passport
app.use(passport.initialize());
app.use(passport.session());

//Configuro mis variables globales que me sirven para manejarlos en cualquier vista
app.use((req, res, next)=>{
    app.locals.correcto = req.flash('correcto');
    app.locals.incorrecto = req.flash('incorrecto');
    app.locals.usuario = req.user;
    next();
})

//Configuro las rutas que voy a utilizar en el servidor
app.use('/', indexRutas);
app.use('/usuarios', usuariosRutas);
app.use('/personas', personasRutas);
app.use('/control', controlPersonasRutas);
app.use('/control_cedula', controlCedulaRutas);

//Configuro las vistas o el frontend que voy a utilizar en el servidor
//Declaro que formato voy a utilizar para las vistas, en este caso se va a utilizar el formato EJS
app.set('view engine', 'ejs');
//Se configura la carpeta que va a contener todos nuestros archivos EJS con las vistas
app.set('views', path.join(__dirname, 'vistas'));


//Configuracion del puerto del servidor
app.set('port', 3000);
let puerto = app.get('port');
//Preparo el puerto en el servidor para la conexion
app.listen(puerto, ()=>{
    console.log('Servidor corriendo en el puerto ', puerto);
})