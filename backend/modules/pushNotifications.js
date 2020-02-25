var FCM = require('fcm-node');
    var serverKey = 'AAAAS1VoLsE:APA91bF-Ljtwwq2GUtJyOJYJlp9mUiy2eKt1PY67UANpFRvvQYUhrSPDQR8ETfixJzVKnKjvGUGRdndNO0zMd7wdJw3DRaUNW8eQkX_Hk0L5EXFudAq0bi5AVLhBCJqDm6jPm7xv-_Rd'; //put your server key here
    var fcm = new FCM(serverKey);
 
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'registration_token', 
        collapse_key: 'your_collapse_key',
        
        notification: {
            title: 'Title of your push notification', 
            body: 'Body of your push notification' 
        },
        
        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });