'use strict';

const
  express = require('express'),
  bodyParser = require('body-parser'),
  handler = require('./handler.js'),
  app = express().use(bodyParser.json());

app.listen(process.env.PORT || 8080, () => console.log('webhook is listening'));

app.post('/fbhook', (req, res) => {

  let body = req.body;

  if (body.object === 'page') {
    res.status(200).send('EVENT_RECEIVED');
    body.entry.forEach(function(entry) {
      let webhookEvent = entry.messaging[0];
      let senderId = webhookEvent.sender.id;

      if (webhookEvent.message) {
          handler.handleMessage(senderId, webhookEvent.message);
      } else if (webhookEvent.postback) {
          handler.handlePostback(senderId, webhookEvent.postback);
      } else if (webhookEvent.read) {
          handler.handleRead(senderId, webhookEvent.read);
      }
    });
  } else {
    res.sendStatus(404);
  }

});

app.get('/', (req, res) => {
    console.log(req);
});

app.get('/fbhook', (req, res) => {
  let VERIFY_TOKEN = "1234"
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  console.log(req.query);

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});
