'use strict'

var express = require('express');
var PetController = require('../controllers/pet');

var api = express.Router();// Para poder crear Rutas
var md_auth = require('../middlewares/authenticated');

var fileUpload = require('express-fileupload');
var md_upload = fileUpload();


api.post('/registrar-mascota', md_auth.ensureAuth, PetController.savePets);
api.get('/obtener-mascotas/:id?', md_auth.ensureAuth, PetController.getPets);
api.get('/obtener-mascota/:id', md_auth.ensureAuth, PetController.getPet);
api.put('/actualizar-mascota/:id', md_auth.ensureAuth, PetController.updatePet);
api.post('/upload-image-pet/:id', [md_auth.ensureAuth, md_upload], PetController.uploadImg);
api.get('/get-image-pet/:imageFile?', PetController.getImageFile);
api.delete('/delete-pet/:id', md_auth.ensureAuth, PetController.deletePet);


module.exports = api;