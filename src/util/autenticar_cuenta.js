const passport = require('passport');
const EstrategiaLocal = require('passport-local').Strategy;
 
//Requiero mi conexion de mysql
const pool = require('./conexion_mysql');
//Requiero para encriptar y desencriptar el password
const util = require('./util_bcrypt');


passport.use('iniciar_sesion_local', new EstrategiaLocal({
usernameField:'usuario',
passwordField:'password',
passReqToCallback:true
}, async (req, usuario, password, done)=>{
    const filas = await pool.query('SELECT * FROM cuenta WHERE usuario=?', [usuario]);
    if(filas.length >0){    
        const user = {
           id: filas[0].id,
           usuario : filas[0].usuario,
           nombre : filas[0].nombre,
           password: filas[0].password,
        }
        const password_correcta = await util.desencriptar_password(password, user.password);

        if(password_correcta){
        return done(null, user, req.flash('correcto', 'Bienvenido ' + user.nombre));          
        }else{
        return  done(null, false, req.flash('incorrecto', 'Contraseña incorrecta'));
        }
    }else{
        return done(null, false, req.flash('incorrecto', 'El usuario ' + usuario + ' no existe'));
    }
}));



passport.use('agregar_cuenta_local', new EstrategiaLocal({
    usernameField:'usuario',
    passwordField:'password',
    passReqToCallback:true
}, async (req, usuario, password, done)=>{
    const {nombre} = req.body;

    const usuarioGuardar ={
    nombre,
    usuario,
    password    
    };

    const ya_registrado = await pool.query('SELECT usuario FROM cuenta WHERE usuario =?', [usuario]);

    if(ya_registrado.length > 0){
     done(null, false, req.flash('incorrecto', 'El usuario ' + usuario + ' ya existe'));
    }else{
        
        //Encripto el password antes de guardar
        usuarioGuardar.password = await util.encriptar_password(password);

       

        const resultado = await pool.query('INSERT INTO cuenta SET ?', [usuarioGuardar]);

        //Obtengo el id del usuario guardado para retornarlo y guardarlo en la session
        usuarioGuardar.id = resultado.insertId;

        controlCedula = {
            digitos: '0 y 1',
            cuenta_id : usuarioGuardar.id        
         };

         await pool.query('INSERT INTO control_cedula SET ?',[controlCedula]);
        
        return done(null, usuarioGuardar);
    }

}));


passport.serializeUser((usuario, done)=>{
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done)=>{
    const filas = await pool.query('SELECT * FROM cuenta WHERE id =?', [id]);
    const controlCedula = await pool.query('SELECT digitos FROM control_cedula WHERE cuenta_id=?', [id]);      
    const usuario = {
        id: filas[0].id,
        usuario : filas[0].usuario,
        nombre : filas[0].nombre,
        password: filas[0].password,
        digitos_cedula : controlCedula[0].digitos
     }
    done(null, usuario);
});

module.exports = passport;
