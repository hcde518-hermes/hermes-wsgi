const
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    cacheFileLocation = './tmp/cache.json';

var cacheObject;

module.exports = {
    getFbProfile: function(id, callback) {
        let profiles = getObject("profiles");
        if (profiles) { callback(profiles[id]); }
        else { callback(null); }
    },
    storeFbProfile: function(id, profile) {
        let profiles = getObject("profiles");
        if (profiles) { profiles[id] = profile; }
        else { profiles = { id: profile }; }
        storeObject("profiles", profiles);
    },
    getUserProfile: function(id, callback) {
        let users = getObject("users");
        if (users) { callback(users[id]); }
        else { callback(null); }
    },
    storeUserProfile: function(id, user) {
        let users = getObject("users");
        if (users) { users[id] = user; }
        else { users = { id: user }; }
    },
    reboot: function() {
        cacheObject = {};
        jsonfile.writeFileSync(cacheFileLocation, {});
    }
}

var getObject = function(key) {
    if (!cacheObject) {
        try { cacheObject = jsonfile.readFileSync(cacheFileLocation); }
        catch(e) {
            if (!fs.existsSync('./tmp')){ fs.mkdirSync('./tmp'); }
            jsonfile.writeFileSync(cacheFileLocation, {});
        }

        if (!cacheObject) { cacheObject = {}; }
    }
    return cacheObject[key];
}

var storeObject = function(key, value) {
    cacheObject[key] = value;
    jsonfile.writeFile(cacheFileLocation, cacheObject, function (err) {
        if (err) { console.error(err); }
    });
}
