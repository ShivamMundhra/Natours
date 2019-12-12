const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'hello world', app: 'natours' });
});

app.post('/', (req, res) => {
  res.send('post req');
});

const port = 1000;

app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});
