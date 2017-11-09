const
    fs = require('fs'),
    jsonfile = require('jsonfile'),
    cacheFileLocation = './tmp/cache.json';

var cacheObject;

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
            profiles = { id: profile };
        }
        storeObject("profiles", profiles);
    }
}

var objectForKey = function(key) {
    if (!cacheObject) {
        try {
            cacheObject = jsonfile.readFileSync(cacheFileLocation);
        } catch(e) {
            fs.writeFile(cacheFileLocation, "{}", function(err) {
                if(err) { console.log(err); }
                console.log("Wrote new cache.json file");
            });
        }

        if (!cacheObject) {
            cacheObject = {};
        }
    }
    return cacheObject[key];
}

var storeObject = function(key, value) {
    cacheObject[key] = value;
    jsonfile.writeFile(cacheFileLocation, cacheObject, function (err) {
        if (err) {
            console.error(err);
        }
    });
}
