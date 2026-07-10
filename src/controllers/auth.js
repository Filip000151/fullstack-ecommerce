const {StatusCodes} = require('http-status-codes');
const authService = require('../services/authService');
const crypto = require('crypto');
const { UnauthorizedError } = require('../errors');

const register = async (req, res) => {
    const {name, email, password, confirmPassword, role} = req.body;
    const {role: userRole} = req.user;
    
    const user = await authService.registerUser({name, email, password, confirmPassword, role}, userRole);

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'User registered.'
    });
};

const login = async (req, res) => {
    const {email, password, rememberMe} = req.body;
    const deviceInfo = req.headers['user-agent'] || 'Unknown';

    const tokens = await authService.loginUser(email, password, rememberMe, deviceInfo);
    
    if(tokens.refreshToken){
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            //secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }

    res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        //secure: true,
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined
    });

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: `Successfully logged in.`
    });

};

const logout = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    
    if(refreshToken){
        await authService.logoutUser(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: `User ${req.user.name} logged out.`
    });
};

const getCurrentUser = async (req, res) => {
    const {userId, isGuest} = req.user;
    const result = await authService.getCurrentUser(userId, isGuest);
    return res.status(StatusCodes.OK).json({
        success: true,
        isGuest: result.isGuest,
        user: result.user
    });
}

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    const deviceInfo = req.headers['user-agent'] || 'Unknown';

    if(!refreshToken){
        res.clearCookie('accessToken');
        throw new UnauthorizedError('Session expired. Please log in again.', 'TOKEN_MISSING');
    }

    const tokens = await authService.refreshUserToken(refreshToken, deviceInfo);

    res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(StatusCodes.OK).json({
        success: true,
        msg: 'Access token refreshed'
    });
};

const requestGuestId = async (req, res) => {
    let {guestId} = req.body;
    
    const isValid = await authService.validateGuestId(guestId);
    
    if(!isValid){
        guestId = 'guest_' + crypto.randomUUID();
    }

    res.cookie('guestId', guestId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(StatusCodes.OK).json({
        success: true,
        guestId
    });
};

module.exports = {
    register,
    login,
    logout,
    getCurrentUser,
    refreshAccessToken,
    requestGuestId
};