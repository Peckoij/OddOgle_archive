var mongoose = require("mongoose");
var fs = require('fs');
//model require
var Pictures = mongoose.model("Pictures");
var User = mongoose.model("User");

//controller object for CRUD operations
var picturesController = {};
var verifyToken = require('../modules/verifyToken.js');
var userController = require('./UserController');
var mcache = require('memory-cache');
var fcm = require('../modules/FCM.js');




// Update score for specific picture
// params: score, picture _id
updateScore = function (score, id) {
    console.log("updating score for pic: " + id);

    Pictures.findByIdAndUpdate(id, {
            $set: {
                score: score
            }
        })
        .exec(function (err, result) {
            if (err) {
                console.log("Error:", err);
            } else {
                console.log("Pic score update done!");
                // console.log(result);
            }
        });
};

// list functions for different feeds
// shittiest pics
exports.listPoop = function (req, res, next) {
   // console.log("Get feed: poop");
    Pictures
        .find({
            haters: {
                $exists: true
            },
            $where: 'this.haters.length<4'
        })
        .sort({
            score: 1
        })
        .limit(20)
        .exec(function (err, picture) {
            if (err) {
                console.log("Error:", err);
            } else {
                var pics = handlePicList(picture);
                res.json(pics);
            }
        });

};

// Alltime favorite pics
exports.listBest = function (req, res, next) {
 //   console.log("Get feed: best");
    Pictures
        .find({
            haters: {
                $exists: true
            },
            $where: 'this.haters.length<4'
        })
        .sort({
            score: -1
        })
        .limit(20)
        .exec(function (err, picture) {
            if (err) {
                console.log("Error:", err);
            } else {
                var pics = handlePicList(picture);
                res.json(pics);
            }
        });
};

// Latest pictures
exports.listNewest = function (req, res, next) {
   // console.log("Get feed: newest"); // default case
    Pictures
        .find({
            haters: {
                $exists: true
            },
            $where: 'this.haters.length<4'
        })
        .sort({
            dateTime: -1
        })
        .limit(20)
        .exec(function (err, picture) {
            if (err) {
                console.log("Error:", err);
            } else {
                var pics = handlePicList(picture);
                res.json(pics);
            }
        });
};

// list pics taken by user
exports.listMyPics = function (req, res) {
   // console.log("Get feed: User " + req.params.user_id + " pics"); // default case
    Pictures
        .find({
            user: req.params.user_id
        })
        .sort({
            dateTime: -1
        })
        .limit(50)
        .exec(function (err, picture) {
            if (err) {
                console.log("Error:", err);
            } else {
                var pics = handlePicList(picture);
                res.json(pics);
            }
        });
};

// list pics commented by user, sort from newest
exports.listfollowedPics = function (req, res) {
  //  console.log("Get feed: User " + req.params.user_id + " commented pics"); // default case
    Pictures
        .find({
            'comments.user': req.params.user_id
        })
        .sort({
            "comments.dateTime":-1,
            dateTime: -1
            
        })
        .limit(50)
        .exec(function (err, picture) {
            if (err) {
                console.log("Error:", err);
            } else {
                var pics = handlePicList(picture);
                res.json(pics);
            }
        });
};

// ListMore & listNew only work properly if called after listNewest
exports.listMore = function (req, res, next) {
    Pictures
        .find({
            dateTime: {
                $lt: req.params.date
            },
            haters: {
                $exists: true
            },
            $where: 'this.haters.length<4'
        }).sort({
            dateTime: -1
        })
        .limit(14)
        .exec(function (err, picture) {
            if (err) {
                console.log("Error:", err);
            } else {
                var pics = handlePicList(picture);
                res.json(pics);
            }
        });
};
exports.listNew = function (req, res, next) {
    var date;
    date = req.params.date;
    Pictures
        .find({
            dateTime: {
                $gt: date
            },
            haters: {
                $exists: true
            },
            $where: 'this.haters.length<4'
        })
        .sort({
            dateTime: 1
        })
        .limit(14)
        .exec(function (err, picture) {
            if (err) {
                console.log("Error:", err);
            } else {
                var pics = handlePicList(picture);
                res.json(pics);
            }
        });
};

// check and update list got from db: check scores, add picture as base64 string, remove entries which don't have picture
function handlePicList(pics) {
    for (var i = 0; i < pics.length; i++) {
        // If pic doesn't have score or score is incorrect, calc and update it
        if (typeof pics[i].score === 'undefined' || pics[i].score != (score = pics[i].upvotes - pics[i].downvotes)) {
  //          console.log("trying to calc score");
            pics[i].score = score;
            this.updateScore(score, pics[i].id);
        }
        pics[i].fileName = pics[i].name;
        // change value of name attribute to base64 encoded picture
        try {
            pics[i].name = fs.readFileSync('./../pictures/' + pics[i].date + '/' + pics[i].name, 'utf8', (err, data) => {
                if (err) throw err;
                //console.log(data);
                return data;
            });
            // save pic as reqular jpeg file
            decodePic(pics[i].date, pics[i].fileName, pics[i].name);
            //  console.log(picture[i].name);
        } catch (err) {
            //console.log(err);
            // if error thrown, remove that picture from list
            console.log("Item removed from list.");
            pics.splice(i, 1);
            i--;
        }
    }
    return pics;
}

/// decodePic(picture.date, name, picture.name);
// Decode (or atleast try to) base64 encoded image to original binary form, and save to disk
function decodePic(date, name, base64Pic) {
    //console.log("Decoding Pic");
    fs.stat('./../pictures_JPEG/' + date + '/' + name, function (err, stat) {
        if (err == null) {
            //console.log('File exists, return');
            return;
        } else if (err.code == 'ENOENT') {
            //console.log('No decoded pic yet, proceed with decoding');
            var matches = base64Pic.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            var data = new Buffer(matches[2], 'base64');
            fs.mkdir('./../pictures_JPEG/' + date, function (err) {
                if (err) {
                    if (err.code === 'EEXIST') {

                    } else {
                        console.log("There was an error creating directory");
                        console.log(err);
                    }
                } else {
                    console.log("The directory was created for decoded pics date: " + date);
                }
                fs.writeFile('./../pictures_JPEG/' + date + '/' + name, data, function (err) {
                    if (err) {
                        if (err.code === 'EEXIST') {
                            //        console.log("Pic already decoded");
                        } else {
                            console.log("There was an error writing the image");
                            console.log(err);
                        }
                    } else {
                        // console.log("There file was written");
                    }
                });
            });
            // file does not exist, function ok to continue
        } else {
            console.log('Some other error: ', err.code);
            console.log('Might be good idea to try to proceed');
        }
    });
}


//show single picture by id, add stalker points for userID provided as second param
exports.show = function (req, res, next) {
    //  console.log(req.params);
    if (req.params.user_id != "Guest") {
        User.update({
            _id: req.params.user_id
        }, {
            $inc: {
                stalkerPoints: 5
            }
        }, function (err, res) {
            if (err) console.log(err);
            //console.log(res);
            //console.log("user opened pic: " + res._id);
        });
    }
    Pictures.findOne({
        _id: req.params.id
    }).exec(function (err, picture) {
        if (err) {
            console.log("Error:", err);
        } else {
            picture.fileName = picture.name;
            picture.name = fs.readFileSync('./../pictures/' + picture.date + '/' + picture.name, 'utf8', (err, data) => {
                if (err) throw err;
                //console.log(data);
                return data;
            }); //*/
            picture.ActivityStatus = "default.png";
            picture.ActivityStatus = globalUserActivityCache.get(picture.user);
            for (var i = 0; i < picture.comments.length; i++) {
                picture.comments[i].ActivityStatus = "default.png";
                picture.comments[i].ActivityStatus = globalUserActivityCache.get(picture.comments[i].user);
            }
            // userActivityCache.put(users[i].id, users[i].ActivityStatus+".png");
            res.json(picture);
        }
    });
};

//show single picture by id, add stalker points for userID provided as second param, send only data, NO PICTURE
exports.showJPEG = function (req, res, next) {
    //  console.log(req.params);
    if (req.params.user_id != "Guest") {
        User.update({
            _id: req.params.user_id
        }, {
            $inc: {
                stalkerPoints: 5
            }
        }, function (err, res) {
            if (err) console.log(err);
            //console.log(res);
            //console.log("user opened pic: " + res._id);
        });
    }
    Pictures.findOne({
        _id: req.params.id
    }).exec(function (err, picture) {
        if (err) {
            console.log("Error:", err);
        } else {
            picture.fileName = picture.name;
            picture.ActivityStatus = "default.png";
            picture.ActivityStatus = globalUserActivityCache.get(picture.user);
            for (var i = 0; i < picture.comments.length; i++) {
                picture.comments[i].ActivityStatus = "default.png";
                picture.comments[i].ActivityStatus = globalUserActivityCache.get(picture.comments[i].user);
            }
            // userActivityCache.put(users[i].id, users[i].ActivityStatus+".png");
            res.json(picture);
        }
    });
};


//function: send single picture by pic id, old version does not need user name etc
exports.showDepricated = function (req, res, next) {
    Pictures.findOne({
        _id: req.params.id
    }).exec(function (err, picture) {
        if (err) {
            console.log("Error:", err);
        } else {
            picture.name = fs.readFileSync('./../pictures/' + picture.date + '/' + picture.name, 'utf8', (err, data) => {
                if (err) throw err;
                //console.log(data);
                return data;
            });
            picture.ActivityStatus = "default.png";
            picture.ActivityStatus = globalUserActivityCache.get(picture.user);
            for (var i = 0; i < picture.comments.length; i++) {
                picture.comments[i].ActivityStatus = "default.png";
                picture.comments[i].ActivityStatus = globalUserActivityCache.get(picture.comments[i].user);
            }
            res.json(picture);
        }
    });
};

// Lisää kuvan tiedot tietokantaan ja tallenna kuva levylle stringinä
exports.add = function (req, res, next) {
    var tokenRes = verifyToken.checkToken(req.body.token);
    console.log("Token is valid: " + tokenRes.success);
    // if token check fails send according error message
    if (!tokenRes.success) {
        return res.status(tokenRes.status).send({
            success: tokenRes.success,
            msg: tokenRes.msg
        });
    }

    // console.log(req);
    var picture = new Pictures;
    picture.link = " ";
    picture.name = req.body.name;
    picture.date = req.body.date;
    picture.title = req.body.title;
    picture.user = tokenRes.msg;
    fs.mkdir('./../pictures/' + req.body.date, function (err) {
        if (err) {
            if (err.code === 'EEXIST') {

            } else {
                console.log("There was an error creating directory");
                console.log(err);
            }
        } else {
            console.log("There directory was created")
        }
        fs.writeFile('./../pictures/' + req.body.date + '/' + req.body.name, req.body.pic, function (err) {
            if (err) {
                console.log("There was an error writing the image");
                console.log(err);
            } else {
                // console.log("There file was written");
            }
        });
    });

    // save pic as reqular jpeg file
    decodePic(picture.date, picture.name, req.body.pic);

    Pictures.create(picture, function (err, picture) {
        if (err) {
            return next(err)
        }
        res.json(picture);
    }).then((res) => {
        //      console.log(req.body.user);
        User.update({
            _id: tokenRes.msg
        }, {
            $inc: {
                points: 10,
                photoPoints: 150,
                xp: 10,
                picCount: 1
            }
        }).then(function (raw, err) {
            if (err) {
                console.log("There was an error while adding points to user: " + tokenRes.msg);
                console.log(err);
            }
            // console.log("Pic added!!!! " + res._id);
            // console.log("Points to user: " + tokenRes.msg);
            //        console.log(err);
            //         console.log(raw);
        });
    });
};

// add comment to picture
exports.addComment = function (req, res, next) {
    var tokenRes = verifyToken.checkToken(req.body.token);
    console.log("Token is valid: " + tokenRes.success);
    // if token check fails send according error message
    if (!tokenRes.success) {
        return res.status(tokenRes.status).send({
            success: tokenRes.success,
            msg: tokenRes.msg
        });
    }

    var length = req.body.comment.length;
    console.log("comment length: " + length);
    //console.log(req.body.curLongestComment);
    console.log("Current longest comment " + req.body.curLongestComment);
    if (length > req.body.curLongestComment) {
        console.log("New longer comment: " + length);
        User.update({
            _id: tokenRes.msg
        }, {
            $set: {
                "longestComment": length
            }
        }).then(function (resu, err) {
            if (err) {
                console.log("There was an error while setting longest comment for user: " + tokenRes.msg);
                console.log(err);
            }
        });
    }
    var cPoints;
    var aAPoints;
    var aCPoints;
    var xp = 1;
    // how many points user gets from comment
    switch (true) {
        case length <= 10:
            cPoints = 1;
            aAPoints = 0;
            aCPoints = 30;
            xp = 1;
            break;
        case length <= 25:
            cPoints = 3;
            aAPoints = 0;
            aCPoints = 30;
            xp = 2;
            break;
        case length <= 50:
            cPoints = 5;
            aAPoints = 30;
            aCPoints = 30;
            xp = 3;
            break;
        case length <= 100:
            cPoints = 10;
            aAPoints = 60;
            aCPoints = 30;
            xp = 5;
            break;
        case length <= 200:
            cPoints = 15;
            aAPoints = 90;
            aCPoints = 30;
            xp = 8;
            break;
        case length <= 300:
            cPoints = 20;
            aAPoints = 150;
            aCPoints = 30;
            xp = 10;
            break;
        case length > 300:
            cPoints = 20;
            aAPoints = 200;
            aCPoints = 30;
            xp = 12;
            break;
    }
    console.log("Points: " + cPoints);

    Pictures.findByIdAndUpdate(req.body.id, {
        $push: {
            comments: {
                comment: req.body.comment,
                upvoters: [],
                downvoters: [],
                upvotes: 0,
                downvotes: 0,
                user: tokenRes.msg
            }
        }
    }, {
        upsert: true,
        'new': true
    }).exec((err, raw) => { //pisteet käyttäjälle toiminnasta
        console.log("Comment saved succesfully!");
        // raw contains data for picture document including all userId, needed for notifications
        //sendNotificationsNewComments(raw);
        setTimeout(sendNotificationsNewComments, 10000, raw);
        //       console.log(err);
        //       console.log(raw);
        User.update({
            _id: tokenRes.msg
        }, {
            $inc: {
                "points": cPoints,
                "chattyPoints": aCPoints,
                "authorPoints": aAPoints,
                "xp": xp,
                "commentCount": 1
                //  "longestComment":lengthIncrease
            }
        }).then(function (resu, err) {
            if (err) console.log(err);
            console.log("ALL DONE!!!!");;
            //            console.log(resu);
        });
        if (err) throw err;
        return res.status(200).send({
            success: true,
            msg: 'Comment added!!'
        });
    });
};

function sendNotificationsNewComments(data) {
    var usersDone = [];
    var commenterTokens = [];
//    console.log("Sending notifications to users...");
//    console.log(data);
    getDeviceToken(data.user, "newComments");
    // Send notification to pic taker
    usersDone.push(data.user);
    console.log(usersDone);
    var tokenRes = getDeviceToken(data.user, "newComments")
        .then(result => {
        //    console.log("result out:");
        //    console.log(result);
            if (result) {
        //        console.log("pic id: " + data._id);

                fcm.sendNotificationToUser(
                    result, // device token
                    "New comment", // Message title
                    "in your picture", // Message body
                    {
                        pic_id: data._id
                    }
                );
            }
        });

    for (var i = 0; i < data.comments.length; i++) {
        if (usersDone.indexOf(data.comments[i].user) === -1) {
            usersDone.push(data.comments[i].user);
            // send notification to each unique commenter, if permissions ok
            getDeviceToken(data.comments[i].user, "newFollowed")
                .then(result => {
                //    console.log("result out:");
                //    console.log(result);
                    if (result) {
                //        console.log("pic id: " + data._id);
                        fcm.sendNotificationToUser(
                            result, // device token
                            "New comment", // Message title
                            "in picture you have commented", // Message body
                            {
                                pic_id: data._id
                            }
                        );
                    }
                });
            console.log("token");
        }
    }
}

// returns token if permissions ok
// false if user doesn't want notification
function getDeviceToken(userID, type) {
    return User.findOne({
        _id: userID
    }).then(function (res, err) {
        if (err) {
            console.log("Error:", err);
        } else {
            // console.log(res);
            // console.log(res[type]);
            if (res[type]) {
                //     console.log("Return fcm token");
                //     console.log( res.fcmToken);
                return res.fcmToken
            } else {
            //    console.log("Notif not wanted")
                return false;
            }
        }
    })
    .catch(err =>{
        console.log("Error:", err);
    });
}

exports.votePic = function (req, res, next) {
    var tokenRes = verifyToken.checkToken(req.body.token);
    //console.log("Token is valid: " + tokenRes.success);
    // if token check fails send according error message
    if (!tokenRes.success) {
        return res.status(tokenRes.status).send({
            success: tokenRes.success,
            msg: tokenRes.msg
        });
    }

    // Increase score chnage in case user has already voted other option and changes his mind
    var scoreChange = 1;
    var voters = 1;
    var antiVoters = 0;
    if (req.body.reVoter) {
        scoreChange = 2;
        voters = 1;
        antiVoters = -1;
    }

    //	console.log(req.body.type);
    //	console.log(req.params.id);
    //	console.log(req.body.userID);
    if (req.body.type === "up") {
        User.update({
            _id: tokenRes.msg
        }, {
            $inc: {
                "loverPoints": 13
            }
        }).then(function (err, raw) {
        //    console.log("Points added from vote, to user: " + tokenRes.msg);
        });

        //	console.log("update votes");
        return Pictures.update({
            _id: req.params.id
        }, {
            $push: {
                "upvoters": tokenRes.msg
            },
            $pull: {
                "downvoters": tokenRes.msg
            },
            $inc: {
                downvotes: antiVoters,
                upvotes: voters,
                score: scoreChange
            }
        }, {
            upsert: true
        }).exec(function (err, raw) {
            if (err) throw err;
            if (raw) {
              //  console.log("upvote added for pic");
                return res.status(200).send({
                    success: true,
                    msg: 'Vote added!!'
                });
            }
        });
    } else if (req.body.type === "down") {
    //    console.log("update votes");
        User.update({
            _id: tokenRes.msg
        }, {
            $inc: {
                "haterPoints": 13
            }
        }).then(function (err, raw) {
      //      console.log("Points added from vote, to user: " + tokenRes.msg);
        });


        Pictures.update({
            _id: req.params.id
        }, {
            $push: {
                "downvoters": tokenRes.msg
            },
            $pull: {
                "upvoters": tokenRes.msg
            },
            $inc: {
                downvotes: voters,
                upvotes: antiVoters,
                score: -scoreChange
            }
        }, {
            upsert: true
        }).exec(function (err, raw) {
            if (err) throw err;
            if (raw) {
            //    console.log("downvote added for pic");
                return res.status(200).send({
                    success: true,
                    msg: 'Vote added!!'
                });
            }
        });
    } else {
    //    console.log("Some stuff went wrong..")
    }

}

exports.voteComment = function (req, res, next) {
    var tokenRes = verifyToken.checkToken(req.body.token);
//    console.log("Token is valid: " + tokenRes.success);
    // if token check fails send according error message
    if (!tokenRes.success) {
        return res.status(tokenRes.status).send({
            success: tokenRes.success,
            msg: tokenRes.msg
        });
    }

    // Increase score chnage in case user has already voted other option and changes his mind
    var scoreChange = 1;
    var voters = 1;
    var antiVoters = 0;
    if (req.body.reVoter) {
        scoreChange = 2;
        voters = 1;
        antiVoters = -1;
    }

    //	console.log(req.body.type);
    //	console.log(req.params.id);
    //  console.log(req.body.picId);
    //  console.log(req.body.userID);
    if (req.body.type === "up") {
        User.update({
            _id: tokenRes.msg
        }, {
            $inc: {
                "loverPoints": 13
            }
        }).then(function (err, raw) {
        //    console.log("Points added from vote, to user: " + tokenRes.msg);
        });

        Pictures.update({
            _id: req.body.picId,
            "comments._id": req.params.id
        }, {
            $inc: {
                "comments.$.downvotes": antiVoters,
                "comments.$.upvotes": voters,
                "comments.$.score": -scoreChange,
            },
            $push: {
                "comments.$.upvoters": tokenRes.msg
            },
            $pull: {
                "comments.$.downvoters": tokenRes.msg
            },

        }, {
            upsert: true
        }).exec(function (err, raw) {
            if (err) throw err;
            if (raw) {
            //    console.log("upvote added for comment");
            ///    console.log("Points added from vote, to user: " + tokenRes.msg);
                return res.status(200).send({
                    success: true,
                    msg: 'Vote added!!'
                });
            }
        });
    } else if (req.body.type === "down") {
        User.update({
            _id: tokenRes.msg
        }, {
            $inc: {
                "haterPoints": 13
            }
        }).then(function (err, raw) {
         //   console.log("Points added from vote, to user: " + tokenRes.msg);
        });

        Pictures.update({
            _id: req.body.picId,
            "comments._id": req.params.id
        }, {
            $inc: {
                "comments.$.downvotes": voters,
                "comments.$.upvotes": antiVoters,
                "comments.$.score": -scoreChange,
            },
            $push: {
                "comments.$.downvoters": tokenRes.msg
            },
            $pull: {
                "comments.$.upvoters": tokenRes.msg
            },
        }, {
            upsert: true
        }).exec(function (err, raw) {
            if (err) throw err;
            if (raw) {
            //    console.log("downvote added for comment");
            //    console.log("Points added from vote, to user: " + tokenRes.msg);
                return res.status(200).send({
                    success: true,
                    msg: 'Vote added!!'
                });
            }
        });
    } else {
    //    console.log("Some stuff went wrong..")
    }
}

exports.reportPic = function (req, res, next) {
    //	console.log(req.body.type);
    //	console.log(req.params.id);
    //	console.log(req.body.userID);
    //	console.log("update votes");
    return Pictures.update({
        _id: req.body.picId
    }, {
        $push: {
            "haters": req.body.userID,
            "reasonToHate": req.body.reason
        }
    }, {
        upsert: true
    }).exec(function (err, result) {
        if (err) throw err;
        if (result) {
            console.log(new Date().toISOString() + " -- Picture: " + req.body.picId + " reported with reason: " + req.body.reason);
            //console.log(result)
            return res.status(200).send({
                success: true,
                msg: 'Picture reported succefully.'
            });
        }
    });
}


//module.exports = picturesController;