const router = require('express').Router();
const userRoute = require('../modules/user');

router.use('/user', userRoute);

module.exports = router;