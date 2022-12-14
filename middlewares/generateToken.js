const crypto = require('crypto');

function generateToken(req, _res, next) {
  const token = crypto.randomBytes(8).toString('hex');
  
  req.token = token;

  next();
}

module.exports = generateToken;
