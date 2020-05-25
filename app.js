const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const config = require('./src/configs/configs');
const port = config.port;
const routerNav = require('./src/index');
app.use(fileUpload());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routerNav);
app.listen(port, () => {
  console.log(`Server listening on PORT ${port}`);
});
module.exports = app;
