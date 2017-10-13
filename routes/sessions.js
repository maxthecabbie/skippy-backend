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
        return res.status(400).send({
            errorMsg: 'You must enter a username and password'
        });
    }

    db('users').where({username: username})
    .then(function(rows) {
        if (rows.length <= 0) {
            return res.status(401).send({
                errorMsg: 'The username you have entered does not exist'
            });
        }
        var user = rows[0];
        var hash = user.hash;
        bcrypt.compare(password, hash).then(function(passMatch) {
            if (passMatch) {
                var userData = {
                    id: user.id,
                    username: user.username
                }
                return res.status(201).send({
                    id_token: authHelper.createIdToken(user),
                    access_token: authHelper.createAccessToken(),
                    user: userData
                })
            }
            return res.status(401).send('The username and password do not match');
        });
    })
});
