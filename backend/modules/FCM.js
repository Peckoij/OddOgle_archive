var gcm = require('node-gcm');

// var serverKey = require('path/to/privatekey.json') //put the generated private key path here    
var sender = new gcm.Sender("AAAAS1VoLsE:APA91bGVxdH7Ob1NLl3lVuJh8hf9HH_4j3e-8Ro99KszN3KpEhBxX-1jtKLF8XmkT1korKNJPsboQWkQZMKeVQeipGa431ZSEL0faiaRV3p7S4s4WIvj9MjgQyq8SaletL-R-h0mFq8o");

/*
// Message format
var message = new gcm.Message({
    notification: {
    title: "Hellou!",
    icon: "ic_stat_keep_ogling_icon",
    body: "This is the message."
    },
});
   */

// Specify which registration IDs to deliver the message to
var regTokens = ['ewvmDqUXqck:APA91bHA-YjEt5py59cfz8mj-igd0BI5ZyRf3TxZFXAvzpwRap_v7hts1RWa_wZOP_CCaRWIIFUf1-3fp0uzZ0hM55wCmG8BDsmXzZLIwT_mwfA7Ka2mg1aTD3kg1fk3B4rj2aNyFq7K'];

// userTokens: device tokens to send message 1 - 1000
// msgTitle: title for notification
// msgBody: text/message of notifiaction
/* data: for example picture id to open format: 
data:{
    key1: value1,
    key2: value2
}
//*/
exports.sendNotificationToUser = function (userTokens, msgTitle, msgBody, data, optIcon, optColor) {
    // optional params, if not given uses default values
    if (optIcon === undefined) optIcon = "oddogle_ring_icon"; 
    if (optColor === undefined) optColor = '#3c2a70';

    console.log("Messaage Color: "+optColor);
    console.log("Messaage optIcon: "+optIcon);
    // Prepare a message to be sent
    var message = new gcm.Message({
        notification: {
            title: msgTitle,
            body: msgBody,
            icon: optIcon,
            color: optColor
        },
        data: data,

    });
    console.log(message);
    
    // send message
    sender.send(message, {
        registrationTokens: userTokens
    }, function (err, response) {
        if (err) console.error(err);
        else {
            console.log("Success: ");
            console.log(response);
        }
    });
}
