const express = require('express');
const { register, login, getUserData } = require('../controllers/authController');
const {forgotPassword, resetPassword} = require('../controllers/authMisController')

const {uploadSingle} = require('../middlewares/multer')
const router = express.Router();

router.post('/register',uploadSingle('ProfileImg'), register);
router.post('/login', login);
router.get('/userdata', getUserData);


// Forgot Password Route
router.post('/forgot-password', forgotPassword);
// Reset Password Route
router.post('/reset-password', resetPassword);


module.exports = router;