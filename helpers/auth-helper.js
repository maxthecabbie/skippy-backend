var _      = require('lodash'),
    jwt    = require('jsonwebtoken'),
    config = require('../config');
    
function createIdToken(reqBody) {
    var profile = _.pick(reqBody, 'username', 'password', 'extra');
    return jwt.sign(_.omit(profile, 'password'), config.secret, {expiresIn: 60*60*5});
}

function createAccessToken() {
    return jwt.sign({
        iss: config.issuer,
        aud: config.audience,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        scope: 'full_access',
        sub: "lalaland|gonto",
        jti: genJti(),
        alg: 'HS256'
    }, config.secret);
}

function genJti() {
    let jti = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        jti += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return jti;
}

module.exports = {
    'createIdToken': createIdToken,
    'createAccessToken': createAccessToken
}