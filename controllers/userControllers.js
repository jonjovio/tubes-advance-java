const User = require('./../models/userModels');
const Wallet = require('./../models/walletModels');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);

        // Check if the new user is a regular user and not an admin
        if (newUser.type === "user") {
            // Create a wallet for the new regular user
            const newWallet = await Wallet.create({
                user_id: newUser._id,
                balance: 0  // Initial balance set to 0
            });

            res.status(201).json({
                status: 'Success',
                data: {
                    user: newUser,
                    wallet: newWallet
                }
            });
        } else if (newUser.type === "admin") {
            // If the user is an admin, return success without creating a wallet
            res.status(201).json({
                status: 'Success',
                message: 'User registered successfully',
                data: {
                    user: newUser
                }
            });
        } else {
            // If userType is neither "user" nor "admin", handle the unexpected type
            res.status(400).json({
                status: 'Fail',
                message: 'Invalid user type specified!'
            });
        }
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({
                status: 'Fail',
                message: 'Duplicate entry, the user already exists!'
            });
        } else {
            res.status(400).json({
                status: 'Fail',
                message: 'Invalid data sent!',
                error: err.message
            });
        }
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
            message: 'User Updated successfully',
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