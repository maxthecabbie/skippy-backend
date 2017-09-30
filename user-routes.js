var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken'),
    bcrypt  = require('bcrypt'),
    db      = require('./db');
const SALTROUNDS = 10;
var app = module.exports = express.Router();

function createIdToken(user) {
    return jwt.sign(_.omit(user, 'password'), config.secret, {expiresIn: 60*60*5});
}

function createAccessToken() {
    return jwt.sign({
        iss: config.issuer,
        aud: config.audience,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        scope: 'full_access',
        sub: "lalaland|gonto",
        jti: genJti(), // unique identifier for the token
        alg: 'HS256'
    }, config.secret);
}

// Generate Unique Identifier for the access token
function genJti() {
    let jti = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        jti += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return jti;
}

app.post('/users', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.status(400).send("You must send the username and the password");
    }

    db('users').where({username: username}).select('username')
    .then(function(rows) {
        if (rows.length > 0) {
            return res.status(400).send("A user with that username already exists");
        }
        bcrypt.hash(password, SALTROUNDS, function(err, hash) {
            db.insert({
                username: username,
                hash: hash
            })
            .into('users')
            .then(function() {
                var profile = _.pick(req.body, 'username', 'password', 'extra');
                res.status(201).send({
                    id_token: createIdToken(profile),
                    access_token: createAccessToken()
                });
            })
        });
    })
});

app.post('/sessions/create', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.status(400).send("You must send the username and the password");
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
                    id_token: createIdToken(user),
                    access_token: createAccessToken()
                })
            }
            return res.status(401).send('The username and password do not match');
        });
    })
});
