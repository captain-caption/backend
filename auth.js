'use strict';

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const client = jwksClient({
  jwksUri: process.env.JWKS_URI,
});

// from: https://www.npmjs.com/package/jsonwebtoken
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyUser(req, errorFirstOrUserCallbackFunction) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    jwt.verify(token, getKey, {}, errorFirstOrUserCallbackFunction);
  } catch (error) {
    errorFirstOrUserCallbackFunction('Not authorized');
  }
}

module.exports = verifyUser;
