const express = require('express');
const ruta = express.Router();
const passport = require('passport');

//Modelo o tabla
const modelo = 'cuenta';

//Requiero la conexion a mysql
const pool = require('../util/conexion_mysql');

//Requiero la utilidad validar para validar si el usuario ya inicio sesion o no para proteger ruta
const {usuarioIngreso, usuarioNoIngreso} = require('../util/validar_usuario');

ruta.get('/',usuarioIngreso, (req, res)=>{
res.render('usuarios/index');
});

ruta.get('/agregar', usuarioNoIngreso, (req, res)=>{
    res.render('usuarios/agregar');
});

ruta.post('/agregar', usuarioNoIngreso, passport.authenticate('agregar_cuenta_local',{
    successRedirect:'/usuarios/perfil',
    failureRedirect:'/usuarios/agregar',
    failureFlash:true
}));


ruta.get('/ingresar', usuarioNoIngreso, (req, res)=>{
    res.render('usuarios/ingresar');
});

ruta.post('/ingresar', usuarioNoIngreso, (req, res, next)=>{
    passport.authenticate('iniciar_sesion_local', {
        successRedirect:'/usuarios/perfil',
        failureRedirect:'/usuarios/ingresar',
        failureFlash:true
    })(req, res, next);
})

ruta.get('/eliminar/:id', usuarioIngreso, async(req, res)=>{
     const {id} = req.params;
     await pool.query('DELETE FROM ' + modelo + ' WHERE id=?', [id]);
     req.flash('correcto','Eliminado correctamente');
     res.redirect('/');
});


ruta.get('/editar/:id', usuarioIngreso, async(req, res)=>{
    const {id}= req.params;
    const datos = await pool.query('SELECT * FROM '+ modelo + ' WHERE id=?', [id]); 
    res.render('usuarios/editar', {datos});
});

ruta.post('/editar', usuarioIngreso, async(req, res)=>{
   const datos = req.body;
   await pool.query('UPDATE ' + modelo + ' SET ? WHERE id=?', [datos, id]);
   res.redirect('/usuarios')
});


ruta.get('/perfil', usuarioIngreso, async(req, res)=>{
    const controlCedula = await pool.query('SELECT id, digitos FROM control_cedula WHERE cuenta_id=?', [req.user.id]);
    req.flash('digitos_cedula', controlCedula[0].digitos); 
    res.render('usuarios/perfil', {controlCedula});
});

ruta.get('/salir', (req, res)=>{
    req.logOut();
    res.redirect('/usuarios/ingresar');
})



module.exports = ruta;