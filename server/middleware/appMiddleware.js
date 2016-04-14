var morgan = require('morgan');
var cors = require('cors');
var config = require('../config');
var override = require('method-override');
var busboy = require('express-busboy');

module.exports = function (app) {
  if (config.logging) {
    app.use(morgan('dev'));
  }
  busboy.extend(app, {
    upload: true,
    path: './tmp'
  });
  app.use(cors());
  app.use(override());
  app.use(attachTemp);
};

function attachTemp (req, res, next) {
  req.temp = req.temp || {};
  next();
}
