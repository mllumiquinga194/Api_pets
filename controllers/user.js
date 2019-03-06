'use strict'

var User = require('../models/user');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function saveUser(req, res) {

    var user = new User();
    var params = req.body;

    user.nombre = params.nombre;
    user.apellido = params.apellido;
    user.email = params.email.toLowerCase().replace(/ /g, "");
    user.tlf = params.tlf;
    user.state = params.state;
    user.ciudad = params.ciudad;
    user.img = 'noneUser.jpg';
    user.role = 'USER_ROLE';

    if (params.password) {
        //encriptar password
        user.password = bcrypt.hashSync(params.password, 10);
        if (user.nombre != null && user.apellido != null && user.email != null) {
            //Guardar usuario
            user.save( {new : true}, (err, userStored) => {
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
                            user: userStored,
                        });
                    }
                }
            });
        } else {
            return res.status(200).send({
                message: 'Rellena todos los campos'
            });
        }
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
        }
        if (!user) {
            return res.status(404).send({
                message: 'El usuario no existe'
            });
        } else {
            //Comprobar la contraseña
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario o (Contraseña) Incorrecto'
                    }
                });
            } else {
                return res.json({
                    ok: true,
                    usuario: params,
                    token: jwt.createToken(user)
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

            User.findByIdAndUpdate(userId, { img: nombreArchivo, new: true }, (err, userUpdated) => {
                if (!userUpdated) {
                    return res.status(404).send({
                        message: 'No se ha podido actulizar el usuario'
                    });
                } else {
                    borrarArchivo(userUpdated.img);
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

function borrarArchivo(nombreImagen) {

    let pathImagen = path.resolve(__dirname, `../uploads/users/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

function getImageFile(req, res) {

    var imageFile = req.params.imageFile; //recogo el parametro que me va a llegar por url. que sera el nombre del fichero que yo quiero sacar por la base de datos

    if (!imageFile) {
        imageFile = 'noneUser.jpg';
    }

    var pathImagen = path.resolve(__dirname, `../uploads/users/${imageFile}`);

    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
    } else {
        return res.status(200).send({
            message: 'No existe la imagen...'
        });
    }

}

function deleteUser(req, res) {

    let userId = req.params.id;
    let estado = req.body.estado;

    //este es un borrado logico, que lo que hace es cambiar el estado a false para que no sea mostrado. ya las condiciones estan dadas para que cuando tenga el estado false, no me lo muestre (busque) ni me lo cuente!!
    let cambioEstado = {
        estado
    }

    User.findByIdAndUpdate(userId, cambioEstado, { new: true }, (err, userBorradoLogico) => { //{new: true} es una opcion que le mando para especificar que me devuelva el usuario actualizado y no el usuario sin actualizar
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            if (!userBorradoLogico) {
                res.json({
                    ok: false,
                    message: 'No existe el usuario'
                });
            } else {
                res.json({
                    ok: true,
                    message: 'cambio de estado',
                    usuario: userBorradoLogico
                });
            }
        }
    });

    //este borrado es fisilo, la cual si elimina directamente de la base de datos
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }else {
    //         if(!usuarioBorrado){
    //             res.json({
    //                 ok: false,
    //                 message: 'No existe el usuario'
    //             });
    //         }else {

    //             res.json({
    //                 ok: true,
    //                 usuario: usuarioBorrado
    //             });
    //         }
    //     }
    // });
}

//req lo que va a recibir en la peticion y res lo que va a devolver
function getUsers(req, res) {

    var userId = req.params.id;

    if (!userId) {
        //sacar todos los usuarios de la base de datos
        var find = User.find({ estado: true }).sort('name');
    } else {
        //sacar un usuario nada mas.
        var find = User.find({
            _id: userId
        }).sort('name');
    }

    find.exec((err, users) => {
        if (err) {
            return res.status(500).send({
                err,
                message: 'Error en la peticion'
            });
        } else {
            if (!users) {
                return res.status(404).send({
                    message: 'No hay usuarios...'
                });
            } else {
                return res.status(200).send({
                    users
                });
            }
        }
    });
}


module.exports = {
    saveUser,
    loginUser,
    updateUser,
    uploadImg,
    getImageFile,
    deleteUser,
    getUsers
};