const
    PAGE_ACCESS_TOKEN = "EAABwUGkFhW0BAJR6VsDmkYPnzDWu84rIIJNTfrJ50UZBMh2h0alNoFiuDLze1ZA6IVPNim0IVjUlx2NMnZC1erYaMV1nEqaN4NS0BEYYoCwphSiEe6YY0g0ZAVe64XsvZB76vopClyYkkh9ZCzzmFxoCqraBeQs1bXIhOF6EX0WwZDZD",
    request = require('request');

module.exports = {
    // Handles messages events
    handleMessage: function(sender_psid, received_message) {
        var response = { "text": "" };
        response.text = "Meow";

        respondWithMessage(sender_psid, response);
    },

    // Handles messaging_postbacks events
    handlePostback: function(sender_psid, received_postback) {

    },

    handleRead: function(sender_psid, received_read) {

    }
}

// Sends response messages via the Send API
var respondWithMessage = function(sender_psid, response) {
    let message = {
        "recipient": { "id": sender_psid },
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
