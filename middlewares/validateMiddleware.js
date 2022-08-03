const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
app.use(bodyParser.json());

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  const emailValido = emailRegex.test(email);
  if (!email || email === '') {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!emailValido) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  const MIN_LENGTH = 6;
  if (!password || password === '') {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < MIN_LENGTH) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  const MIN_LENGTH = 16;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length < MIN_LENGTH) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const validateName = (req, res, next) => {
  const { name } = req.body;
  const MIN_LENGTH = 3;
  if (!name || name === '') {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < MIN_LENGTH) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const validateAge = (req, res, next) => {
  const { age } = req.body;
  const MIN_AGE = 18;
  if (!Number.isInteger(age)) {
    return res.status(400).end();
  }
  if (!age || age === '') {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < MIN_AGE) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const validateTalk = (req, res) => {
  const { talk } = req.body;
  if (typeof (talk) !== 'object') {
    return res.status(400).end();
  }
  if (!talk || talk === '') {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }
};

const validateWatchedAt = (req, res) => {
  const { talk: { watchedAt } } = req.body;
  const validDate = moment(watchedAt, 'DD/MM/YYYY', true).isValid();
  if (!watchedAt || watchedAt === '') {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!validDate) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
};

const validateRate = (req, res) => {
  const { talk: { rate } } = req.body;
  if (!rate || rate === '') {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (!Number.isInteger(rate) < 1 || !Number.isInteger(rate) > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
};

module.exports = { validateEmail, validatePassword, validateToken, validateName, validateAge };