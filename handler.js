module.exports = {
    // Handles messages events
    handleMessage: function(sender_psid, received_message) {
        var response { "text": "" };
        response.text = "Meow";

        respondWithMessage(sender_psid, response);
    }

    // Handles messaging_postbacks events
    handlePostback: function(sender_psid, received_postback) {

    }

    handleRead: function(sender_psid, received_read) {

    }

    // Sends response messages via the Send API
    respondWithMessage: function(sender_psid, response) {
        let message = {
            "recipient": { "id": sender_psid },
            "message": response
        }

        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (err) {
              console.error("Unable to send message:" + err);
            }
        });
    }
}
