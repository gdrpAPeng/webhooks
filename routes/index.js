var express = require('express');
var router = express.Router();

const webhookController = require('../controllers/webhooks')

/* GET home page. */
router.post('/webhook', function(req, res, next) {
  return webhookController.webhooks(req, res, next)
});

module.exports = router;
