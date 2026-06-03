const mongoose = require('mongoose');

const RefreshTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    revoked: {
        type: Boolean,
        default: false
    },
    deviceInfo: {
        type: String,
        default: 'Unknown device'
    }
}, {
    timestamps: true
});

RefreshTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);