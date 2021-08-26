const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Unauthorized = require('../errors/unauthorized');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Conflict = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;
const secretKeyDev = 'secret';

function findUserById(id, res, next) {
  User.findById(id)
    .orFail(() => {
      next(new NotFound('Нет пользователя с таким _id'));
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  findUserById(req.params.userId, res, next);
};

module.exports.getUserInfo = (req, res, next) => {
  findUserById(req.user._id, res, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        data: {
          id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new Conflict(`Пользователе с email ${email} уже существует`);
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    { _id: userId },
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFound('Нет пользователя с таким _id'));
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    { _id: userId },
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFound('Нет пользователя с таким _id'));
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secretKeyDev,
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch((err) => {
      throw new Unauthorized(err.message);
    })
    .catch(next);
};
