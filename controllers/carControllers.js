const Car = require('./../models/carModels');


exports.addCar = async (req, res) => {
    try {
        const newCar = await Car.create(req.body);

        res.status(201).json({
            status: 'Success',
            data: {
                car: newCar
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: 'Invalid data sent!',
            error: err.message
        });
    }
};

exports.getCarsByStatus = async (req, res) => {
    try {
        const { status } = req.params; // Extract status from request parameters

        // Validate status input
        if (status !== 'available' && status !== 'unavailable') {
            return res.status(400).json({
                status: 'Fail',
                message: 'Invalid status parameter. Status must be either "available" or "unavailable".'
            });
        }

        // Find cars based on the status
        const cars = await Car.find({ status: status });

        if (cars.length === 0) {
            return res.status(404).json({
                status: 'Fail',
                message: 'No cars found with the specified status'
            });
        }

        res.status(200).json({
            status: 'Success',
            result: cars.length,
            data: {
                cars
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err.message
        });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const { model } = req.params;  // Extract model from request parameters
        const updateData = req.body;

        // Find the car by model and update the provided fields
        const car = await Car.findOneAndUpdate({ model: model }, updateData, {
            new: true, // Return the updated car document
            runValidators: true // Ensure that updates meet schema requirements
        });

        if (!car) {
            return res.status(404).json({
                status: 'Fail',
                message: 'No car found with that model'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: {
                car
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err.message
        });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const { model } = req.params;  // Extract model from request parameters

        // Find the car by model and delete it
        const car = await Car.findOneAndDelete({ model: model });

        if (!car) {
            return res.status(404).json({
                status: 'Fail',
                message: 'No car found with that model'
            });
        }

        res.status(200).json({ // 204 No Content is typically used for successful delete responses
            status: 'Success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err.message
        });
    }
};