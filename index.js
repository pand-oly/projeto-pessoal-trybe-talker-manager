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

const readFileTalkers = () => {
  const talkers = fs.readFileSync('./talker.json', 'utf8');
  return JSON.parse(talkers);
};

const wrirteFileTalker = (params) => {
  fs.writeFileSync('./talker.json', JSON.stringify(params));
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  const result = readFileTalkers();
  return res.status(200).json(result);
});

app.get('/talker/search', checkAuthorization, validateToken, (req, res) => {
  const { q } = req.query;
  
  const talkers = readFileTalkers();
  const search = talkers.filter((person) => person.name.includes(q));

  return res.status(200).json(search);
});

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;

  const talkers = readFileTalkers();
  const result = talkers.find((person) => person.id === +id);

  if (!result) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(result);
});

app.post('/login', validateEmail, validatePassword, generateToken, (req, res) => {
  const { body: { email, password }, token } = req;

  if (email && password) return res.status(200).json({ token });
});

app.delete('/talker/:id', checkAuthorization, validateToken, (req, res) => {
  const { id } = req.params;

  const talkers = readFileTalkers();
  const newListTalkers = talkers.filter((person) => person.id !== +id);
  wrirteFileTalker(newListTalkers);

  return res.status(204).end();
});

app.use(checkAuthorization);
app.use(validateToken);
app.use(validateName);
app.use(validateAge);
app.use(validateTalk);
app.use(validateWatchedAt);
app.use(validateRate);

app.post('/talker', (req, res) => {
    const { body } = req;
    
    const talkers = readFileTalkers();
    body.id = talkers.length + 1;
    talkers.push(body); 

    wrirteFileTalker(talkers);

    return res.status(201).json(body);
});

app.put('/talker/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
  
    const talkers = readFileTalkers();
    const talker = talkers.find((person) => person.id === +id);
    const restTalkers = talkers.filter((person) => person.id !== +id);
  
    talker.name = name;
    talker.age = age;
    talker.talk = talk;
    
    restTalkers.push(talker);
    wrirteFileTalker(restTalkers);
  
    return res.status(200).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});
