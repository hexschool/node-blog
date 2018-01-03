var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('archives', { title: 'Express' });
});

router.get('/post', function (req, res, next) {
  res.render('post', { title: 'Express' });
});

module.exports = router;
