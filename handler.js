const
    config = require('./config.json'),
    accessToken = config.accessToken,
    request = require('request'),
    cache = require('./helpers/cache.js'),
    profileHandler = require('./helpers/profileHandler.js'),
    userDefinedDeletion = "kUserDefinedDeletion";

module.exports = {
    handleMessage: function(senderId, message) {
        var response = {};

        if (message.nlp && message.nlp.entities) {
            let greeting = firstEntityForType(message.nlp, 'greetings');
            if (message.text == "reboot") {
                response = {
                    "attachment":{
                      "type":"template",
                      "payload":{
                        "template_type":"button",
                        "text":"Are you sure?",
                        "buttons":[
                            {
                              "type": "postback",
                              "title": "Yes",
                              "payload": userDefinedDeletion
                            }
                        ]
                      }
                    }
                }
                respondWithMessage(senderId, response);
            }
            else if (greeting && greeting.confidence > 0.8) {
                profileHandler.getInfo(senderId, (fbProfile) => {
                    console.log(fbProfile);
                    response.text = "Hi " + fbProfile.first_name + "!";
                    respondWithMessage(senderId, response);
                    cache.getUserProfile(senderId, (userProfile) => {
                        setTimeout(function() {
                            if (!userProfile) {
                                response.text = "I'm Hermes, your magical yet digital scheduling friend"
                                respondWithMessage(senderId, response);
                                setTimeout(function() {
                                    response.text = "Let me know if you'd like to get started, or just wanna know more about what I do"
                                    respondWithMessage(senderId, response);
                                }, 2000);
                            } else {

                            }
                        }, 500);
                    })
                });
            }
            else {
                response.text = "😒";
                respondWithMessage(senderId, response);
            }
            console.log(message.nlp.entities);
        }
    },

    handlePostback: function(senderId, postback) {
        var response = { "text": "" };
        if (postback.payload == userDefinedDeletion) {
            cache.reboot();
            response.text = "POOF! Data was reset ☑️";
            respondWithMessage(senderId, response);
        }
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
