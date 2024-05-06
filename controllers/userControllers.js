const User = require('./../models/userModels');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try{
        const newUser = await User.create(req.body);

        res.status(201).json({
            status: 'Success',
            data: {
                user: newUser
            }
        });
    }catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: 'Invalid data sent!',
            error: err.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(201).json({
            status: 'Success',
            result: users.length,
            data: {
                users
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'Fail!',
            messsage: 'Invalid data sent!'
        });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 'Fail',
                message: 'Please provide email and password!'
            });
        }

        // Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'Fail',
                message: 'Incorrect email or password'
            });
        }

        // Send token to client (Consider using JWT for generating a token)
        res.status(200).json({
            status: 'Success',
            message: 'Logged in successfully!'
            // token: 'Here the token should be sent'
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err.message
        });
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = req.body;

        // Find the user by ID and update the provided fields
        const user = await User.findOneAndUpdate({ email: email }, updateData, {
            new: true, // Return the updated user document
            runValidators: true // Ensure that updates meet schema requirements
        });

        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'No user found with that ID'
            });
        }

        res.status(200).json({
            status: 'Success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Fail',
            message: err.message
        });
    }
};