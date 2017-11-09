const
    PAGE_ACCESS_TOKEN = "EAABwUGkFhW0BAJR6VsDmkYPnzDWu84rIIJNTfrJ50UZBMh2h0alNoFiuDLze1ZA6IVPNim0IVjUlx2NMnZC1erYaMV1nEqaN4NS0BEYYoCwphSiEe6YY0g0ZAVe64XsvZB76vopClyYkkh9ZCzzmFxoCqraBeQs1bXIhOF6EX0WwZDZD",
    request = require('request');

module.exports = {
    getInfo: function(id, callback) {
        request({
            "uri": "https://graph.facebook.com/v2.6/" + id + "?fields=first_name,last_name,profile_pic",
            "qs": { "access_token": PAGE_ACCESS_TOKEN },
            "method": "GET"
        }, (err, json) => {
            if (err) {
              console.error("Unable to retrieve profile info: " + err);
          } else {
              callback(json);
          }
        });
    }
}
