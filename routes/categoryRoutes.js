const express = require('express');

const categoryController = require('./../controllers/categoryControllers');

const router = express.Router();

router
.route('/getCategory')
.get(categoryController.getCategory);

router
.route('/addCategory')
.post(categoryController.addCategory);

router
.route('/deleteCategory/:categoryName')
.delete(categoryController.deleteCategory);

module.exports = router;