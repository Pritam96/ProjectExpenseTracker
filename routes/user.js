const express = require('express');

const userController = require('../controllers/users');

const router = express.Router();

// POST => /add => CREATE NEW USER
router.post('/add', userController.postCreateUser);

// POST => /login => LOGIN USER
router.post('/login', userController.postLoginUser);

module.exports = router;
