'use strict';

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());
  PAGE_ACCESS_TOKEN = "EAABwUGkFhW0BAJR6VsDmkYPnzDWu84rIIJNTfrJ50UZBMh2h0alNoFiuDLze1ZA6IVPNim0IVjUlx2NMnZC1erYaMV1nEqaN4NS0BEYYoCwphSiEe6YY0g0ZAVe64XsvZB76vopClyYkkh9ZCzzmFxoCqraBeQs1bXIhOF6EX0WwZDZD";

var handler = require('./handler.js');

app.listen(process.env.PORT || 8080, () => console.log('webhook is listening'));

app.post('/fbhook', (req, res) => {

  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhookEvent = entry.messaging[0];
      let senderPsid = webhookEvent.sender.id;

      if (webhookEvent.message) {
          handler.handleMessage(senderPsid, webhookEvent.message);
      } else if (webhookEvent.postback) {
          handler.handlePostback(senderPsid, webhookEvent.postback);
      } else if (webhookEvent.read) {
          handler.handleRead(senderPsid, webhookEvent.read);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
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
