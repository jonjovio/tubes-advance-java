const User = require('./../models/userModels');
const Car = require('./../models/carModels');
const Category = require('../models/categoryModels');
const CarCategory = require('../models/carCategoryModels');


exports.updateCarCategory = async (req, res) => {
    try {
        const { model } = req.params;        

        const { newCategoryName, userEmail } = req.body; // User's email is passed in the request body

        // Find the user by email to check if they are an admin
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        // Only allow admins to update car categories
        if (user.type !== "admin") {
            return res.status(403).json({
                status: 'Fail',
                message: 'Unauthorized: Only admins can update car categories'
            });
        }


        // Find the car by model
        const car = await Car.findOne({ model: model });
        if (!car) {
            return res.status(404).json({
                status: 'Fail',
                message: 'No car found with the specified model'
            });
        }

        // Find the new category by name
        const newCategory = await Category.findOne({ categoryName: newCategoryName });
        if (!newCategory) {
            return res.status(404).json({
                status: 'Fail',
                message: 'No category found with the specified name'
            });
        }

        // Update the CarCategory association
        const updatedCarCategory = await CarCategory.findOneAndUpdate(
            { car_id: car._id },
            { category_id: newCategory._id },
            { new: true }
        );

        if (!updatedCarCategory) {
            return res.status(404).json({
                status: 'Fail',
                message: 'Car category association not found'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: {
                car: car.model,
                category: newCategory.categoryName
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Fail',
            message: err.message
        });
    }
};


exports.addCar = async (req, res) => {
    try {
        const { merk, model, color, capacity, price_per_day, status, categoryName, userEmail } = req.body;

        // Find the user by email to check if they are an admin
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        // Only allow admins to update car categories
        if (user.type !== "admin") {
            return res.status(403).json({
                status: 'Fail',
                message: 'Unauthorized: Only admins can add car'
            });
        }

        console.log("Received category name:", categoryName);  // Log the received category name

        // Check if the category exists
        const category = await Category.findOne({ categoryName: categoryName });
        console.log("Found category:", category);  // Log the found category

        if (!category) {
            return res.status(404).json({
                status: 'Fail',
                message: 'Category not found ' + categoryName
            });
        }

        // Create the car
        const newCar = await Car.create({
            merk,
            model,
            color,
            capacity,
            price_per_day,
            status
        });

        // Link the car with the category
        await CarCategory.create({
            car_id: newCar._id,
            category_id: category._id
        });

        res.status(201).json({
            status: 'Success',
            message: 'Car added successfully.',
            data: {
                car: newCar,
                category: category.name
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err.message
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

        const { updateData, userEmail } = req.body;

        // Find the user by email to check if they are an admin
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        // Only allow admins to update car categories
        if (user.type !== "admin") {
            return res.status(403).json({
                status: 'Fail',
                message: 'Unauthorized: Only admins can update car'
            });
        }

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
            message: 'Car uodated successfully!',
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

        const { userEmail } = req.body;

        // Find the user by email to check if they are an admin
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        // Only allow admins to update car categories
        if (user.type !== "admin") {
            return res.status(403).json({
                status: 'Fail',
                message: 'Unauthorized: Only admins can update car'
            });
        }

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
            message: 'Car Delated successfully.',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err.message
        });
    }
};