const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers'); // Ensure the path and filenames are correct

router
.route('/orderCar')
.post(orderController.orderCar);

module.exports = router;