const router = require('express').Router();
const userCtrl = require('./user.ctrl');

router.post('/',userCtrl.addUser);
router.get('/',userCtrl.getAllUSer);
router.post('/update/:id',userCtrl.updateUserById);

module.exports = router;