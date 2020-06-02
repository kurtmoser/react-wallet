const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const Database = require('./database/Database');
const Knex = require('knex');
const knexConfig = require('../../knexfile');

const server = express();
server.use(cors());
server.use(morgan('combined'));
server.use(bodyParser.json());

const db = new Database(Knex(knexConfig));

server.get('/expenses', async (req, res) => {
  // index
  res.send(await db.getExpenses());
});

server.get('/expenses/:id', async (req, res) => {
  // show
  const expense = await db.getExpense(req.params.id);

  if (!expense) {
    res.status(404).send();
    return;
  }

  res.send(expense);
});

server.post('/expenses', async (req, res) => {
  // create
  const expense = await db.insertExpense(req.body);

  if (!expense) {
    res.status(400).send();
    return;
  }

  res.status(201).send(expense);
});

server.put('/expenses/:id', (req, res) => {
  // update
  res.send();
});

server.delete('/expenses/:id', (req, res) => {
  // destroy
  res.send();
});

server.listen(8000, () => {
  console.log('listening to port 8000');
});
