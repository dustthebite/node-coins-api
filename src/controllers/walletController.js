const Coin = require("../models/coinModel");
const userController = require("../controllers/userController");
const Product = require("../models/productModel")
const User = require("../models/userModel");
const Wallet = require("../models/walletModel")

async function createWallet(user){
    const wallet = new Wallet({
        user_id: user._id
    })

    return wallet
}

async function addToBalance(wallet, money){
    if(wallet == null)  return false
    if(money < 0) return false
    wallet.balance += money
    return wallet
}

async function removeFromBalance(wallet, money){
    if(wallet == null)  return false
    wallet.balance -= money
    return wallet
}

module.exports = {createWallet, addToBalance, removeFromBalance}