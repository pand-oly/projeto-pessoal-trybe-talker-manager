const validateEmail = require('./validateEmail');
const validatePassword = require('./validatePassword');
const checkAuthorization = require('./checkAuthorization');
const validateToken = require('./validateToken');
const validateName = require('./validateName');
const validateAge = require('./validateAge');
const validateTalk = require('./validateTalk');
const validateWatchedAt = require('./validateWatchedAt');
const validateRate = require('./validateRate');

module.exports = {
  validateEmail,
  validatePassword,
  checkAuthorization,
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
};