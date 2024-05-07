const mongoose = require('mongoose');

const walletHistorySchema = new mongoose.Schema({
    wallet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false  // This field is optional; it won't be included for top-up transactions.
    },
    cost: {
        type: Number,
        required: true
    },
    transactionType: {  // 'topup' or 'payment'
        type: String,
        required: true,
        enum: ['topup', 'payment']  // Ensures the transaction type is one of the specified values
    }
});

const WalletHistory = mongoose.model('WalletHistory', walletHistorySchema);

module.exports = WalletHistory;
