const express = require('express');

const userController = require('../controllers/users');

const router = express.Router();

router.post('/add', userController.postCreateUser);

module.exports = router;
