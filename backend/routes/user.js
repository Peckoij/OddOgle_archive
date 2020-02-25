var express = require('express');
var app = module.exports = express.Router();
//var mongoose = require('mongoose')
//var jwt = require('express-jwt');
var user = require("../controllers/UserController");


// routes to CRUD functions
var user = require("../controllers/UserController");

app.post('/authUser', user.authGoogleUser);
app.post('/getUser', user.getUser);
app.post('/token', user.refreshToken);
app.put('/updateFCMToken', user.updateFCMToken);
app.post('/toggleNotificationType', user.toggleNotificationType);
module.exports = app;
