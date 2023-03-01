const express = require('express');
const bodyParser = require('body-parser');
const talkersRouter = require('./routers/talkerRouter');
const loginRouter = require('./routers/loginRouter');
require('express-rescue');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.use('/talker', talkersRouter);
app.use('/login', loginRouter);

app.use((err, req, res, _next) => res.status(500).json({ message: 'Server Error!!!' }));

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
