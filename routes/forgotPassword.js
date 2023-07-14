const express = require('express');

const forgotPasswordController = require('../controllers/forgotPassword');

const router = express.Router();

router.post('/forgot', forgotPasswordController.postForgotPassword);
router.get('/reset/:id', forgotPasswordController.getResetPassword);
router.post('/update', forgotPasswordController.postUpdatePassword);

module.exports = router;
