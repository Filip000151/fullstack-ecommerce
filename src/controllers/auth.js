const User = require('../models/user');
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
        msg: 'User registered.',
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
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
        msg: 'User registered.',
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
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

    const accessToken = user.createAccessToken();

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        //secure: true,
        maxAge: 15 * 60 * 1000
    });

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: `User ${user.name} is logged in.`,
        user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });

};

const logout = (req, res) => {
    res.clearCookie('accessToken');
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

module.exports = {
    register,
    login,
    logout,
    getLoggedUser,
    adminRegister
};