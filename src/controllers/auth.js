const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const {BadRequestError, UnauthorizedError} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const register = async (req, res) => {
    const {name, email, password, confirmPassword} = req.body;
    if(password !== confirmPassword){
        throw new BadRequestError('Passwords do not match.');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'User registered.'
    });
};

const adminRegister = async (req, res) => {
    const {name, email, password, confirmPassword, role} = req.body;
    if(password !== confirmPassword){
        throw new BadRequestError('Passwords do not match.');
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'User registered.'
    });
}

const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please enter email and password');
    }

    const user = await User.findOne({email});
    if(!user){
        throw new BadRequestError('User does not exist.');
    }

    const passwordVerified = await user.verifyPassword(password);
    if(!passwordVerified){
        throw new UnauthorizedError('Invalid credentials.');
    }

    const deviceInfo = req.headers['user-agent'] || 'Unknown';
    const token = await user.createRefreshToken(deviceInfo);
    res.cookie('refreshToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        //secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    const accessToken = user.createAccessToken();

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        //secure: true,
        maxAge: 15 * 60 * 1000
    });

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: `User ${user.name} is logged in.`
    });

};

const logout = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if(refreshToken){
        await RefreshToken.findOneAndUpdate(
            {token: refreshToken},
            {revoked: true}
        );
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: `User ${req.user.name} logged out.`
    });
};

const getLoggedUser = async (req, res) => {
    const {userId} = req.user;
    const user = await User.findById(userId).select('-password');
    return res.status(StatusCodes.OK).json({
        success: true,
        user
    });
}

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken){
        throw new UnauthorizedError('No active session, please log in.');
    }

    const storedToken = await RefreshToken.findOne({
        token: refreshToken,
        expiresAt: {$gt: new Date()}
    });

    if(!storedToken){
        throw new UnauthorizedError('Invalid or expired refresh token.');
    }
    if(storedToken.revoked === true){
        throw new UnauthorizedError('Attempted account breach detected!', 'IDENTITY_THEFT');
    }

    const user = await User.findById(storedToken.userId);

    const deviceInfo = req.headers['user-agent'] || 'Unknown';

    const newRefreshToken = await user.createRefreshToken(deviceInfo);
    storedToken.revoked = true;
    await storedToken.save();

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        //secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    const newAccessToken = user.createAccessToken();

    res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
    });

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Access token refreshed'
    });
};

module.exports = {
    register,
    login,
    logout,
    getLoggedUser,
    adminRegister,
    refreshAccessToken
};