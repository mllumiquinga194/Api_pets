'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function (req, res, next) {

    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'La peticion no tiene la cabecera de Autenticación'
        });
    }

    //elimino las comillas simples o dobles que pueda traer el token de autenticacion y las reemplazo por nada ''.
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if ( payload.exp <= moment().unix() ) {// Si la fecha de expiracion del token es menor a la fecha actual,
            return res.status(401).send({
                message: 'El token ha expirado'
            });
        }
    } catch (ex) {
        return res.status(404).send({
            message: 'Token no valido'
        });
    }
    //le vamos añadir una propiedad user, al objeto req. ahora vamos a tener disponible dentro de cada metodo que utilice este middleware un objeto user con todos los datos del usuario logeado o identificado.
    req.user = payload;

    next(); //para salir del middleware
};