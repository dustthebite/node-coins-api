const User = require("../models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const tokenController = require("../controllers/tokenController");

async function registerUser(userParams){
    if(!validator.isEmail(userParams.email)) return false;
    const user = new User({
        email: userParams.email,
        password: await bcrypt.hash(userParams.password, await bcrypt.genSalt()),
        name: userParams.name,
        country: userParams.country
    });
    return user;
}


async function loginUser(userParams, refreshTokens){
    const user = await User.findOne({email: userParams.email});

    if(user == null){
        return false;
    } 
    if(await bcrypt.compare(userParams.password, user.password)) {
        const accessToken =  tokenController.generateAccessToken(user, process.env.JWT_SECRET);
        const refreshToken = tokenController.generateRefreshToken(user, process.env.JWT_REFRESH_SECRET);
        refreshTokens.push(refreshToken);
        return {accessToken, refreshToken};
            
    }else{
        return false;
    }

}

async function logoutUser(refreshTokens, tokenToDelete){
    refreshTokens = refreshTokens.filter(token => token!== tokenToDelete);
    return refreshTokens;
}


async function updateUser(user,updateParams){
    if(updateParams.name != null){
        user.name = updateParams.name;
    }
    if(updateParams.country!= null){
        user.country = updateParams.country;
    }
    if(updateParams.contacts != null){
        user.contacts = updateParams.contacts;
    }
    user.dateChanged = Date.now();
    return user;
}

function canModerate(role){
    if(role >= 1) return true;
    return false;
}

function isOwner(role){
    if(role === 2) return true;
    return false;
}

async function changeRole(ownerId,userId,role){
    const owner = await User.findById(ownerId);
    const user = await User.findById(userId);

    if(!isOwner(owner.role)) return false;
    if(role < 0 || role > 1) return false;

    user.role = role;
    return user;
}

module.exports = {registerUser, loginUser, logoutUser, updateUser, changeRole, canModerate, isOwner};