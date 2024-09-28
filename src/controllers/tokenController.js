const jwt = require("jsonwebtoken");
function generateAccessToken(user, secret){
    return jwt.sign({id: user._id}, secret, {expiresIn: '24h'});
}

function generateRefreshToken(user, secret){
    return jwt.sign({id: user._id}, secret);
}

async function refreshToken(req, res, refreshTokens) {
    const refreshToken = req.body.refreshToken;
    if(refreshToken == null) return res.status(400).json({message: "No refresh token provided"});
    if(!refreshTokens.includes(refreshToken)) return res.status(400).json({refreshTokens:refreshTokens,message: "Cannot find refresh token"});
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if(err) return res.status(400).json({message: "Invalid refresh token"});

        const accessToken = generateAccessToken({id: user._id});
        res.json({accessToken: accessToken});
    })
}

module.exports = {generateAccessToken, generateRefreshToken, refreshToken};