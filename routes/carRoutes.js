const express = require('express');

const carController = require('./../controllers/carControllers');

const router = express.Router();

router
.route('/addCar')
.post(carController.addCar);

router
.route('/seeCar/:status')
.get(carController.getCarsByStatus);

router
.route('/updateCar/:model')
.patch(carController.updateCar);

router
.route('/deleteCar/:model')
.delete(carController.deleteCar);

module.exports = router;