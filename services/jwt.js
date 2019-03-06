'use strict'

const jwt = require('jsonwebtoken');

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role,
        img: user.img
    };

    return jwt.sign(
        { payload },
        process.env.SEED,
        { expiresIn: process.env.CADUCIDAD_TOKEN }
    );
};