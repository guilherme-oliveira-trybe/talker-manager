const express = require('express');
const bodyParser = require('body-parser');
const { getTalker, setTalker } = require('./utils/fsFunctions');
const { 
  validateEmail, validatePassword, 
  validateToken, 
  validateName,
  validateAge,
  validateKeyTalk,
  validateKeyWatchedAt,
  validateKeyRate,
} = require('./middlewares/validateMiddleware');
const { generateToken } = require('./utils/generateToken');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.get('/talker/search', validateToken, async (req, res) => {
  const { q: searchTerm } = req.query;
  const allTalkers = await getTalker();
  const talkerFound = allTalkers.filter((t) => t.name.includes(searchTerm));
  console.log(talkerFound);
  if (!searchTerm || searchTerm === '') return res.status(200).json(allTalkers);
  if (!talkerFound) return res.status(200).json([]);
  return res.status(200).json(talkerFound);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalker();
  const found = talkers.find((talker) => talker.id === Number(id));
  if (!found) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(found);
});

app.get('/talker', async (req, res) => {
  const talkers = await getTalker();
  if (!talkers) return res.status(200).json([]);
  return res.status(200).json(talkers);
});

app.post('/login', validateEmail, validatePassword, (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const allTalkers = await getTalker();
  const talkerIndex = allTalkers.findIndex((t) => t.id === Number(id));
  allTalkers.splice(talkerIndex, 1);
  await setTalker(allTalkers);

  return res.status(204).end();
});

app.use(
  validateToken, 
  validateName, 
  validateAge, 
  validateKeyTalk, 
  validateKeyWatchedAt, 
  validateKeyRate,
);

app.post('/talker', async (req, res) => {
  const newTalker = req.body;
  const allTalkers = await getTalker();
  const nextId = allTalkers.length + 1;
  if (!newTalker.id || newTalker.id === '') {
    newTalker.id = nextId;
  }
  await setTalker([...allTalkers, newTalker]);

  return res.status(201).json(newTalker);
});

app.put('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const newtalker = req.body;
  const editTalker = { id: Number(id), ...newtalker };
  // const allTalkers = await getTalker();
  // const index = allTalkers.findIndex((t) => t.id === Number(id));
  // allTalkers[index] = editTalker;
  await setTalker([editTalker]);

  return res.status(200).json(editTalker);
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
