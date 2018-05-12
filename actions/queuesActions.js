var db = require('../db'),
  queueHelper = require('../helpers/queue-helper');

function createQueue(req, res) {
  var placeId = req.body.placeId;
  var queueName = req.body.queueName;

  var validQueueName = queueHelper.validateQueueName(queueName);

  if (!validQueueName) {
    return res.status(400).send({
      errorMsg: 'Invalid queue name'
    });
  }

  var placeRows = db('places').where({ id: placeId });

  var queueRows = placeRows.then(function(rows) {
    if (rows.length <= 0) {
      res.status(401).send({
        errorMsg: 'The place you are trying to ' +
          'create a queue for does not exist'
      });
      return Promise.reject();
    } else {
      var placeId = rows[0].id;
      return (
        db.insert({
          place_id: placeId,
          name: queueName
        })
        .into('queues')
        .returning(['id', 'name'])
      );
    }
  })

  Promise.all([placeRows, queueRows]).then(function([placeRows, queueRows]) {
      var newQueueInsert = queueRows[0]
      res.status(200).send({
        queueId: newQueueInsert.id,
        queueName: newQueueInsert.name
      })
    })
    .catch(function() {});
}

function queueUser(req, res) {
  var queueId = req.body.queueId;
  var userId = req.body.userId;

  db.insert({
      queue_id: queueId,
      user_id: userId
    })
    .into('queue_users')
    .returning(['queue_id', 'user_id'])
    .then((row) => {
      res.status(200).send({
        row: row
      })
    })
    .catch(() => {
      res.status(400).send({
        errorMsg: 'Error adding user to queue'
      })
    });
}

function dequeueUser(req, res) {
  var queueId = req.body.queueId;
  var userId = req.body.userId;

  db('queue_users')
    .where({ queue_id: queueId, user_id: userId })
    .del()
    .returning(['queue_id', 'user_id'])
    .then((row) => {
      res.status(200).send({
        row: row
      })
    })
    .catch(() => {
      res.status(400).send({
        errorMsg: 'Error removing user from queue'
      })
    });
}

module.exports = {
  'createQueue': createQueue,
  'queueUser': queueUser,
  'dequeueUser': dequeueUser
}