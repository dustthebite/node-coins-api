const Coin = require("../models/coinModel");
const userController = require("../controllers/userController");
const walletController = require("../controllers/walletController")
const Product = require("../models/productModel")
const Wallet = require("../models/walletModel")
const Lot = require("../models/lotModel")
const Offer = require("../models/offerModel")
const User = require("../models/userModel")

async function createCoin(role, coinToCreate) {
    if(userController.canModerate(role) == false) return false; 

    const coin = new Coin({
        name: coinToCreate.name,
        currency: coinToCreate.currency,
        nominal: coinToCreate.nominal,
        country: coinToCreate.country,
        material: coinToCreate.material,
        diameter: coinToCreate.diameter,
        description: coinToCreate.description
    });

    const user = await User.findOne({email: "owner@gmail.com"})
    user.possessions.push(coin._id)
    await user.save()
    return coin;

}

async function updateCoin(role, coinToUpdate, updateParams) {
    if(!userController.canModerate(role)) return false; 

    if(updateParams.name!= null){
        coinToUpdate.name = updateParams.name;
    }
    if(updateParams.currency!= null){
        coinToUpdate.currency = updateParams.currency;
    }
    if(updateParams.nominal!= null){
        coinToUpdate.nominal = updateParams.nominal;
    }
    if(updateParams.country!= null){
        coinToUpdate.country = updateParams.country;
    }
    if(updateParams.material!= null){
        coinToUpdate.material = updateParams.material;
    }
    if(updateParams.diameter!= null){
        coinToUpdate.diameter = updateParams.diameter;
    }
    if(updateParams.description!= null){
        coinToUpdate.description = updateParams.description;
    }
    coinToUpdate.dateChanged = Date.now();
    return coinToUpdate;
}

async function deleteCoin(coin){
    
    const users = await User.find()
    users.forEach(user => {
        if (isCoinInCollection(user,coin)){
            removeFromCollection(user,coin)
        }
    });

    //await coin.remove()

    return true
}

async function addToCollection(user, coin){
    user.possessions.push(coin._id);
    await user.save()
    return true;
}

async function removeFromCollection(user,coin){
    //user.possessions = user.possessions.filter(possession => possession.toString() !== coin._id.toString())
    const isLargeNumber = (element) => element == coin._id.toString()
    
    user.possessions.splice(user.possessions.findIndex(isLargeNumber), 1)

    await user.save()
    return true

}

function isCoinInCollection(user,coin){
    var found = user.possessions.filter((item) => {return item.toString() == coin._id.toString()})
    
    if(found.length > 0)
        return true
        
    return false
}

async function sellCoin(user, coin, params){

    if(params.price <= 0) return false

    const prod = new Product({
        coin_id: coin._id,
        user_id: user._id, 
        price: params.price,
        description: params.description
    })

    return prod
}

async function buyCoin(buyer, buyerWallet, seller, sellerWallet, coin, price){
    if(buyerWallet.balance < price || coin == null)
    return false
    buyerWallet = await walletController.removeFromBalance(buyerWallet, price)
    sellerWallet = await walletController.addToBalance(sellerWallet, price)
    addToCollection(buyer,coin)
    removeFromCollection(seller, coin)
    //await buyer.save()
    //await seller.save()
    await buyerWallet.save()
    await sellerWallet.save()
    return {buyerWallet, sellerWallet}
}

async function createLot(user,coin,params){

    if(params.price <= 0) return false

    const lot = new Lot({
        coin_id: coin._id,
        seller_id: user._id,
        start_price: params.start_price,
        current_price: params.start_price,
        description: params.description
    })

    return lot
}

async function makeAnOffer(user, wallet, lot, price){
    if(wallet.balance < price) return "Your balance is lower then offer"
    if(price <= lot.current_price) return "Your current offer is too low"

    const offer = new Offer({
        lot_id: lot._id,
        user_id: user._id,
        price: price
    })
    lot.current_price = price
    lot.potential_buyer_id = user._id
    await lot.save()
    await offer.save()
    return offer
}
module.exports = {createCoin, updateCoin, addToCollection, removeFromCollection, isCoinInCollection, sellCoin, buyCoin, createLot, makeAnOffer, deleteCoin};