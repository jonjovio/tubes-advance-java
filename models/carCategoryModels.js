const mongoose = require('mongoose');

const carCategorySchema = new mongoose.Schema({
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const CarCategory = mongoose.model('CarCategory', carCategorySchema);

module.exports = CarCategory;