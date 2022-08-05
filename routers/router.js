const express = require('express');
const { getTalker, setTalker } = require('../utils/fsFunctions');
const { 
  validateEmail, validatePassword, 
  validateToken, 
  validateName,
  validateAge,
  validateKeyTalk,
  validateKeyWatchedAt,
  validateKeyRate,
} = require('../middlewares/validateMiddleware');
const { generateToken } = require('../utils/generateToken');

const router = express.Router();