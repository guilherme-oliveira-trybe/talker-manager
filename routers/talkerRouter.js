const express = require('express');
const { getTalker, setTalker } = require('../utils/fsFunctions');
const { 
  validateToken, 
  validateName,
  validateAge,
  validateKeyTalk,
  validateKeyWatchedAt,
  validateKeyRate,
} = require('../middlewares/validateMiddleware');

const talkerRouter = express.Router();

talkerRouter.get('/search', validateToken, async (req, res) => {
  const { q: searchTerm } = req.query;
  const allTalkers = await getTalker();
  const talkerFound = allTalkers.filter((t) => t.name.includes(searchTerm));
  console.log(talkerFound);
  if (!searchTerm || searchTerm === '') return res.status(200).json(allTalkers);
  if (!talkerFound) return res.status(200).json([]);
  return res.status(200).json(talkerFound);
});

talkerRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await getTalker();
  const found = talkers.find((talker) => talker.id === Number(id));
  if (!found) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  return res.status(200).json(found);
});

talkerRouter.get('/', async (req, res) => {
  const talkers = await getTalker();
  if (!talkers) return res.status(200).json([]);
  return res.status(200).json(talkers);
});

talkerRouter.delete('/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const allTalkers = await getTalker();
  const talkerIndex = allTalkers.findIndex((t) => t.id === Number(id));
  allTalkers.splice(talkerIndex, 1);
  await setTalker(allTalkers);

  return res.status(204).end();
});

talkerRouter.use(
  validateToken, 
  validateName, 
  validateAge, 
  validateKeyTalk, 
  validateKeyWatchedAt, 
  validateKeyRate,
);

talkerRouter.post('/', async (req, res) => {
  const newTalker = req.body;
  const allTalkers = await getTalker();
  const nextId = allTalkers.length + 1;
  if (!newTalker.id || newTalker.id === '') {
    newTalker.id = nextId;
  }
  await setTalker([...allTalkers, newTalker]);

  return res.status(201).json(newTalker);
});

talkerRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const newtalker = req.body;
  const editTalker = { id: Number(id), ...newtalker };
  
  await setTalker([editTalker]);

  return res.status(200).json(editTalker);
});

module.exports = talkerRouter;