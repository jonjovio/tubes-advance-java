const express = require('express');

const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const walletRoutes = require('./routes/walletRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/order', orderRoutes);

module.exports = app;