const User = require('./../models/userModels');
const Category = require('../models/categoryModels');
const CarCategory = require('../models/carCategoryModels');

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        console.log("Queried categories:", categories);  // Check the output directly after the query

        if (!categories.length) {
            console.log("No categories found in the database.");
            return res.status(404).json({
                status: 'Fail',
                message: 'No categories found'
            });
        }

        res.status(200).json({
            status: 'Success',
            result: categories.length,
            data: {
                categories
            }
        });
    } catch(err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({
            status: 'Fail',
            message: err.message
        });
    }
};

exports.addCategory = async (req, res) => {
    try {

        const { categoryName, userEmail } = req.body;

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

        // Check if category already exists to avoid duplicates
        const existingCategory = await Category.findOne({ categoryName });
        if (existingCategory) {
            return res.status(409).json({
                status: 'Fail',
                message: 'Category already exists'
            });
        }

        // Create a new category if it does not exist
        const newCategory = await Category.create({ categoryName });
        res.status(201).json({
            status: 'Success',
            message: 'Category added successfully',
            data: {
                category: newCategory
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: 'Error adding category: ' + err.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryName } = req.params; // Extract category name from URL parameters

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

        // Find the category by name
        const category = await Category.findOne({ categoryName: categoryName });
        if (!category) {
            return res.status(404).json({
                status: 'Fail',
                message: 'No category found with that name'
            });
        }

        // Check if any cars are still associated with this category
        const existingAssociation = await CarCategory.findOne({ category_id: category._id });
        if (existingAssociation) {
            return res.status(400).json({
                status: 'Fail',
                message: 'Cannot delete category because it is still associated with one or more cars'
            });
        }

        // If no cars are associated, proceed to delete the category
        await Category.findByIdAndDelete(category._id);

        res.status(200).json({ 
            status: 'Success',
            message: 'Category delated successfully',
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: 'Fail',
            message: err.message
        });
    }
};