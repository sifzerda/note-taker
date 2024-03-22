const router = require('express').Router();

// Import modular routers
const tipsRouter = require('./notes');

router.use('/tips', tipsRouter);

module.exports = router;
