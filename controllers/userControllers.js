const User = require('./../models/userModels');

exports.createUser = async (req, res) => {
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