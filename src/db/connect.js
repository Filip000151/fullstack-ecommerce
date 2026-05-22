const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url);
};

module.exports = connectDB;