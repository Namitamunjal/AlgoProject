const express = require('express');

const router = express.Router();

const { signup, signin, SendOtp, verifyotp, forgotpassword, passwordReset } = require('../controllers/register.js');

router.post('/register', signup);
router.post('/login', signin);
router.post("/send-otp", SendOtp);
router.post("/verify-otp",verifyotp);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password/:id/:token", passwordReset);

module.exports = router;
