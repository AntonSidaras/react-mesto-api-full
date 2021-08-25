/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;
const secretKeyDev = 'secret';

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

  if (NODE_ENV === 'production') {
    try {
      payload = jwt.verify(token, secretKeyDev);
      console.log('\x1b[31m%s\x1b[0m', `
        !!!ВНИМАНИЕ!!! В продакшне используется тот же
        секретный ключ, что и в режиме разработки.
      `);
    } catch (err) {
      if (err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
        console.log(
          '\x1b[32m%s\x1b[0m',
          'Всё в порядке. Секретные ключи отличаются',
        );
      } else {
        console.log(
          '\x1b[33m%s\x1b[0m',
          'Что-то не так',
          err,
        );
      }
    }
  }

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKeyDev);
  } catch (err) {
    return handleAuthError(res, next);
  }

  req.user = payload;

  return next();
};
