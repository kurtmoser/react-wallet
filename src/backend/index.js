const express = require('express');

const server = express();

server.get('/expenses', (req, res) => {
  // index
  res.send();
});

server.get('/expenses/:id', (req, res) => {
  // show
  res.send();
});

server.post('/expenses', (req, res) => {
  // create
  res.send();
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
