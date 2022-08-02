const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const generateToken = require('./services/generateToken');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const readFile = () => fs.readFileSync('./talker.json', 'utf8');

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  const result = JSON.parse(readFile());
  return res.status(200).json(result);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;

  const talker = JSON.parse(readFile());
  const result = talker.find((person) => person.id === +id);

  if (!result) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(result);
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const token = generateToken();

  if (email && password) return res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
