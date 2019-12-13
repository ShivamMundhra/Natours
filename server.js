const app = require('./app');

const port = 1000;
app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});
