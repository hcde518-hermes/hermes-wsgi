const
    config = require('./config.json'),
    accessToken = config.accessToken,
    request = require('request'),
    profileHandler = require('./helpers/profileHandler.js');

module.exports = {
    handleMessage: function(senderId, message) {
        var response = { "text": "" };

        if (message.nlp && message.nlp.entities) {
            let greeting = firstEntityForType(message.nlp, 'greetings');
            if (greeting) {
                profileHandler.getInfo(senderId, (user) => {
                    console.log(user);
                    response.text = "Hi " + user.first_name + "!";
                    respondWithMessage(senderId, response);
                });
            } else {
                response.text = "😒";
                respondWithMessage(senderId, response);
            }
            console.log(message.nlp.entities);
        }
    },

    handlePostback: function(senderId, postback) {

    },

    handleRead: function(senderId, read) {

    }
}

var firstEntityForType = function(nlp, type) {
    let entities = entitiesForType(nlp, type);
    return entities && entities[0];
}

var entitiesForType = function(nlp, type) {
    return nlp && nlp.entities && nlp.entities && nlp.entities[type]
}

var respondWithMessage = function(recipientId, response) {
    let message = {
        "recipient": { "id": recipientId },
        "message": response
    }

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": accessToken },
        "method": "POST",
        "json": message
    }, (err, res, body) => {
        if (err) {
          console.error("Unable to send message:" + err);
        }
    });
}
