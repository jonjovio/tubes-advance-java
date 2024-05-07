const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletControllers'); // Adjust path as necessary

router
.route('/topupMoney')
.post(walletController.topupMoney);

router
.route('/walletHistory/:email')
.get(walletController.getWalletHistory);

module.exports = router;