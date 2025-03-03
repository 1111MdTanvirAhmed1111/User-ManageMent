const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { GetUsers, deleteUser, updateUser} = require('../controllers/userController'); // Changed to userController
const { uploadSingle } = require('../middlewares/multer');
const userAuthenticate = require('../middlewares/userAuthenticate');

const router = express.Router();

// Full Non Restricted ROutes

router.get('/',GetUsers)


// Intermediate Routes
router.delete('/:id' ,authMiddleware , userAuthenticate, deleteUser)
router.put('/:id'  ,authMiddleware, userAuthenticate, uploadSingle('ProfileImg'), updateUser)


//Admin MasterClass Routes

router.delete('/:id' ,authMiddleware ,roleMiddleware('admin'), deleteUser)
router.put('/:id'  ,authMiddleware,roleMiddleware('admin'),  uploadSingle('ProfileImg'), updateUser)


module.exports = router;