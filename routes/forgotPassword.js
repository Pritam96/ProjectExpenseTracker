const express = require('express');

const forgotPasswordController = require('../controllers/forgotPassword');

const router = express.Router();

// POST => /forgot => INITIATE BREVO INSTANCE & SEND RESET PASSWORD MAIL
router.post('/forgot', forgotPasswordController.postForgotPassword);

// GET => /reset/<id> => GET RESET PASSWORD FORM
router.get('/reset/:id', forgotPasswordController.getResetPassword);

// POST => /update => UPDATE USER WITH NEW PASSWORD
router.post('/update', forgotPasswordController.postUpdatePassword);

module.exports = router;
