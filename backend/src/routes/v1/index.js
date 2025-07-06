const express = require('express');
const { InfoController,  } = require('../../controllers')
const userRoute = require('./user-route');
const tweetRoute = require('./tweet-route');

const router = express.Router();

router.get('/info' , InfoController.info);



router.use('/user', userRoute);
router.use('/tweet', tweetRoute);

module.exports = router;