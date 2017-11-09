const
    jsonfile = require('jsonfile'),
    cacheFileLocation = './cache.json';

var cacheObject = []

module.exports = {
    profileForId: function(id, callback) {
        let profiles = objectForKey("profiles");
        if (profiles) {
            callback(profiles[id]);
        } else {
            callback(null);
        }
    },
    storeProfile: function(id, profile) {
        let profiles = objectForKey("profiles");
        if (profiles) {
            profiles[id] = profile;
        } else {
            profiles = {id: profile};
        }
        storeObject(profiles);
    }
}

var objectForKey = function(key) {
    if (cacheObject == []) {
        cacheObject = jsonfile.readFileSync(cacheFileLocation);
    }
    return cacheObject[key];
}

var storeObject = function(key, value) {
    cacheObject[key] = value;
    jsonfile.writeFile(cacheFileLocation, cacheObject, function (err) {
        console.error(err);
    });
}
