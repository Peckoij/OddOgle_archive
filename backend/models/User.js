var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    userID:         { type: String, unique:true, required:true},
    points:          { type: Number, default: '0'},
    level:          { type: Number, default: '0', min: '0'},
    xp:             { type: Number, default: '0', min: '0'},
    // Activity statuses
    stalkerPoints:  { type: Number, default: '0', min: 0},    // activityStatus string: stalker
    chattyPoints:   { type: Number, default: '0', min: 0},    // activityStatus string: chatty
    photoPoints:    { type: Number, default: '0', min: 0},    // activityStatus string: photo
    authorPoints:   { type: Number, default: '0', min: 0},    // activityStatus string: author
    loverPoints:    { type: Number, default: '0', min: 0},     // activityStatus string: lover
    haterPoints:    { type: Number, default: '0', min: 0},     // activityStatus string: hater
    // Current activity status
    ActivityStatus: { type: String, default: 'default'},        // activityStatus string: default (if none other matches)
    // other statistics
    picCount:       { type: Number, default: '0'},
    commentCount:   { type: Number, default: '0'},
    longestComment: { type: Number, default: '0'},
    lastLogin:      { type: Date, default: Date.now },
    // titles user has unlocked
    titles:	        { type:[String], default: ["What is this?","Awesome!","Gross!"]},
    // oddBucks balance and history of changes to verify balance if needed
    oddBucksBalance: { type: Number, default: '0' },
    oddBucksHistory: [{
        event:          String,
        change:         Number,
        balanceAfter:   Number,
        dateTime:   { type: Date, default: Date.now}
    }],
    // FCM Token etc
    fcmToken:       { type:[String], default: []},
    // fcmPermissions:
    newComments: { type: Boolean, default: false}, // new comments on own picture
    newFollowed: { type: Boolean, default: false}, // new comment after my comment
});

var collectionName = "googleUser";
module.exports = mongoose.model('User', UserSchema, collectionName);