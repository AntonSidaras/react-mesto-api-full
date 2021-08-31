const { celebrate, Joi, Segments } = require('celebrate');

module.exports.signInSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    'content-type': Joi.string().pattern(/^application\/json$/i).required(),
  }).unknown(true),
});

module.exports.signUpSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().default('Как вас зовут?'),
    about: Joi.string().default('Информация о вас'),
    avatar: Joi.string().default('https://techmesse.com/img/anonymous.jpg'),
  }),
});
