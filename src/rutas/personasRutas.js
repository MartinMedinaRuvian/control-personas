const express = require('express');
const ruta = express.Router();

const modelo = 'persona';
//Importo la conexion
const conexion = require('../util/conexion_mysql');
//Valido el usuario para proteger mis ruta
const {usuarioIngreso} = require('../util/validar_usuario');

ruta.get('/', usuarioIngreso, async (req, res)=>{
    const datos = await conexion.query('SELECT * FROM ' + modelo + " WHERE cuenta_id=?", [req.user.id]);
    res.render('personas/index', {datos});
});

ruta.post('/', usuarioIngreso, async (req, res)=>{
    const {identificacion} = req.body;
    const datos = await conexion.query('SELECT * FROM ' + modelo + " WHERE identificacion=? AND cuenta_id=?", [identificacion, req.user.id]);
    res.render('personas/index', {datos});
});

ruta.post('/agregar', usuarioIngreso, async(req, res)=>{
    const {nombre, identificacion, telefono, ciudad_residencia} = req.body;
    const yaEsta = await conexion.query('SELECT identificacion FROM '+ modelo+ ' WHERE identificacion=?', [identificacion]);
   console.log(yaEsta)
    if(yaEsta.length > 0){
        req.flash('incorrecto', 'La identificación ' + identificacion + ' Ya existe.');
        res.redirect('/personas')
    }else{
        const dato_guardar = {
            nombre,
            identificacion,
            telefono,
            ciudad_residencia,
            cuenta_id : req.user.id
        }
        await conexion.query('INSERT INTO ' + modelo + ' SET ?', [dato_guardar]);
        req.flash('correcto', 'Guardado correctamente');
        res.redirect('/personas');
    }

});



ruta.get('/editar/:id', usuarioIngreso, async(req, res) =>{
    const {id} =req.params;
    const dato = await conexion.query('SELECT * FROM '+ modelo + ' WHERE id=?', [id]);
    res.render('personas/editar', {dato});
});


ruta.post('/editar/:id', usuarioIngreso, async(req, res)=>{
    const {id} = req.params;
    const datos = req.body;
    await conexion.query('UPDATE ' + modelo + ' SET ? WHERE id=?', [datos, id]);
    req.flash('correcto', 'Editado correctamente');
    res.redirect('/personas');
});

/*
ruta.get('/confirmar_eliminar/:id/:nombre', usuarioIngreso, async(req, res)=>{
    const {id, nombre} = req.params;
    res.render('personas/confirmar_eliminar', {id, nombre});
});

ruta.get('/eliminar/:id', usuarioIngreso, async(req, res)=>{
    const {id} = req.params;
    await conexion.query('DELETE FROM ' + modelo + ' WHERE id=?', [id]);
    req.flash('correcto', 'Eliminado correctamente');
    res.redirect('/personas');
})
*/

module.exports = ruta;