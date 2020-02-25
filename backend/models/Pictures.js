var mongoose = require('mongoose');

var PicturesSchema = new mongoose.Schema({
	link:		String,
	name:		String,
	fileName: 	String,
	date:		String,
	dateTime:	{ type: Date, default: Date.now },
	title:		String,
	user:		String,
	upvotes:	{ type:Number, default:0},
	upvoters:	{ type:[String], default: []},
	downvotes:	{ type:Number, default:0},
	downvoters: { type:[String], default: []},
	haters: 	{ type:[String], default: []},
	reasonToHate:{ type:[String], default: []},
	score: 		{type: Number, default:0},
	ActivityStatus: String,
	comments:	[
		{
			user:		String,
			comment: 	String,
			upvotes:	{ type:Number, default:0},
			upvoters:	{ type:[String], default: []},
			downvotes:	{ type:Number, default:0},
			downvoters: { type:[String], default: []},
			ActivityStatus: String,
			dateTime:	{ type: Date, default: Date.now },
		}
	], 
	ad:			Boolean 
});
var collectionName = "pictures"
module.exports = mongoose.model('Pictures', PicturesSchema, collectionName);