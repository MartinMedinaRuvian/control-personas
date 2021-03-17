const express = require('express');
const ruta = express.Router();

const modelo = 'control_cedula';
//Importo la conexion
const conexion = require('../util/conexion_mysql');
//Valido el usuario para proteger mis ruta
const {usuarioIngreso} = require('../util/validar_usuario');

ruta.get('/editar/:id', usuarioIngreso, async(req, res) =>{
    const {id} =req.params;
    const dato = await conexion.query('SELECT * FROM '+ modelo + ' WHERE id=?', [id]);
    res.render('control_cedula/editar', {dato});
});


ruta.post('/editar/:id', usuarioIngreso, async(req, res)=>{
    const {id} = req.params;
    const datos = req.body;
    await conexion.query('UPDATE ' + modelo + ' SET ? WHERE id=?', [datos, id]);
    req.flash('correcto', 'Editado correctamente');
    res.redirect('/usuarios/perfil');
});



module.exports = ruta;