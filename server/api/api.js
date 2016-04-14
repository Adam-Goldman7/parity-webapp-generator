
const router = require('express').Router();
const controller = require('./controller');

router.route('/zip')
  .post(controller.zip);

module.exports = router;
