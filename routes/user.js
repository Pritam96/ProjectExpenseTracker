const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/add', userController.postCreateUser);

module.exports = router;
