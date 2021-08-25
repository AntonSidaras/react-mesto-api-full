const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const customIsURL = (value, helpers) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports.createCardSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(customIsURL, 'custom validation').required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    'content-type': Joi.string().pattern(/^application\/json$/i).required(),
  }).unknown(true),
});

module.exports.cardIdValidateSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});
