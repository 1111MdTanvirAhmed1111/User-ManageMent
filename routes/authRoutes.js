const express = require('express');
const { register, login, getUserData } = require('../controllers/authController');
const {uploadSingle} = require('../middlewares/multer')
const router = express.Router();

router.post('/register',uploadSingle('ProfileImg'), register);
router.post('/login', login);
router.get('/userdata', getUserData);

module.exports = router;