const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

const handleAuthError = (res, next) => {
  next(new Unauthorized('Необходима авторизация'));
};

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload;

  return next();
};
