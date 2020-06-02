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
  res.send(await db.getExpenses());
});

server.get('/expenses/:id', async (req, res) => {
  const expense = await db.getExpense(req.params.id);

  if (!expense) {
    res.status(404).send();
    return;
  }

  res.send(expense);
});

server.post('/expenses', async (req, res) => {
  const expense = await db.insertExpense(req.body);

  if (!expense) {
    res.status(400).send();
    return;
  }

  res.status(201).send(expense);
});

server.put('/expenses/:id', async (req, res) => {
  const expense = await db.editExpense(req.params.id, req.body);

  if (!expense) {
    res.status(400).send();
    return;
  }

  res.status(200).send(expense);
});

server.delete('/expenses/:id', async (req, res) => {
  await db.deleteExpense(req.params.id);

  res.status(204).send();
});

server.listen(8000, () => {
  console.log('listening to port 8000');
});
