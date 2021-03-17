const express = require('express');
const ruta = express.Router();

const modelo = 'control';
//Requiero mi conexion
const conexion = require('../util/conexion_mysql');
//Valido el usuario para proteger ruta
const {usuarioIngreso} = require('../util/validar_usuario');

ruta.get('/:id/:persona', usuarioIngreso, async(req, res)=>{
    const {id, persona} = req.params;
    const datos = await conexion.query('SELECT * FROM ' + modelo + ' WHERE persona_id=?', [id]);

    res.render('control/index', {datos, id, persona});
});

ruta.post('/:id/:persona', usuarioIngreso, async(req, res)=>{
    const {id, persona} = req.params;
    const {fecha} = req.body;
    const datos = await conexion.query('SELECT * FROM ' + modelo + ' WHERE fecha=? AND persona_id=?', [fecha, id]);
    res.render('control/index', {datos, id, persona});
});

ruta.post('/agregar/:id/:persona', usuarioIngreso, async(req, res)=>{
    const {origen, destino, temperatura, fecha, hora, placa_vehiculo, observacion} = req.body;
    const {id, persona} = req.params;
    const dato_guardar ={
        origen,
        destino,
        temperatura,
        observacion,
        fecha,
        hora,
        placa_vehiculo,
        persona_id : id
    }

    await conexion.query('INSERT INTO ' + modelo + ' SET ?', [dato_guardar]);
    req.flash('correcto','Guardado correctamente');
    res.redirect('/control/' + id + '/' + persona);
});

/*
ruta.get('/editar/:id/:idpersona/:persona', usuarioIngreso, async(req, res) =>{
    const {id, idpersona, persona} =req.params;
    const dato = await conexion.query('SELECT * FROM '+ modelo + ' WHERE id=?', [id]);
    res.render('control/editar', {dato, idpersona, persona});
});


ruta.post('/editar/:id/:idpersona/:persona', usuarioIngreso, async(req, res)=>{
    const {id, idpersona, persona} = req.params;
    const {origen, destino, temperatura, placa, observacion} = req.body;
    const datos ={
        origen,
        destino,
        temperatura,
        placa,
        observacion
    }
    await conexion.query('UPDATE ' + modelo + ' SET ? WHERE id=?', [datos, id]);
    req.flash('correcto', 'Editado correctamente');
    res.redirect('/control/' + idpersona + '/' + persona);
});


ruta.get('/eliminar/:id/:idpersona/:persona', usuarioIngreso, async(req, res)=>{
    const {id, idpersona, persona} = req.params;
    await conexion.query('DELETE FROM ' + modelo + ' WHERE id=?', [id]);
    req.flash('correcto', 'Eliminado correctamente');
    res.redirect('/control/' + idpersona + '/' + persona);
});
*/


module.exports = ruta;