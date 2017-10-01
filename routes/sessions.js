var express    = require('express'),
    bcrypt     = require('bcrypt'),
    db         = require('../db'),
    authHelper = require('../helpers/auth-helper');

const SALTROUNDS = 10;

var app = module.exports = express.Router();

app.post('/sessions/create', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.status(400).send('You must send the username and the password');
    }

    db('users').where({username: username})
    .then(function(rows) {
        if (rows.length <= 0) {
            return res.status(401).send('The username you have entered does not exist');
        }
        var user = rows[0];
        var hash = user.hash;
        bcrypt.compare(password, hash).then(function(passMatch) {
            if (passMatch) {
                return res.status(201).send({
                    id_token: authHelper.createIdToken(user),
                    access_token: authHelper.createAccessToken()
                })
            }
            return res.status(401).send('The username and password do not match');
        });
    })
});
