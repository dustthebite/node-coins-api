const express = require("express");
const router = express.Router();
const Coin = require("../models/coinModel");
const User = require("../models/userModel");
const coinController = require("../controllers/coinController");
const userController = require("../controllers/userController");
const tokenController = require("../controllers/tokenController");
const coinMiddleware = require("../middleware/coinMiddleware");
const tokenMiddleware = require("../middleware/tokenMiddleware");
const walletController = require("../controllers/walletController");
const Wallet = require("../models/walletModel")
let refreshTokens = [];
//User routes
class FilteredUser{
    constructor(user_id, user_name, country, role, possessions)
    {
        this._id = user_id;
        this.user_name = user_name;
        this.country = country;
        this.role = role;
        this.possessions = possessions
    }
}
//get all
router.get("/users", async (req, res) => {
    try{
        const users = await User.find();
        var filteredUsers = []
        for(let i = 0; i < users.length; i++){
            filteredUsers[i] = new FilteredUser(users[i]._id, users[i].name, users[i].country,users[i].role,users[i].possessions)
        }
        res.json({
            filteredUsers
        });
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

//get user
router.get("/users/user/:_id", async (req, res) => {
    const user = await User.findById(req.params._id);
    res.json(user)
})

//get current user 
router.get("/users/current-user", tokenMiddleware.authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user)
})


//register
router.post("/users/register", async (req, res) => {
    const user = await userController.registerUser(req.body);
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

//login
router.post("/users/login", async (req, res) => {
    try{
        const tokens = await userController.loginUser(req.body, refreshTokens);
        res.json({accessToken: tokens.accessToken, refreshToken:tokens.refreshToken , message: "Login successful"});
     }catch(err){
         res.status(500).json({message: err.message});
     }
})

//logout
router.delete("/users/logout", async (req, res) => {
    try{
        refreshTokens = await userController.logoutUser(refreshTokens, req.body.accessToken);  // was refresh token before
        res.status(200).json({message: "Logout successful"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

//update
router.patch("/users/:id",  async (req, res) => {
    const user = await User.findById(req.user.id);
    await userController.updateUser(user,req.body);
    try{
        const updatedUser = await user.save();
        res.json(updatedUser);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})
//get collection
router.get("/users/:id/collection",tokenMiddleware.authenticateToken, async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user.possessions)
})

//my collection
router.get("/users/my-collection",tokenMiddleware.authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user.possessions)
})

//refresh token
router.post("/users/token", async (req, res) => {
    await tokenController.refreshToken(req, res, refreshTokens);
})

//change role
router.patch("/users/user/:id/change-role", tokenMiddleware.authenticateToken,  async (req, res) => {
    const user = await userController.changeRole(req.user.id, req.params.id,req.body.role);
    try{
        if(user.role != false){
            const updatedUser = await user.save();
            res.json(updatedUser);
        }
        else
        res.send("Error of changing role")
    }catch(err){
        res.json({message: err.message});
    }
})

//create the wallet
router.post("/users/wallet/create", tokenMiddleware.authenticateToken, async(req, res) => {
    const user = await User.findById(req.user.id);
    const check = await Wallet.findOne({user_id: user._id})
    try{
        if(check != null) res.send("You already have a wallet")
        else{
        const wallet = await walletController.createWallet(user)
        wallet.save()
        res.send(wallet)}
    }catch(err){
        res.json({message: err.message});
    }
})


router.get("/users/wallet", tokenMiddleware.authenticateToken, async(req, res) => {
    const user = await User.findById(req.user.id)
    try{
        const wallet = await Wallet.findOne({user_id: user._id})
        if(wallet == null)
        res.send("Wallet not found")
        else{
            if(wallet.user_id == req.user.id)
            res.send(wallet)
            else
            res.send("Looks like you dont have a wallet")
        }
        
    }catch(err){
        res.json({message: err.message})
    }
})

//add to balance
router.post("/users/wallet/add-to-balance", tokenMiddleware.authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    try{
        const wallet = await Wallet.findOne({user_id: user._id})
        if(wallet != null){
            await walletController.addToBalance(wallet, req.body.money)
            const newWallet = await wallet.save()
            res.send(newWallet).json()
        }
        else{
            res.send("You dont have a wallet. Wanna make it?")
        }
        
        //res.send(wallet.balance.toString())
    }catch(err){
        res.json({message: err.message});
    }
})

//remove from balance
router.post("/users/wallet/remove-from-balance", tokenMiddleware.authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    try{
        const wallet = await Wallet.findOne({user_id: user._id})
        if(wallet != null){
            await walletController.removeFromBalance(wallet, req.body.money)
            const newWallet = await wallet.save()
            res.send(newWallet).json()
        }
        else{
            res.send("You dont have a wallet. Wanna make it?")
        }
        //res.send(wallet.balance.toString())
    }catch(err){
        res.json({message: err.message});
    }
})


module.exports = router;