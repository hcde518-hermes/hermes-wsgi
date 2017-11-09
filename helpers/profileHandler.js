const
    config = require('../config.json'),
    cache = require('./cache.js'),
    accessToken = config.accessToken,
    request = require('request');

module.exports = {
    getInfo: function(id, callback) {
        cache.profileForId(id, (profile) => {
            if (profile) {
                callback(profile);
            } else {
                request({
                    "uri": "https://graph.facebook.com/v2.6/" + id + "?fields=first_name,last_name,profile_pic",
                    "qs": { "access_token": accessToken },
                    "method": "GET"
                }, (err, res, body) => {
                    if (err) {
                      console.error("Unable to retrieve profile info: " + err);
                  } else {
                      let profile = JSON.parse(body);
                      cache.storeProfile(id, profile);
                      callback(profile);
                  }
                });
            }
        });
    }
}
