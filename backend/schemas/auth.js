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
    name: Joi.string().default('Жак-Ив Кусто'),
    about: Joi.string().default('Исследователь'),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
});
