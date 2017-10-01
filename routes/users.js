var express    = require('express'),
    bcrypt     = require('bcrypt'),
    db         = require('../db'),
    authHelper = require('../helpers/auth-helper'),
    validator  = require('../helpers/signup-helper');

const SALTROUNDS = 10;

var app = module.exports = express.Router();

app.post('/users', function(req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var passConfirm = req.body.passConfirm;
    var validSignup = validator.signupValidator(username, password, passConfirm);

    if (!validSignup) {
        return res.status(400).send({
            errorMsg: 'Invalid signup'
        });
    }

    db('users').where({username: username}).select('username')
    .then(function(rows) {
        if (rows.length > 0) {
            return res.status(400).send({
                errorMsg: "Username already exists"
            });
        }
        bcrypt.hash(password, SALTROUNDS, function(err, hash) {
            db.insert({
                username: username,
                hash: hash
            })
            .into('users')
            .then(function() {
                res.status(201).send({
                    id_token: authHelper.createIdToken(req.body),
                    access_token: authHelper.createAccessToken()
                });
            })
        });
    })
});