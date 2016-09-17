require('babel-register');
const { default: app } = require('./app');
const { PORT } = require('./constant/index');

app.listen(PORT, () => {
  console.log(`Running server on port ${PORT}!`);
});
