const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const {
  validateEmail, validatePassword, checkAuthorization, validateToken,
  validateName, validateAge, validateTalk, validateWatchedAt, validateRate,
  generateToken,
} = require('./middlewares');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const readFile = () => {
  const talkers = fs.readFileSync('./talker.json', 'utf8');
  return JSON.parse(talkers);
};

const wrirteFile = (params) => {
  fs.writeFileSync('./talker.json', JSON.stringify(params));
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  const result = readFile();
  return res.status(200).json(result);
});

app.use(checkAuthorization);
app.use(validateToken);

app.get('/talker/search', checkAuthorization, (req, res) => {
  const { q } = req.query;
  
  const talkers = readFile();
  const search = talkers.filter((person) => person.name.includes(q));

  return res.status(200).json(search);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;

  const talker = readFile();
  const result = talker.find((person) => person.id === +id);

  if (!result) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(result);
});

app.post('/talker',
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  (req, res) => {
    const { body } = req;
    
    const talkers = readFile();
    body.id = talkers.length + 1;
    talkers.push(body);

    const result = [body]; //! ??? 

    wrirteFile(result);

    return res.status(201).json(body);
  });

app.post('/login', validateEmail, validatePassword, generateToken, (req, res) => {
  const { body, token } = req;
  const { email, password } = body;

  if (email && password) return res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
