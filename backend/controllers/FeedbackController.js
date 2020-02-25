var mongoose = require("mongoose");

//model require
var Feedback = mongoose.model("Feedback");

//controller object for CRUD operations
var feedbackController = {};


exports.listfeedback = function(req, res, next) {
    Feedback.find({}).sort({_id:-1}).exec(function (err, feedback){
        if (err) {
            console.log("Error:", err);
        } else {
           res.json(feedback);
        }
    });
};

exports.addfeedback = function(req, res,next) {
    /* var Pictures = new Pictures({
         content: req.body.content
     })*/
     console.log("Some user wrote new feedback!");
	 console.log(req.body);
     Feedback.create(req.body, function(err, feedback) {
         if (err) {
             return next(err)
         }
         res.json(feedback);
     })    
 
 };
 