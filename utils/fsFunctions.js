const fs = require('fs/promises');

const getTalker = async () => {
  try {
    const data = await fs.readFile('./talker.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err.message);
  }
};

const setTalker = async (allTalkers, newTalker) => {
  try {
    await fs.writeFile('./talker.json', JSON.stringify([...allTalkers, newTalker]));
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = { getTalker, setTalker };