const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    rentalStart: {
        type: String,
        required: true
    },
    rentalEnd: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    note: {
        type: String
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
