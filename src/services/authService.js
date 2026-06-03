const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const {BadRequestError, UnauthorizedError} = require('../errors');

class AuthService{
    async registerUser(data, userRole){
        if(data.password !== data.confirmPassword){
            throw new BadRequestError('Passwords do not match.');
        }

        let user;

        if(userRole === 'admin'){
            user = await User.create({
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            });
        }
        else{
            user = await User.create({
                name: data.name,
                email: data.email,
                password: data.password
            });
        }

        return user;
    }

    async loginUser(email, password, deviceInfo){
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

        const refreshToken = await user.createRefreshToken(deviceInfo);
        const accessToken = user.createAccessToken();

        return {refreshToken, accessToken};
    }

    async logoutUser(refreshToken){
        await RefreshToken.findOneAndUpdate(
            {token: refreshToken},
            {revoked: true}
        );
    }

    async getLoggedUser(userId){
        const user = await User.findById(userId).select('-password');
        return user;
    }

    async refreshUserToken(refreshToken, deviceInfo){
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

        const newRefreshToken = await user.createRefreshToken(deviceInfo);
        storedToken.revoked = true;
        await storedToken.save();

        const newAccessToken = user.createAccessToken();

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }
}


module.exports = new AuthService();