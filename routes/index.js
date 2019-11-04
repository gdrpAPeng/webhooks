var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/webhook', function(req, res, next) {
  console.log('=====================')
  console.log(req)
  console.log('=====================')
  res.json(req.body)
});

module.exports = router;
