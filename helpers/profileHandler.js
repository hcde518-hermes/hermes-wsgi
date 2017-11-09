const
    config = require('../config.json'),
    accessToken = config.accessToken,
    request = require('request');

module.exports = {
    getInfo: function(id, callback) {
        request({
            "uri": "https://graph.facebook.com/v2.6/" + id + "?fields=first_name,last_name,profile_pic",
            "qs": { "access_token": accessToken },
            "method": "GET"
        }, (err, res, body) => {
            if (err) {
              console.error("Unable to retrieve profile info: " + err);
          } else {
              callback(JSON.parse(body));
          }
        });
    }
}
