var express = require('express');
var mongoose = require('mongoose');
var app = module.exports = express.Router();

var picture = require("../controllers/PicturesController");
/*var picturee = require("../models/Pictures");*/

// routes to CRUD functions

// get X pictures
app.get('/pictures/default', picture.listNewest);
app.get('/pictures/poop', picture.listPoop);
app.get('/pictures/best', picture.listBest);
app.get('/pictures/myPics&:user_id', picture.listMyPics);
app.get('/pictures/followedPics&:user_id', picture.listfollowedPics);
// get pictures posted after 1st of X
app.get('/pictures/new/:date', picture.listNew);
// get pictures posted before last of X
app.get('/pictures/more/:date', picture.listMore);

//get single picture data by id 
app.get('/picture/:id&:user_id', picture.show);
app.get('/picture/JPEG/:id&:user_id', picture.showJPEG);
app.get('/picture/:id', picture.showDepricated); // old function, still there incase someone is using old version

// Post new picture
app.post('/postPicture', picture.add);
// Add comment to picture
app.put('/postComment', picture.addComment);
// Vote stuff
app.put('/pictures/vote/:id', picture.votePic);
app.put('/comments/vote/:id', picture.voteComment);
app.post('/pictures/report', picture.reportPic);


module.exports = app;