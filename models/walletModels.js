const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0  // Default balance can be set to 0 or any initial amount you choose
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true  // Ensures one wallet per user
    }
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;