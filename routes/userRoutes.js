const express = require('express');

const userController = require('./../controllers/userControllers');

const router = express.Router();

router
.route('/')
.post(userController.registerUser)
.get(userController.getAllUsers);


router
.route('/register')
.post(userController.registerUser);

router
.route('/login')
.post(userController.loginUser);

router
.route('/updateProfile/:email')
.patch(userController.updateUserProfile);

module.exports = router;