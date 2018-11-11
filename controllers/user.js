'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveUser(req, res) {

    var user = new User();
    var params = req.body;

    user.nombre = params.nombre;
    user.apellido = params.apellido;
    user.email = params.email;
    user.img = 'null';
    user.role = 'USER_ROLE';

    if (params.password) {
        //encriptar password
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.nombre != null && user.apellido != null && user.email != null) {
                //Guardar usuario
                user.save((err, userStored) => {
                    if (err) {
                        return res.status(500).send({
                            err,
                            message: 'Error al guardar el usuario'
                        });
                    } else {
                        if (!userStored) {
                            return res.status(404).send({
                                message: 'No se ha guardado el usuario'
                            });
                        } else {
                            return res.status(200).send({
                                //ACUERDATE QUE TIENES MODIFICADO EL MODELO PARA QUE NO DEVUELVA LA PASSWORD
                                user: userStored
                            });
                        }
                    }
                });
            } else {
                return res.status(200).send({
                    message: 'Rellena todos los campos'
                });
            }
        });
    } else {
        return res.status(500).send({
            message: 'Introduce la contraseña'
        });
    }
}

function loginUser(req, res) {

    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            return res.status(500).send({
                err,
                message: 'Error en la peticion'
            });
        } else {
            if (!user) {
                return res.status(404).send({
                    message: 'El usuario no existe'
                });
            } else {
                //Comprobar la contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        //Devolver los datos del usuario logeado
                        if (params.gethash) {
                            //devolver un TOKEN DE JWT
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            return res.status(200).send({
                                //ACUERDATE QUE TIENES MODIFICADO EL MODELO PARA QUE NO DEVUELVA LA PASSWORD
                                user
                            });
                        }
                    } else {
                        return res.status(404).send({
                            message: 'El usuario no ha no podido logearse'
                        });
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
        if (err) {
            return res.status(500).send({
                err: err.errmsg,
                message: 'Error al actulizar el usuario'
            });
        } else {
            if (!userUpdated) {
                return res.status(404).send({
                    message: 'No se ha podido actulizar el usuario'
                });
            } else {
                return res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}

function uploadImg(req, res) {

    var userId = req.params.id;

    if (req.files) {

        var img = req.files.img;

        let nombreArc = img.name.split('.');
        let ext = nombreArc[nombreArc.length - 1];

        let extValidas = ['png', 'gif', 'jpg', 'jpeg', 'PNG', 'GIF', 'JPG', 'JPEG'];

        if (extValidas.indexOf(ext) < 0) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Solo se acepta ' + extValidas.join(', ')
                }
            });
        }

        let nombreArchivo = `${userId}-${new Date().getMilliseconds()}.${ext}`;

        img.mv(`uploads/users/${nombreArchivo}`, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            User.findByIdAndUpdate(userId, { img: nombreArchivo }, { new: true }, (err, userUpdated) => {
                if (!userUpdated) {
                    return res.status(404).send({
                        message: 'No se ha podido actulizar el usuario'
                    });
                } else {
                    return res.status(200).send({
                        user: userUpdated
                    });
                }
            });

        });

    } else {
        return res.status(500).send({
            message: 'No ha subido ninguna imagen...'
        });
    }
}


module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImg
};