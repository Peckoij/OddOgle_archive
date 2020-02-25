var mongoose = require('mongoose');

var FeedbackSchema = new mongoose.Schema({
	text:		String,
	user: 		String,
	userID: 	String
	
	
	

});
var collectionName = "feedback"
module.exports = mongoose.model('Feedback', FeedbackSchema, collectionName);