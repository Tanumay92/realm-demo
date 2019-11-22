const router = require('express').Router();
const userCtrl = require('./user.ctrl');

router.post('/',userCtrl.addUser);
router.get('/',userCtrl.getAllUSer);

module.exports = router;