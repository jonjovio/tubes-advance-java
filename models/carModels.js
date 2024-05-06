const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    merk: {
        type: String,
        required: [true, 'A user must have name']
    },
    model: {
        type: String,
        required: [true, 'A car must have model'],
        unique: true
    },
    color: {
        type: String
    },
    capacity: {
        type: Number,
        required: [true, 'A car must have capacity']
    },
    price_per_day: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "unavailable"
    }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;