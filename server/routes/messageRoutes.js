var router = require('express').Router();
var messageController = require('../controllers/messageController');

router.post('/send', messageController.send);
router.get('/:username/:communicator', messageController.get);

router.use(function(err, req, res, next) {
  if (err) {
    console.log('got an error ' + err);
    res.status(500).send(err);
  }
});

module.exports = router;
