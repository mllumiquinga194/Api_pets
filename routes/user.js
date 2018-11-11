'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();// Para poder crear Rutas
var md_auth = require('../middlewares/authenticated');

var fileUpload = require('express-fileupload');
var md_upload = fileUpload();

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImg);

module.exports = api;