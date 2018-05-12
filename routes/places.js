var express = require('express'),
  db = require('../db'),
  placeHelper = require('../helpers/place-helper');

var app = module.exports = express.Router();

app.post('/places', function(req, res) {
  var placeName = req.body.placeName;
  var creatorId = req.body.userId;
  var validPlaceName = placeHelper.validatePlaceName(placeName);

  if (!validPlaceName) {
    return res.status(400).send({
      errorMsg: 'Invalid place name'
    });
  }

  var createPlace = db.insert({
      name: placeName
    })
    .into('places')
    .returning(['id', 'name'])
    .then(function(rows) {
      var newPlaceInsert = rows[0];

      return db.insert({
          place_id: newPlaceInsert.id,
          user_id: creatorId
        })
        .into('place_admins')
        .returning(['place_id', 'user_id']);
    })
    .then(function(rows) {
      res.status(201).send({
        placeId: rows[0].place_id
      });
    });
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

  var placeRows = db('places').where({ id: placeId });

  var placeAdmins = db('place_admins').select('user_id').where({ place_id: placeId });

  var placeQueues = placeRows.then(function(rows) {
    if (rows.length <= 0) {
      res.status(401).send({
        errorMsg: 'The place you have entered does not exist'
      });
      return Promise.reject();
    } else {
      var placeId = rows[0].id;
      return (db('queues').join('places', 'queues.place_id', 'places.id')
        .where('places.id', placeId)
        .select('queues.id', 'queues.name')
      );
    }
  });

  Promise.all([placeRows, placeAdmins, placeQueues]).then(function([placeRows, adminRows, queueRows]) {
      res.status(200).send({
        placeRows: placeRows,
        adminRows: adminRows,
        queueRows: queueRows
      })
    })
    .catch(function() {});
});