const express = require('express');
const bodyParser = require('body-parser');
const { getTalker, setTalker } = require('./utils/fsFunctions');
const { 
  validateEmail, validatePassword, validateTalker } = require('./middlewares/validateMiddleware');
const { generateToken } = require('./utils/generateToken');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/talker', async (req, res) => {
  const talkers = await getTalker();
  if (!talkers) return res.status(200).json([]);
  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalker();
  const found = talkers.find((talker) => talker.id === Number(id));
  if (!found) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(found);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.post('/talker', validateTalker, async (req, res) => {
  const newTalker = req.body;
  const allTalkers = await getTalker();
  const isIdExists = allTalkers.some((t) => t.id === newTalker.id);

  if (isIdExists) return res.status(409).json({ message: 'id already exists' });

  await setTalker(allTalkers, newTalker);

  return res.status(201).json(newTalker);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
