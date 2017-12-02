const
    config = require('./config.json'),
    accessToken = config.accessToken,
    request = require('request'),
    cache = require('./helpers/cache.js'),
    profileHandler = require('./helpers/profileHandler.js'),
    userDefinedDeletion = "kUserDefinedDeletion",
    showMore = "kShowMore";
    swapBack = "kSwapBack";
    addPoints = "kAddPoints";
    neverMind = "kNeverMind";
    pointBack = "kPointBack";
    takeShift = "kTakeShift";

var
    isSurging = false;

module.exports = {
    handleMessage: function(senderId, message) {
        var response = {};

        console.log(message);
        if (message.nlp && message.nlp.entities) {
            let greeting = firstEntityForType(message.nlp, 'greetings');
            let intent = firstEntityForType(message.nlp, 'intent');
            let dateTime = firstEntityForType(message.nlp, 'datetime');
            let thanks = firstEntityForType(message.nlp, 'thanks');
            let bye = firstEntityForType(message.nlp, 'bye');
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
            else if (message.text == "surge staff") {
                surgeStaff();
            }
            else if (thanks && thanks.confidence > 0.8) {
                response.text = "You're welcome! 😃";
                respondWithMessage(senderId, response);
            }
            else if (thanks && thanks.confidence > 0.8) {
                response.text = "Have a great day! 👋";
                respondWithMessage(senderId, response);
            }
            else if (greeting && greeting.confidence > 0.8) {
                profileHandler.getInfo(senderId, (fbProfile) => {
                    console.log(fbProfile);
                    var profiles = cache.allUsers();
                    if (false) {
                        response.text = "Hi " + fbProfile.first_name + "!";
                    } else {
                        response.text = "Hi " + fbProfile.first_name + ", welcome to the team. You can talk to me to ask for information, shift requests, and more!";

                        setTimeout(function() {
                            response.text = "Every time you respond to my message, you already get 1 point! You can offer your points to encourage coworkers to pick up your shifts or use them to buy rewards.";
                            response.quick_replies = [
                              {
                                "content_type":"text",
                                "title":"Show me my shifts"
                              },
                              {
                                "content_type":"text",
                                "title":"How many points do I have?"
                              },
                              {
                                "content_type":"text",
                                "title":"Can I swap a shift?"
                                },
                                {
                                  "content_type":"text",
                                  "title":"meow"
                                }
                            ]
                            respondWithMessage(senderId, response);
                        }, 1000);
                    }

                    respondWithMessage(senderId, response);
                });
            }
            else if (intent && intent.confidence > 0.8) {
                if (intent.value == "showShift") {
                    response = {
                        "attachment":{
                          "type":"template",
                          "payload":{
                            "template_type":"list",
                            "top_element_style":"LARGE",
                            "elements": [
                                {
                                    "title": "MOD Pizza",
                                    "subtitle": "University Ave",
                                    "image_url": "http://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/uploads/2016/03/modpizzaext2014promo_0.jpg?itok=eelbyPNS"
                                },
                                {
                                    "title": "Saturday",
                                    "subtitle": "7:00AM-5:00PM"
                                },
                                {
                                    "title": "Monday",
                                    "subtitle": "7:00AM-5:00PM"
                                },
                                {
                                    "title": "Tuesday",
                                    "subtitle": "7:00AM-5:00PM"
                                }
                            ],
                            "buttons": [
                                {
                                  "type": "postback",
                                  "title": "Show more...",
                                  "payload": showMore
                                }
                            ]
                          }
                        }
                    }
                    respondWithMessage(senderId, response);
                }
                else if (intent.value == "swapShift") {
                    if (dateTime && dateTime.confidence > 0.8) {
                        initiateSwap(senderId)
                    } else {
                        response.text = "Which shift would you like to swap?";
                        respondWithMessage(senderId, response);
                        setTimeout(function() {
                            response = {
                                "attachment":{
                                  "type":"template",
                                  "payload":{
                                    "template_type":"list",
                                    "top_element_style":"LARGE",
                                    "elements": [
                                        {
                                            "title": "MOD Pizza",
                                            "subtitle": "University Ave",
                                            "image_url": "http://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/uploads/2016/03/modpizzaext2014promo_0.jpg?itok=eelbyPNS"
                                        },
                                        {
                                            "title": "Saturday",
                                            "subtitle": "7:00AM-5:00PM",
                                            "buttons": [
                                                {
                                                  "type": "postback",
                                                  "title": "Swap Saturday",
                                                  "payload": swapBack
                                                }
                                            ]
                                        },
                                        {
                                            "title": "Monday",
                                            "subtitle": "7:00AM-5:00PM",
                                            "buttons": [
                                                {
                                                  "type": "postback",
                                                  "title": "Swap Monday",
                                                  "payload": swapBack
                                                }
                                            ]
                                        },
                                        {
                                            "title": "Tuesday",
                                            "subtitle": "7:00AM-5:00PM",
                                            "buttons": [
                                                {
                                                  "type": "postback",
                                                  "title": "Swap Tuesday",
                                                  "payload": swapBack
                                                }
                                            ]
                                        }
                                    ],
                                    "buttons": [
                                        {
                                          "type": "postback",
                                          "title": "Show more...",
                                          "payload": showMore
                                        }
                                    ]
                                  }
                                }
                            }
                            respondWithMessage(senderId, response);
                        }, 1000);
                    }
                }
                else if (intent.value == "viewPoints") {
                    response.text = "You have 190 points";
                    respondWithMessage(senderId, response);
                }
                else if (intent.value == "pointsToNextLevel") {
                    response.text = "You have 190 points, only 10 away from Level 2";
                    respondWithMessage(senderId, response);
                }
                else if (intent.value == "askOLS") {
                    if (isSurging) {
                        response.text = "You are able to take this shift, as long as you are paid 1.5x the usual rate and are not scheduled for a shift tomorrow morning.";
                    } else {
                        response.text = "Office of Labor Standards [about text]";
                    }

                    respondWithMessage(senderId, response);
                }
                else if (intent.value == "8-Ball") {
                    response.text = "That's up to you.";
                    respondWithMessage(senderId, response);
                }
                else if (intent.value == "showRewards") {
                    response = {
                        "attachment":{
                          "type":"template",
                          "payload":{
                            "template_type":"generic",
                            "elements": [

                                     {
                                      "title":"Free Meal",
                                      "subtitle":"10 Points",
                                      "image_url":"http://www.emoji.co.uk/files/emoji-one/food-drink-emoji-one/1632-pot-of-food.png"
                                  },
                                     {
                                      "title":"$5 Gift Card",
                                      "subtitle":"5 Points",
                                      "image_url":"https://thecryobar.com/wp-content/uploads/2017/05/giftcard.png"
                                  },
                                     {
                                      "title":"1 Bottle of Wine",
                                      "subtitle":"20 Points",
                                      "image_url":"https://emojipedia-us.s3.amazonaws.com/thumbs/120/emoji-one/104/wine-glass_1f377.png"
                                  },
                                     {
                                      "title":"1 Vacation Day",
                                      "subtitle":"100 Points",
                                      "image_url":"http://www.emoji.co.uk/files/emoji-one/travel-places-emoji-one/1801-beach-with-umbrella.png"
                                     }
                                  ]
                              }
                            }
                        };
                        respondWithMessage(senderId, response);
                        setTimeout(function() {
                            response = { "text": "Here are your options" };
                            respondWithMessage(senderId, response);
                        }, 1000);
                    }

                else if (intent.value == "help") {
                    response.text = "Sorry, this functionality hasn't been implemented yet."
                    respondWithMessage(senderId, response);
                }
                else if (intent.value == "mischief") {
                    response = {
                        "attachment": {
                            "type": "image",
                            "payload": {
                                "url": "https://i.pinimg.com/736x/74/c8/e7/74c8e715f884aa7aa084f3e07449f70b.jpg",
                                "is_reusable": true
                            }
                        }
                    };
                    respondWithMessage(senderId, response);
                    setTimeout(function() {
                        response = { "text": "nom nom nom" };
                        respondWithMessage(senderId, response);
                    }, 1000);
                }
                else if (intent.value == "sad") {
                    response.text = "What's wrong?";
                    respondWithMessage(senderId, response);
                }
            }
            else {
                response.text = "Sorry, I'm not sure how to help with that.";
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
        else if (postback.payload == showMore) {
            response.text = "Sorry, I don't have any more shifts to show"
            respondWithMessage(senderId, response);
        }
        else if (postback.payload == swapBack) {
            initiateSwap(senderId)
        }
        else if (postback.payload == addPoints) {
            response = {
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"button",
                    "text":"How many points would you like to use?",
                    "buttons":[
                        {
                          "type": "postback",
                          "title": "5 Points",
                          "payload": pointBack + " 5"
                        },
                        {
                          "type": "postback",
                          "title": "10 Points",
                          "payload": pointBack + " 10"
                        },
                        {
                          "type": "postback",
                          "title": "15 Points",
                          "payload": pointBack + " 15"
                        }
                    ]
                  }
                }
            }
            respondWithMessage(senderId, response);
            setTimeout(function() {
                response = {"text": "By the way, you have 190 points to use."}
                respondWithMessage(senderId, response);
            }, 1000);
        }
        else if (postback.payload.indexOf(pointBack) > -1) {
            var amount = parseInt(postback.payload.match(/\d/g));
            response.text = "OK! I've updated your offer!"
            respondWithMessage(senderId, response);
            setTimeout(function() {
                response.text = "Looks like Sandy accepted!";
                respondWithMessage(senderId, response);
                setTimeout(function() {
                    response = {
                        "attachment":{
                          "type":"template",
                          "payload":{
                            "template_type":"list",
                            "top_element_style":"LARGE",
                            "elements": [
                                {
                                    "title": "MOD Pizza",
                                    "subtitle": "University Ave",
                                    "image_url": "http://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/uploads/2016/03/modpizzaext2014promo_0.jpg?itok=eelbyPNS"
                                },
                                {
                                    "title": "Saturday",
                                    "subtitle": "FREE",
                                }
                            ]
                        }
                    }
                }
                respondWithMessage(senderId, response);
            }, 1000);
            setTimeout(function() {
                response.text = "By the way, you have " + (190-amount).toString() + "points left";
                respondWithMessage(senderId, response);
            }, 2000);
            }, 2000);
        }
        else if (postback.payload == takeShift) {
            response.text = "Awesome! I'll let the manager know"
            respondWithMessage(senderId, response);
            setTimeout(function() {
                response = {
                    "attachment":{
                      "type":"template",
                      "payload":{
                        "template_type":"list",
                        "top_element_style":"LARGE",
                        "elements": [
                            {
                                "title": "MOD Pizza",
                                "subtitle": "University Ave",
                                "image_url": "http://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/uploads/2016/03/modpizzaext2014promo_0.jpg?itok=eelbyPNS"
                            },
                            {
                                "title": "Friday",
                                "subtitle": "5:00PM-10:00PM",
                            }
                        ]
                        }
                    }
                }
                respondWithMessage(senderId, response);

                setTimeout(function() {
                    response = {"text": "You also now have 200 points! Welcome to Level 2"};
                    respondWithMessage(senderId, response);
                    setTimeout(function() {
                        response = {
                            "attachment": {
                                "type": "image",
                                "payload": {
                                    "url": "https://i.pinimg.com/originals/31/f1/7d/31f17d37aad1b028590bb5ea0ba6df20.jpg",
                                    "is_reusable": true
                                }
                            }
                        }
                        respondWithMessage(senderId, response);
                    })
                }, 1000);
            }, 1000);
        }
        else if (postback.payload == neverMind) {
            response.text = "OK! Just let me know if there's anything else you need"
            respondWithMessage(senderId, response);
        }
    },

    handleRead: function(senderId, read) {

    }
}

var surgeStaff = function() {
    var profiles = cache.allUsers()
    for (profile in profiles) {
        var response = {
            "attachment":{
              "type":"template",
              "payload":{
                "template_type":"button",
                "text":"Hi, looks like MOD Pizza is really busy tonight. Your manager is offering a reward of 20 points if you'd like to come in",
                "buttons":[
                    {
                      "type": "postback",
                      "title": "Sure",
                      "payload": takeShift
                    },
                    {
                        "type": "postback",
                        "title": "No thanks",
                        "payload": neverMind
                    }
                ]
              }
            }
        }
        respondWithMessage(profile, response);
        isSurging = true;
        setTimeout(function() {
            isSurging = false;
        }, 5000);
    }
}

var initiateSwap = function(senderId) {
    var response = { "text": "Alright, I'll ask the team" };
    respondWithMessage(senderId, response);
    setTimeout(function() {
        response.text = "(For the purposes of this test, pretend 24 hours have elapsed)";
        respondWithMessage(senderId, response);
    }, 2000);
    setTimeout(function() {
        profileHandler.getInfo(senderId, (fbProfile) => {
            response = {
                "attachment":{
                  "type":"template",
                  "payload":{
                    "template_type":"button",
                    "text":"Sorry " + fbProfile.first_name + ", looks like no one responded to your request. If you'd like, you can incentivize your offer with some points",
                    "buttons":[
                        {
                          "type": "postback",
                          "title": "Sure",
                          "payload": addPoints
                        },
                        {
                            "type": "postback",
                            "title": "No thanks",
                            "payload": neverMind
                        }
                    ]
                  }
                }
            }
            respondWithMessage(senderId, response);
        });
    }, 5000);
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
