var router = require('express').Router();
var userController = require('../controllers/authController');

router.post('/signup', userController.create);

router.post('/login', userController.get);

router.use(function(err, req, res, next) {
  if (err) {
    console.log('got an error ' + err.message);
    res.status(500).send(err);
  }
});

module.exports = router;
