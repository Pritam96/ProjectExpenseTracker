const express = require('express');

const forgotPasswordController = require('../controllers/forgotPassword');

const router = express.Router();

router.post('/forgot', forgotPasswordController.postForgotPassword);
router.get('/reset/:id', forgotPasswordController.getResetPassword);
router.get('/update/:id', forgotPasswordController.getUpdatePassword);

module.exports = router;
