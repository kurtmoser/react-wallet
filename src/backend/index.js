const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Database = require('./database/Database');
const Knex = require('knex');
const knexConfig = require('../../knexfile');
const path = require('path');
require('dotenv').config();

const server = express();
server.use(cors());
server.use(morgan('combined'));
server.use(bodyParser.json());

const db = new Database(Knex(knexConfig));

// API

server.get('/api/expenses', async (req, res) => {
  res.send(await db.getExpenses());
});

server.get('/api/expenses/:id', async (req, res) => {
  const expense = await db.getExpense(req.params.id);

  if (!expense) {
    res.status(404).send();
    return;
  }

  res.send(expense);
});

server.post('/api/expenses', async (req, res) => {
  const expense = await db.insertExpense(req.body);

  if (!expense) {
    res.status(400).send();
    return;
  }

  res.status(201).send(expense);
});

server.put('/api/expenses/:id', async (req, res) => {
  const expense = await db.editExpense(req.params.id, req.body);

  if (!expense) {
    res.status(400).send();
    return;
  }

  res.status(200).send(expense);
});

server.delete('/api/expenses/:id', async (req, res) => {
  await db.deleteExpense(req.params.id);

  res.status(204).send();
});

server.get('/api/top/locations', async (req, res) => {
  res.send(await db.getTopLocations(req.query.location));
});

server.get('/api/top/goods', async (req, res) => {
  res.send(await db.getTopGoods(req.query.goods, req.query.location));
});

server.get('/status', async (req, res) => {
  res.send('OK');
});

// Frontend

const publicPath = path.join(__dirname, '..', 'frontend', 'build');
server.use(express.static(publicPath));
// server.get('/', (req, res) => {
//   res.send('in index');
// });
server.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const serverPort = process.env.PORT || 8000;
server.listen(serverPort, () => {
  console.log('listening to port ' + serverPort);
});
