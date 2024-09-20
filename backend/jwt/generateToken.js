const jwt = require('jsonwebtoken');

const createTokenandSaveCookie = (id, res) => {
    const token =  jwt.sign({id}, process.env.JWT_TOKEN, {
        expiresIn: '1d'
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production only
        sameSite: "strict",  // CSRF protection
    })


    return token;
}

module.exports = createTokenandSaveCookie;
