const
    PAGE_ACCESS_TOKEN = "EAABwUGkFhW0BAJR6VsDmkYPnzDWu84rIIJNTfrJ50UZBMh2h0alNoFiuDLze1ZA6IVPNim0IVjUlx2NMnZC1erYaMV1nEqaN4NS0BEYYoCwphSiEe6YY0g0ZAVe64XsvZB76vopClyYkkh9ZCzzmFxoCqraBeQs1bXIhOF6EX0WwZDZD",
    request = require('request'),
    profileHandler = require('./helpers/profileHandler.js');

module.exports = {
    handleMessage: function(sender, message) {
        var response = { "text": "" };

        if (message.nlp && message.nlp.entities) {
            let greeting = firstEntityForType(message.nlp, 'greetings');
            if (greeting) {
                profileHandler.getInfo(sender.id, (user) => {
                    console.log(user);
                    response.text = "Hi " + user.first_name + " !";
                    respondWithMessage(sender, response);
                });
            } else {
                response.text = "😒";
                respondWithMessage(sender, response);
            }
            console.log(sender);
            console.log(message.nlp.entities);
        }
    },

    handlePostback: function(sender, postback) {

    },

    handleRead: function(sender, read) {

    }
}

var firstEntityForType = function(nlp, type) {
    let entities = entitiesForType(nlp, type);
    return entities && entities[0];
}

var entitiesForType = function(nlp, type) {
    return nlp && nlp.entities && nlp.entities && nlp.entities[type]
}

var respondWithMessage = function(recipient, response) {
    let message = {
        "recipient": { "id": recipient.id },
        "message": response
    }

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": message
    }, (err, res, body) => {
        if (err) {
          console.error("Unable to send message:" + err);
        }
    });
}
