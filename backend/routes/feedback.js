var express = require('express');
var mongoose = require('mongoose');
var app = module.exports = express.Router();

var feedback = require("../controllers/FeedbackController");


app.get('/feedback', feedback.listfeedback);
app.post('/feedback', feedback.addfeedback);




module.exports = app;