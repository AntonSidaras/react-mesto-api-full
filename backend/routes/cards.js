const router = require('express').Router();
const { createCardSchema, cardIdValidateSchema } = require('../schemas/cards');
const {
  getCards, createCard, deleteCardById, likeCardById, dislikeCardById,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCardSchema, createCard);
router.delete('/:cardId', cardIdValidateSchema, deleteCardById);
router.put('/:cardId/likes', cardIdValidateSchema, likeCardById);
router.delete('/:cardId/likes', cardIdValidateSchema, dislikeCardById);

module.exports = router;
