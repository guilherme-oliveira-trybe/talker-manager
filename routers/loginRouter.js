const express = require('express');
const { validateEmail, validatePassword } = require('../middlewares/validateMiddleware');
const { generateToken } = require('../utils/generateToken');

const loginRouter = express.Router();

loginRouter.use(validateEmail, validatePassword);

loginRouter.post('/', (req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

module.exports = loginRouter;