const Cards = require('../models/card');
const BadRequest = require('../errors/bad-request');
const NotFound = require('../errors/not-found');
const Forbidden = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .populate('owner likes')
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Cards.create({ name, link, owner })
    .then((card) => {
      Cards.findById(card._id)
        .populate('owner')
        .then((c) => {
          res.status(200).send(c);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Cards.findById(cardId)
    .orFail(() => {
      next(new NotFound('Нет карточки с таким _id'));
    })
    .then((card) => {
      if (card.owner.toString() !== userId.toString()) {
        next(new Forbidden('Нельзя удалять чужие карточки!'));
        return;
      }
      Cards.deleteOne(card)
        .then((c) => {
          res.status(200).send({ data: c });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            throw new BadRequest(err.message);
          }
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

module.exports.likeCardById = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Cards.findByIdAndUpdate(
    { _id: cardId },
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .populate('owner likes')
    .orFail(() => {
      next(new NotFound('Нет карточки с таким _id'));
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};

module.exports.dislikeCardById = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Cards.findByIdAndUpdate(
    { _id: cardId },
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .populate('owner likes')
    .orFail(() => {
      next(new NotFound('Нет карточки с таким _id'));
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
    })
    .catch(next);
};
