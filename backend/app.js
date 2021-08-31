const { PORT = 3000 } = process.env;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const { signInSchema, signUpSchema } = require('./schemas/auth');
const NotFound = require('./errors/not-found');

const { NODE_ENV, ATLAS_USER, ATLAS_SECRET } = process.env;
const allowedOrigins = ['http://localhost:3000',
  'http://asidaras.mesto.nomoredomains.club',
  'https://asidaras.mesto.nomoredomains.club'];
const atlasURI = `mongodb+srv://${ATLAS_USER}:${ATLAS_SECRET}@asidarascluster.k86db.mongodb.net/mesto?retryWrites=true&w=majority`;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? atlasURI : 'mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).catch((err) => {
  throw new Error(err.message);
});

app.use(requestLogger);

app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', signInSchema, login);
app.post('/signup', signUpSchema, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFound('URL не найден'));
});

app.use(errorLogger);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {});
