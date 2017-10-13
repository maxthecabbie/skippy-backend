var express    = require('express'),
    db         = require('../db'),
    queueHelper  = require('../helpers/queue-helper');

var app = module.exports = express.Router();

app.post('/queues', function(req, res) {
    var placeId = req.body.placeId;
    var queueName = req.body.queueName;

    var validQueueName = queueHelper.validateQueueName(queueName);

    if (!validQueueName) {
        return res.status(400).send({
            errorMsg: 'Invalid queue name'
        });
    }

    var placeRows = db('places').where({id: placeId});

    var queueRows = placeRows.then(function(rows) {
        if (rows.length <= 0) {
            res.status(401).send({
                errorMsg: 'The place you are trying to ' +
                'create a queue for does not exist'
            });
            return Promise.reject();
        }
        else {
            var placeId = rows[0].id;
            return (db.insert({
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
    .catch(function() {
    });
});