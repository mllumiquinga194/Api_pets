'use strict'

var Pet = require('../models/pet');
var fs = require('fs');
var path = require('path');

function savePets(req, res){

    var params = req.body;

    var pet = new Pet({
        nombre: params.nombre,
        img: 'nonePet.jpg',
        descripcion: params.descripcion,
        duenio: params.duenio
    });

    pet.save((err, petStored) => {
        if(err){
            return res.status(500).send({
                err,
                message: 'Error en el servidor'
            });
        }else{
            if(!petStored){
                return res.status(404).send({
                    message: 'No se ha guardado album'
                });
            }else{
                return res.status(200).send({
                    pet: petStored
                });
            }
        }
    });
}

function getPet(req, res) {
    var petId = req.params.id;

    Pet.findById(petId).populate({
        path: 'duenio' //aqui se van a cargar los datos del objeto asociado a la propiedad 'artist'. como tenemos un objeto guardado dentro de artista, utilizando populate, nos va a cargar un objeto completo del tipo artista. de esta forma logramos obtener todos los artistas que han creado un album cuyo ID es el que ya tenemos guardado
    }).exec((err, pet) =>{
        if(err){
            return res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!pet){
                return res.status(404).send({
                    message: 'La mascota no existe'
                });
            }else{
                return res.status(200).send({
                    pet
                });
            }
        }
    });
}

function getPets(req, res) {
    var duenioId = req.params.id;

    if(!duenioId){
        //sacar todos los album de la base de datos
        var find = Pet.find({estado: true}).sort('nombre');
    }else{
        //sacar los albums de un artista concreto de la base de datos
        var find = Pet.find({
            estado: true,
            duenio: duenioId
        }).sort('name');
    }

    find.populate({
        path: 'duenio'
    }).exec((err, pets) => {
        if(err){
            return res.status(500).send({
                err,
                message: 'Error en la peticion'
            });
        }else{
            if(!pets){
                return res.status(404).send({
                    message: 'No hay Mascotas...'
                });
            }else{
                return res.status(200).send({
                    pets
                });
            }
        }
    });
}

function updatePet(req, res) {
    var petId = req.params.id;
    var update = req.body;

    Pet.findByIdAndUpdate(petId, update, { new: true }, (err, petUpdated) => {
        if(err){
            return res.status(500).send({
                err,
                message: 'Error en el servidor'
            });
        }else{
            if(!petUpdated){
                return res.status(404).send({
                    message: 'No se ha actulizado la mascota...'
                });
            }else{
                return res.status(200).send({
                    pet: petUpdated
                });
            }
        }
    });
}

function uploadImg(req, res) {

    var petId = req.params.id;

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

        let nombreArchivo = `${petId}-${new Date().getMilliseconds()}.${ext}`;

        img.mv(`uploads/pets/${nombreArchivo}`, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Pet.findByIdAndUpdate(petId, { img: nombreArchivo }, (err, petUpdated) => {
                if (!petUpdated) {
                    return res.status(404).send({
                        message: 'No se ha podido actulizar el usuario'
                    });
                } else {
                    borrarArchivo(petUpdated.img);
                    return res.status(200).send({
                        pet: petUpdated
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

    let pathImagen = path.resolve(__dirname, `../uploads/pets/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

function getImageFile(req, res) {

    var imageFile = req.params.imageFile; //recogo el parametro que me va a llegar por url. que sera el nombre del fichero que yo quiero sacar por la base de datos

    if (!imageFile) {
        imageFile = 'nonePet.jpg';
    }

    var pathImagen = path.resolve(__dirname, `../uploads/pets/${imageFile}`);

    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
    } else {
        return res.status(200).send({
            message: 'No existe la imagen...'
        });
    }

}

function deletePet(req, res) {

    let petId = req.params.id;
    let estado = req.body.estado;

    //este es un borrado logico, que lo que hace es cambiar el estado a false para que no sea mostrado. ya las condiciones estan dadas para que cuando tenga el estado false, no me lo muestre (busque) ni me lo cuente!!
    let cambioEstado = {
        estado
    }

    Pet.findByIdAndUpdate(petId, cambioEstado, { new: true }, (err, petBorradoLogico) => { //{new: true} es una opcion que le mando para especificar que me devuelva el usuario actualizado y no el usuario sin actualizar
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            if (!petBorradoLogico) {
                res.json({
                    ok: false,
                    message: 'No existe la mascota'
                });
            } else {
                res.json({
                    ok: true,
                    message: 'cambio de estado',
                    pet: petBorradoLogico
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

module.exports = {
    savePets,
    getPet,
    getPets,
    updatePet,
    uploadImg,
    getImageFile,
    deletePet
}
