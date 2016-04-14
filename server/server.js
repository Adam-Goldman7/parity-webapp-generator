const express = require('express');
const app = express();
const config = require('./config');
const api = require('./api/api');

require('./middleware/appMiddleware')(app);

app.use(express.static('client'));

app.use('/api', api);

app.listen(config.port);

console.log('server listening on ' + config.port);