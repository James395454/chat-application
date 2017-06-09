var router = require('express').Router();
var userController = require('../controllers/userController');

router.get('/:username', userController.get);

router.use(function(err, req, res, next) {
  if (err) {
    console.log('got an error ' + err);
    res.status(500).send(err);
  }
});

module.exports = router;
