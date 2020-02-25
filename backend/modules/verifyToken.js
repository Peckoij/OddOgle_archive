var jws = require("jws");
var jwt = require('jsonwebtoken');
var config = require('../modules/config.js');
var SECRET = config.jwtSecret;;


// Check signature and expire time, if both OK return success: true
exports.checkToken = function (token) {
    var tokenRes;
 //   console.log("Decode JWT");
    //decode token 
    var data = jws.decode(token); // decode token
    var result = jws.verify(token, data.header.alg, SECRET); //Verify signature with google's key/certificate
//    console.log("Signature ok? " + result);
    if (!result) { // if signature fails
        return tokenRes = {
            status: 401,
            success: false,
            msg: 'Signature failure!'
        }
    }

    var payload = data.payload; //JSON.parse(data.payload); //parse payload to JSON
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
    //console.log(payload);
    return tokenRes = {
        status: 200,
        success: true,
        msg: payload.userID
    }
} //*/
