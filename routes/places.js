var express    = require('express'),
    db         = require('../db'),
    placeHelper  = require('../helpers/place-helper');

var app = module.exports = express.Router();

app.post('/places', function(req, res) {
    var placeName = req.body.placeName;
    var validPlaceName = placeHelper.validatePlaceName(placeName);

    if (!validPlaceName) {
        return res.status(400).send({
            errorMsg: 'Invalid place name'
        });
    }
    
    db.insert({
        name: placeName
    })
    .into('places')
    .returning(['id', 'name'])
    .then(function(rows) {
        var newPlaceInsert = rows[0];
        res.status(201).send({
            id: newPlaceInsert.id,
            placeName: newPlaceInsert.name
        });
    })
});

app.get('/places/:placeId', function(req, res) {
    var placeId = req.params.placeId;
    var validPlaceId = placeHelper.validatePlaceId(placeId);
    if (!validPlaceId) {
        return res.status(400).send({
            errorMsg: 'Invalid place'
        });
    }
    placeId = parseInt(req.params.placeId);

    var placeRows = db('places').where({id: placeId});

    var placeQueues = placeRows.then(function(rows) {
        if (rows.length <= 0) {
            res.status(401).send({
                errorMsg: 'The place you have entered does not exist'
            });
            return Promise.reject();
        }
        else {
            var placeId = rows[0].id;
            return (db('queues').join('places', 'queues.place_id', 'places.id')
                    .where('places.id', placeId)
                    .select('queues.id', 'queues.name')
            );            
        }
    });

    Promise.all([placeRows, placeQueues]).then(function([placeRows, queueRows]) {
        res.status(200).send({
            placeRows: placeRows,
            queueRows: queueRows
        })
    })
    .catch(function() {
    });
});
