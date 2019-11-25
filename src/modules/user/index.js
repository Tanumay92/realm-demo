const router = require('express').Router();
const userCtrl = require('./user.ctrl');

router.post('/',userCtrl.addUser);
router.get('/',userCtrl.getAllUSer);
router.post('/update/:id',userCtrl.updateUserById);
router.post('/user-by-id/:id', userCtrl.getUserById);
router.get('/:id', userCtrl.deleteUserById);
router.post('/login', userCtrl.login);

module.exports = router;