const User = require('../models/userModels');
const Wallet = require('../models/walletModels'); // Adjust the path as necessary
const WalletHistory = require('../models/walletHistoryModels');
const mongoose = require('mongoose'); 

exports.topupMoney = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { email, amount, note = '' } = req.body;

        // Find the user by email to get the user ID
        const user = await User.findOne({ email: email });
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        // Find the wallet associated with the user
        const wallet = await Wallet.findOne({ user_id: user._id }).session(session);
        if (!wallet) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'Fail',
                message: 'Wallet not found for this user'
            });
        }

        // Update the wallet's balance
        wallet.balance += amount;
        await wallet.save();

        // Add the transaction to the wallet history
        await WalletHistory.create([{
            wallet_id: wallet._id,
            cost: amount,
            transactionType: 'topup',
            note: note
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            status: 'Success',
            message: 'Topup successfully',
            data: {
                wallet: wallet,
                user: user.email
            }
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({
            status: 'Fail',
            message: 'Error during wallet top-up: ' + err.message
        });
    }
};


exports.getWalletHistory = async (req, res) => {
    try {
        const { email } = req.params; // Email is passed as a URL parameter

        // Find the user by email to get the user ID
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            });
        }

        // Find the wallet associated with the user
        const wallet = await Wallet.findOne({ user_id: user._id }).exec();
        if (!wallet) {
            return res.status(404).json({
                status: 'Fail',
                message: 'Wallet not found for this user'
            });
        }

        // Fetch the transaction history from the wallet history table
        const history = await WalletHistory.find({ wallet_id: wallet._id })
                                            .populate('order_id', 'total status') // Optionally populate order details
                                            .exec();

        res.status(200).json({
            status: 'Success',
            data: {
                name: user.name, // Assuming user has a 'name' field
                walletHistory: history
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Fail',
            message: 'Error retrieving wallet history: ' + err.message
        });
    }
};