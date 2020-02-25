var mongoose = require('mongoose');
var User = mongoose.model("User");
var User = require('../models/User');
var jws = require("jws")
var request = require('request');
var jwt = require('jsonwebtoken');
var randtoken = require('rand-token');
var mcache = require('memory-cache');
var verifyToken = require('../modules/verifyToken.js');
var fcm = require('../modules/FCM.js');
var config = require('../modules/config.js');

var refreshTokens = {};
var SECRET = config.jwtSecret;
var tokenExpireTime = 15 * 60; // token expire time in seconds

// How often user ActivityStatuses are updated (in ms)
var userActivityStatusTimeout = 12 * 60 * 60 * 1000; // h*60mins*60s*1000ms

//controller object for CRUD operations
var userController = {};

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


var googleOauthKeysURL = "https://www.googleapis.com/oauth2/v1/certs";
var googleCert;
refreshCerts();
// Function to automaticly refresh google openid certificates
function refreshCerts() {
    console.log(new Date().toISOString() + " -- Refreshing google auth certificates...");
    request(googleOauthKeysURL, function (err, res, body) {
        //console.log(res.headers);
        googleCert = JSON.parse(body);
        //console.log(googleCert);
        var cacheControl = res.headers['cache-control'];
        var values = cacheControl.split(',');
        var maxAge = parseInt(values[1].split('=')[1]);
        //console.log(maxAge);
        // update the key cache when the max age expires
        setTimeout(refreshCerts, maxAge * 1000);
        console.log(new Date().toISOString() + " -- Google authentication certificates refreshed!");

    });
}

// verify google id_token
function checkGoogleIDToken(token) {
    var tokenRes;
    //   console.log("Decode google JWT");
    //decode token 
    var data = jws.decode(token); // decode token
    var certificate = data.header.kid;
    //console.log(certificate);
    //console.log(googleCert[certificate]);
    var result = jws.verify(token, 'RS256', googleCert[certificate]); //Verify signature with google's key/certificate
    //   console.log("Signature ok? " + result);
    if (!result) { // if signature fails
        return tokenRes = {
            status: 401,
            success: false,
            msg: 'Signature failure!'
        }
    }

    var payload = JSON.parse(data.payload); //parse payload to JSON
    // expire time check:
    var curTime = Date.now() / 1000;
    if (payload.exp <= curTime) {
        console.log("Token expired!");
        return tokenRes = {
            status: 401,
            success: false,
            msg: "Token expired"
        }
    }
    // iss Check:
    if (!(payload.iss != "https://accounts.google.com") && !(payload.iss != "accounts.google.com")) {
        console.log("ISS FAILURE!");
        return tokenRes = {
            status: 401,
            success: false,
            msg: 'iss failure!'
        }
    }
    // check app client id 
    if (payload.aud == "323555438273-s6v7hjv7nn260sraj2d8vi5lesqhjen6.apps.googleusercontent.com") {
        //    console.log("Client OK!");
        //console.log(payload);
        return tokenRes = {
            status: 200,
            success: true,
            msg: payload.sub
        }

    } else {
        console.log("unauthorised cliend id");
        return tokenRes = {
            status: 401,
            success: false,
            msg: 'unauthorised cliend'
        }
    }
} //*/

// Authenticate using google id_token
exports.authGoogleUser = function (req, res) {
    // check token validity
    var tokenRes = checkGoogleIDToken(req.body.id_token);
    var token = req.body.id_token;
    //   console.log(tokenRes.success);
    if (!tokenRes.success) {
        return res.status(tokenRes.status).send({
            success: tokenRes.success,
            msg: tokenRes.msg
        });
    }
    var id = tokenRes.msg;
    //var tUser = new User;
    console.log("Get data for user: " + id);
    User.findOne({
        userID: id
    }).exec(function (err, user) {
        if (err) console.log(err);
        if (user) { // if there is user with given ID, send data to user
            console.log("User data found for user: " + user._id);
            var nUser = createUserJSON(user);
            //console.log(nUser);
            // Update latest login time
            User.update({
                _id: nUser.userID
            }, {
                $inc: {
                    "xp": 3
                },
                $set: {
                    'lastLogin': new Date().toISOString()
                }
            }).then(function (err, raw) {
                console.log("XP added from authenticated login to user: " + nUser.userID);
            });
            //res.json(nUser);
            var jwToken = jwt.sign({
                userID: user._id
            }, SECRET, {
                expiresIn: tokenExpireTime
            });
            var refreshToken = randtoken.uid(256);
            refreshTokens[refreshToken] = user._id;
            //var data = jws.decode(jwToken);
            //console.log(refreshTokens);
            res.json({
                token: jwToken,
                refreshToken: refreshToken,
                data: nUser
            });


        } else { // no user for id -> create new user with id
            console.log("No user found, trying to create new.");
            var newUser = new User();
            newUser.userID = id;
            // console.log(newUser);
            User.create(newUser, function (err, user) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log("User created with id: " + user._id);
                var nUser = createUserJSON(user);
                //console.log(nUser);
                //res.json(nUser);
                var token = jwt.sign({
                    userID: user._id
                }, SECRET, {
                    expiresIn: tokenExpireTime
                });
                var refreshToken = randtoken.uid(256);
                refreshTokens[refreshToken] = user._id;
                res.json({
                    token: token,
                    refreshToken: refreshToken,
                    data: nUser
                });
            });
        }
        //console.log(tUser);
    });
}; // */

// get user data from db and send it to user 
exports.getUser = function (req, res) {
    var tokenRes = verifyToken.checkToken(req.body.token);
    // console.log("Token is valid: " + tokenRes.success);
    // if token check fails send according error message
    if (!tokenRes.success) {
        return res.status(tokenRes.status).send({
            success: tokenRes.success,
            msg: tokenRes.msg
        });
    }
    User.findOne({
        _id: tokenRes.msg
    }).exec(function (err, user) {
        if (err) throw err;
        if (user) {
            // User found and needed data is saved to local variable
            var nUser = createUserJSON(user);
            res.json(nUser);
        }
    });
};
// */

// remove unneccessary data from user json and check if user can lvl up
function createUserJSON(user) {
    var nUser = {
        userID: user._id,
        ActivityStatus: user.ActivityStatus + ".png",
        //  authorPoints: 0,
        //  photoPoints: 0,
        //  chattyPoints: 0,
        //  stalkerPoints: 0,
        xp: user.xp,
        level: user.level,
        oddBucksBalance: user.oddBucksBalance,
        points: user.points,
        commentCount: user.commentCount,
        picCount: user.picCount,
        longestComment: user.longestComment,
        titles: user.titles,
        fcmPermissions: {
            newComments: user.newComments
        }
    }
    // xp needed for lvl up
    var xpReq = Math.round(10 * (Math.pow(1 + (user.level / 10), 2)));

    // if users xp is not integer, round and set it to be in db
    if (user.xp % 1 !== 0) {
        console.log("User Xp not integer, rounding it.")
        // use rounded number for rest of function
        nUser.xp = Math.round(user.xp);
        User.update({
            _id: user._id
        }, {
            $set: {
                xp: nUser.xp
            }
        }, function (err, res) {
            if (err) console.log(err);
            console.log(res);
        });
    }
    // test for lvlv up
    if (nUser.xp >= xpReq) {
        console.log("Level up userr: " + user._id);
        User.update({
            _id: user._id
        }, {
            $inc: {
                level: 1,
                xp: -xpReq

            }
        }, function (err, res) {
            if (err) console.log(err);
            //console.log(res);
            //console.log("user opened pic: " + res._id);
        });
        nUser.level = nUser.level + 1;
        nUser.xp = nUser.xp - xpReq
        //   console.log(user.level);
        //   console.log(user.xp);
    }
    return nUser;
}

exports.refreshToken = function (req, res) {
    //console.log(refreshTokens);
    var data = jws.decode(req.body.token);
    console.log("Refress token for user: " + data.payload.userID)
    //  console.log(refreshTokens[req.body.refreshToken]);
    //  console.log(data.payload.userID);

    //var userId = data.userID;

    var refreshToken = req.body.refreshToken
    if ((req.body.refreshToken in refreshTokens) && (refreshTokens[req.body.refreshToken] == data.payload.userID)) {
        var user = {
            userID: data.payload.userID
        }
        var token = jwt.sign(user, SECRET, {
            expiresIn: tokenExpireTime
        });
        User.update({
            _id: data.payload.userID
        }, {
            $inc: {
                "xp": 3
            },
            $set: {
                'lastLogin': new Date().toISOString()
            }
        }).then(function (err, raw) {
            console.log("XP added from token refresh, to user: " + data.payload.userID);
        });

        res.json({
            token: token
        })
    } else {
        res.sendStatus(401);
    }
}
// */

exports.updateFCMToken = function (req, res) {
    var tokenRes = verifyToken.checkToken(req.body.token);
    console.log("Token is valid: " + tokenRes.success);
    // if token check fails send according error message
    if (!tokenRes.success) {
        return res.status(tokenRes.status).send({
            success: tokenRes.success,
            msg: tokenRes.msg
        });
    }
    console.log("Update FCM token for user: " + tokenRes.msg)
    //  console.log(refreshTokens[req.body.refreshToken]);
    //  console.log(data.payload.userID);

    //var userId = data.userID;
    User.update({
        _id: tokenRes.msg
    }, {
        $addToSet: {
            "fcmToken": req.body.deviceToken
        }
    }).then(function (raw, err) {
        if (err) console.log(err);
        // if (raw) console.log(raw);
        console.log("User " + tokenRes.msg + " FCM token added succesfully.");

        return res.status(200).send({
            success: true,
            msg: 'FCM token added.',
            deviceToken: req.body.deviceToken

        });
    });
}

exports.toggleNotificationType = function (req, res) {
    var tokenRes = verifyToken.checkToken(req.body.token);
    console.log("Token is valid: " + tokenRes.success);
    // if token check fails send according error message
    if (!tokenRes.success) {
        return res.status(tokenRes.status).send({
            success: tokenRes.success,
            msg: tokenRes.msg
        });
    }
    console.log("Update FCM setting for user: " + tokenRes.msg)
    //  console.log(refreshTokens[req.body.refreshToken]);
    //  console.log(data.payload.userID);
    //var userId = data.userID;
    User.update({
        _id: tokenRes.msg
    }, {
        $set: {
            [req.body.type]: req.body.value
        }
    }).then(function (raw, err) {
        if (err) console.log(err);
        if (raw) console.log(raw);
        console.log("User " + tokenRes.msg + " FCM permissions changed succesfully succesfully.");

        return res.status(200).send({
            success: true,
            msg: 'FCM permissions changed.',
            type: req.body.type,
            value: req.body.value
        });
    });
}


global.globalUserActivityCache = new mcache.Cache();
//exports.userActivityCache;
// Keep User 'profile pics' in cache to  
/*
function refreshUserActivityCache(){
    User.find({}).sort({
        points: -1
    }).exec(function (err, users) {
   //     userActivityCache.clear();
        if (err) {
            console.log("Error:", err);
        } else {
            for (var i = 0; i < users.length;i++){
               // console.log(users[i].id + " has status "+users[i].ActivityStatus);
                userActivityCache.put(users[i].id, users[i].ActivityStatus);
            }
             console.log("User activity cache updated.  " + new Date() );
            // console.log(userActivityCache.exportJson());
        }
    });
}
// */


updateUserActivityStatuses();
// Update activity status for every user, run hourly or so
function updateUserActivityStatuses() {
    var time = new Date();
    console.log(time.toISOString() + " -- User activity cache update started. ");
    User.find({}).sort({
        points: -1
    }).exec(function (err, users) {
        //     userActivityCache.clear();
        if (err) {
            console.log("Error: ", err);
        } else {
            //     console.log(users);
            for (var i = 0; i < users.length; i++) {
                var points = [{
                        status: "hater",
                        score: users[i].haterPoints
                    },
                    {
                        status: 'lover',
                        score: users[i].loverPoints
                    },
                    {
                        status: 'author',
                        score: users[i].authorPoints
                    },
                    {
                        status: 'photo',
                        score: users[i].photoPoints
                    },
                    {
                        status: 'chatty',
                        score: users[i].chattyPoints
                    },
                    {
                        status: 'stalker',
                        score: users[i].stalkerPoints
                    }
                ];
                var aScore = 0;
                var aStatus = users[i].ActivityStatus;
                for (var n = 0; n < points.length; n++) {
                    if (points[n].score >= 250 && points[n].score > aScore) {
                        aScore = points[n].score;
                        aStatus = points[n].status;
                    }
                }
                users[i].stalkerPoints = users[i].stalkerPoints / 10
                users[i].chattyPoints = users[i].chattyPoints / 10
                users[i].photoPoints = users[i].photoPoints / 10
                users[i].authorPoints = users[i].authorPoints / 10
                users[i].loverPoints = users[i].loverPoints / 10
                users[i].haterPoints = users[i].haterPoints / 10
                if(users[i].stalkerPoints<1) users[i].stalkerPoints=0;
                if(users[i].chattyPoints<1) users[i].chattyPoints=0;
                if(users[i].photoPoints<1) users[i].photoPoints=0;
                if(users[i].authorPoints<1) users[i].authorPoints=0;
                if(users[i].loverPoints<1) users[i].loverPoints=0;
                if(users[i].haterPoints<1) users[i].haterPoints=0;

                // if(aStatus != users[i].ActivityStatus){
                User.findByIdAndUpdate(users[i]._id, {
                    $set: {
                        ActivityStatus: aStatus,
                        stalkerPoints: users[i].stalkerPoints, // activityStatus string: stalker
                        chattyPoints: users[i].chattyPoints, // activityStatus string: chatty
                        photoPoints: users[i].photoPoints, // activityStatus string: photo
                        authorPoints: users[i].authorPoints, // activityStatus string: author
                        loverPoints: users[i].loverPoints, // activityStatus string: lover
                        haterPoints: users[i].haterPoints
                    }
                }).exec(function (err, res) {
                    if (err) console.log(err);
                    //    console.log(res);
                    //  console.log("Activity status updated, for user: " + res._id);
                });
                //}
                // put userID and correct activityStatus to cache
                // console.log(users[i].id + " has status "+users[i].ActivityStatus); //  users[i].ActivityStatus
                globalUserActivityCache.put(users[i].id, aStatus + ".png");
            }
            var memUsage = globalUserActivityCache.memsize();
            var time2 = new Date();
            console.log(time2.toISOString() + " -- User activity cache updated. Entries in cache: " + memUsage + ", duration: " + (time2 - time) + " ms");
            //console.log("Update took " + (time2-time) +" ms");
            // console.log(userActivityCache.exportJson());
        }
    });

    //refreshUserActivityCache();
    setTimeout(updateUserActivityStatuses, userActivityStatusTimeout);
}



/* // list all users
exports.list = function (req, res, next) {
    User.find({}).sort({
        points: -1
    }).exec(function (err, user) {
        if (err) {
            console.log("Error:", err);
        } else {
            var nUser = [];
            for (var i = 0; i < user.length;i++){
            nUser.push({
                userID: user[i].userID, 
                points: user[i].points,

            });
            }
            // console.log(nUser);
            res.json(nUser);
        }
    });
};
// */

/*
exports.add = function (req, res, next) {
    var goodToGo = true;
    var user = new User();
    // Tarkista onko userID varattu
    User.findOne({
        userID: req.body.userID
    }).exec(function (err, user) {
        if (err) throw err;
        if (user && goodToGo) {
            goodToGo = false;
            console.log("userID taken");
            return res.status(409).send({
                success: false,
                msg: 'userID not available!'
            });
        }
    });
    // Tarkista onko s-posti osoitteella jo tili
    User.findOne({
        email: req.body.email
    }).exec(function (err, user) {
        if (err) throw err;
        if (user && goodToGo) {
            goodToGo = false;
            console.log("email taken");
            return res.status(409).send({
                success: false,
                msg: 'Email already in use'
            });
        }
    });
    // jos kumpikaan yllä ei aiheuta virhettä luodaan uusi käyttäjä annetuilla tiedoilla
    bcrypt.genSalt(10, function (err, salt) {
        // user.salt = salt;
        //console.log('gen salt!');
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) {
                return next(err);
            }
            //console.log('gen hash!');
            //console.log(hash);
            user.password = hash;
            console.log(user.password);
            //console.log("was there pw?");
            User.create(user, function (err, user) {
                if (err) {
                    return next(err)
                }
                console.log("User created with name: " + user.userID)
                return res.status(201).send({
                    success: true,
                    msg: ("User created with name: " + user.userID)
                });
                res.json(user);
            });
        });
    });

    user.termsAccepted = req.body.termsAccepted;
    user.points = 0;
    user.age = req.body.age; // poista tastausvaiheen jälkeen
    user.gender = req.body.gender; // poista tastausvaiheen jälkeen
    user.email = req.body.email; // poista tastausvaiheen jälkeen
    user.userID = req.body.userID;

};
// */

/*
exports.authenticate = function (req, res) {
    User.findOne({
        userID: req.body.userID
    }).exec(function (err, user) {
        if (err) throw err;
        if (!user) {
            return res.status(403).send({
                success: false,
                msg: 'User not found.'
            });
        } else {
            //   console.log(req.body.password);
            //   console.log(user.password);
            bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
                if (err) {
                    return cb(err);
                } else if (isMatch && !err) {
                    console.log("Password match!!")
                    var nUser = new User;
                    nUser.userID = user.userID;
                    nUser.points = user.points;
                    // nUser.age = user.age;
                    // nUser.gender = user.gender;
                    // nUser.email = user.email;
                    var token = jwt.encode(nUser, config.secret);
                    res.json({
                        success: true,
                        token: token
                    });
                } else {
                    return res.status(403).send({
                        success: false,
                        msg: 'Wrong password.'
                    });
                }
            });
        }
    })
};
// */