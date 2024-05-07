const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: [true, 'A user must have name'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'A user must have email'],
        unique: true
    },
    no_telp: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'A user must have password']
    },
    alamat: {
        type: String
    },
    gender: {
        type: Number,
        default: 0
    },
    type: {
        type: String,
        default: "user"
    }
});

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }

        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);

module.exports = User;