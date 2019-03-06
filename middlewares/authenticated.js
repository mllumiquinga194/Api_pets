'use strict'

const jwt = require('jsonwebtoken');

exports.ensureAuth = function (req, res, next) {

    let token = req.get('Authorization')//de esta forma puedo obtener los headers.. asi lo hago por via URL.
    //req.headers.authorization asi puedo hacerlo cuando es enviado en los headers desde el cliente al servidor
    jwt.verify(token, process.env.SEED, (err, decoded) => { //verifico si el token es valido y recuperar la informacion del token. toda la informacion esta en la respuesta del callback, en este caso en decoded
        
        if (err) {
            return res.status(401).json({//401 error de no autorizacion
                ok: false,
                err
            });
        }
        req.user = decoded.payload; //req.user va a ser recibido en la funcion donde aplico el middlware
        console.log('TOKEN', token);
        console.log('PAYLOAD', decoded.payload);
        console.log('SEED', process.env.SEED);
        next();
    });
};

exports.verificaAdmin_Role = (req, res, next) => {
    let user = req.user;    
    
    if (user.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({//401 error de no autorizacion
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};