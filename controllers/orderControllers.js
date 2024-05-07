const Car = require('../models/carModels'); // Adjust the path as necessary
const Wallet = require('../models/walletModels');
const WalletHistory = require('../models/walletHistoryModels');
const Order = require('../models/orderModels'); // Assuming this is correctly set up

exports.orderCar = async (req, res) => {
    const { userId, carId, rentalStart, rentalEnd, total, note } = req.body;

    try {
        // Check car availability
        const car = await Car.findById(carId);
        if (!car || car.status !== "available") {
            return res.status(400).json({
                status: 'Fail',
                message: 'Car is not available'
            });
        }

        // Check user's wallet balance
        const wallet = await Wallet.findOne({ user_id: userId });
        if (!wallet || wallet.balance < total) {
            return res.status(400).json({
                status: 'Fail',
                message: 'Insufficient balance in wallet'
            });
        }

        // Create the order
        const newOrder = await Order.create({
            user_id: userId,
            car_id: carId,
            rentalStart,
            rentalEnd,
            status: 'booked',
            total,
            note
        });

        // Update the car's status to not available
        car.status = "unavailable";
        await car.save();

        // Deduct the total cost from the wallet and update the wallet history
        wallet.balance -= total;
        await wallet.save();

        await WalletHistory.create({
            wallet_id: wallet._id,
            order_id: newOrder._id,
            cost: total,
            transactionType: 'payment'
        });

        // Success response
        res.status(200).json({
            status: 'Success',
            message: 'Car booked successfully',
            data: {
                order: newOrder,
                walletBalance: wallet.balance
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Fail',
            message: 'Error booking car: ' + err.message
        });
    }
};