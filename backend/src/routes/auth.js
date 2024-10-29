const express = require('express');

const router = express.Router();

const { signup, signin, SendOtp, verifyotp, forgotpassword, passwordReset, data, all_data, alerts, alert_id, latest_data, auth_check, logout } = require('../controllers/register.js');

router.post('/register', signup);
router.post('/login', signin);
router.post("/send-otp", SendOtp);
router.post("/verify-otp",verifyotp);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password/:id/:token", passwordReset);
router.get("/api/data", data);
router.get("/api/data/all-data", all_data);
router.get("/api/alerts", alerts);
router.post("/api/alerts/:id", alert_id);
router.get("/api/latest", latest_data);
router.get('/auth/check', auth_check);
router.post('/logout', logout);

module.exports = router;
