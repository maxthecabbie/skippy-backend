var express = require('express'),
  queuesActions = require('../actions/queuesActions'),
  constants = require('../constants');

var app = module.exports = express.Router();

app.post('/queues', function(req, res) {
  var requestAction = req.body.requestAction;

  switch (requestAction) {
    case constants.getQueueUsers:
      queuesActions.getQueueUsers(req, res);
      break;
    case constants.createQueue:
      queuesActions.createQueue(req, res);
      break;
    case constants.queueUser:
      queuesActions.queueUser(req, res);
      break;
    case constants.dequeueUser:
      queuesActions.dequeueUser(req, res);
      break;
    default:
      return res.status(400).send({
        errorMsg: 'Unknown requestAction.'
      });
  }
});