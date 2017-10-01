var express    = require('express'),
    db         = require('../db'),
    validator  = require('../helpers/place-helper');

var app = module.exports = express.Router();

function validatePlaceId(placeId) {
    var numberRegex = /^[0-9]+$/;
    return numberRegex.test(placeId);
}

app.get('/places/:placeId', function(req, res) {
    var placeId = req.params.placeId;
    var validPlaceId = validator.validatePlaceId(placeId);
    if (!validPlaceId) {
        return res.status(400).send({
            errorMsg: 'Invalid place'
        });
    }
    placeId = parseInt(req.params.placeId);

    db('places').where({id: placeId})
    .then(function(rows) {
        if (rows.length <= 0) {
            return res.status(401).send({
                errorMsg: 'The place you have entered does not exist'
            });
        }
        var placeName = rows[0].name;
        return res.status(201).send({
            placeName: placeName
        });
    })
});
