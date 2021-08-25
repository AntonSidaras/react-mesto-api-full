const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const customIsURL = (value, helpers) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports.updateProfileSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    'content-type': Joi.string().pattern(/^application\/json$/i).required(),
  }).unknown(true),
});

module.exports.updateAvatarSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().custom(customIsURL, 'custom validation').required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    'content-type': Joi.string().pattern(/^application\/json$/i).required(),
  }).unknown(true),
});

module.exports.getUserByIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});
