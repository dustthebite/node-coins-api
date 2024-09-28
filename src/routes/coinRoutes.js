const express = require("express")
const router = express.Router()
const Coin = require("../models/coinModel")
const User = require("../models/userModel")
const Wallet = require("../models/walletModel")
const Lot = require("../models/lotModel")
const Product = require("../models/productModel")
const coinController = require("../controllers/coinController");
const userController = require("../controllers/userController");
const tokenController = require("../controllers/tokenController");
const coinMiddleware = require("../middleware/coinMiddleware");
const tokenMiddleware = require("../middleware/tokenMiddleware");
const productMiddleware = require("../middleware/productMiddleware")
const lotMiddleware = require("../middleware/lotMiddleware")
const sorts = require("../utils/sortingFunctions")

//Coins

//get all
router.get("/coins", async (req, res) => {
    try{
        const coins = await Coin.find();
       res.json(coins)
    }catch(err){
        res.status(500).json({message: err.message});
    } 
})

//get all, sorted by some params
router.get("/coins/sort/:param", async (req, res) => {
    try{
        const coins = await Coin.find();
        var sortedCoins

        switch(req.params.param){
            case "name":
            sortedCoins = sorts.sortCoinsByName(coins)
            break
            case "currency":
            sortedCoins = sorts.sortCoinsByCurrency(coins)
            break
            case "nominal":
            sortedCoins = sorts.sortCoinsByNominal(coins)
            break
            case "country":
            sortedCoins = sorts.sortCoinsByCountry(coins)
            break
            case "material":
            sortedCoins = sorts.sortCoinsByMaterial(coins)
            break
            case "diameter":
            sortedCoins = sorts.sortCoinsByDiameter(coins)
            break
            default:
            sortedCoins = "Unknown parameter"
            break
        }
        

       res.json(sortedCoins)
    }catch(err){
        res.status(500).json({message: err.message});
    } 
})

//get 1
router.get("/coins/coin/:id", coinMiddleware.getCoin, async (req, res) => {
    res.json(res.coin); 
})

//add to owners collection
router.get("/coins/coin/:id/add-to-collection", [tokenMiddleware.authenticateToken, coinMiddleware.getCoin], async (req, res) => {
    const user = await User.findById(req.user.id)
    if(userController.isOwner(user.role)){
        coinController.addToCollection(user, res.coin)
        res.json(user)
    }
    else{
        res.json("You do not have permission to do this operation")
    }
})

//add to owners collection
router.get("/coins/coin/:id/remove-from-collection", [tokenMiddleware.authenticateToken, coinMiddleware.getCoin], async (req, res) => {
    const user = await User.findById(req.user.id)
    if(userController.isOwner(user.role)){
        coinController.removeFromCollection(user, res.coin)
        res.json(user)
    }
    else{
        res.json("You do not have permission to do this operation")
    }
})

//create
//
router.post("/coins/create", tokenMiddleware.authenticateToken,  async (req, res) => {
    const user = await User.findById(req.user.id);
    const coin = await coinController.createCoin(user.role, req.body);
    try{
        if(coin === false)
        return res.status(500).json("Access denied")
        const newCoin = await coin.save();
        res.status(201).json(newCoin);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

//update
router.patch("/coins/coin/:id/update", [tokenMiddleware.authenticateToken, coinMiddleware.getCoin], async (req, res) => {
    const user = await User.findById(req.user.id);
    const coin = await coinController.updateCoin(user.role, res.coin, req.body);
    try{
        if(coin === false)
        return res.status(500).json("Access denied")
        const updatedCoin = await coin.save();
        res.json(updatedCoin);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
})

//delete  
router.delete("/coins/coin/:id/delete", [tokenMiddleware.authenticateToken, coinMiddleware.getCoin], async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!userController.canModerate(user.role)) return res.status(400).json({message: "You do not have rights to delete coins"});
    try{
        if(coinController.deleteCoin(res.coin))
        res.json({message: 'Delete successful'});
        else
        res.json({message: 'Something went wrong'})
    }catch(err){
        res.status(500).json({message: err.message});
    }
})


//sell
router.post('/coins/coin/:id/sell', [tokenMiddleware.authenticateToken, coinMiddleware.getCoin], async (req,res) => {
    const user = await User.findById(req.user.id)
    try {
        if(coinController.isCoinInCollection(user, res.coin)){
           const prod = await coinController.sellCoin(user, res.coin, req.body)
           const newProd = await prod.save()
           res.send(newProd)
        }
        else
        res.send("Coin is not in collection")
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

//view all products
router.get('/coins/products', async (req, res) => {
    const prods = await Product.find()
    res.send(prods)
})

//all products sorted by price
router.get('/coins/products/sort/price', async (req, res) => {
    const prods = await Product.find()
    var sortedProducts = sorts.sortProductsByPrice(prods)
    res.send(sortedProducts)
})

//all products that feature some coin
router.get('/coins/products/coin/:id', async (req, res) => {
    const prods = await Product.find({coin_id: req.params.id})
    res.send(prods)
})

//view product
router.get('/coins/products/:id', [productMiddleware.getProduct], async (req, res) => {
    res.send(res.product)
})

//buy product
router.post('/coins/products/:id/buy', [tokenMiddleware.authenticateToken, productMiddleware.getProduct], async (req,res) => {
    const user = await User.findById(req.user.id)
    const seller = await User.findById(res.product.user_id)
    const userWallet = await Wallet.findOne({user_id: req.user.id})
    const sellerWallet = await Wallet.findOne({user_id: res.product.user_id})
    const coin = await Coin.findOne({_id: res.product.coin_id})
    try {
        const deal = await coinController.buyCoin(user, userWallet, seller, sellerWallet, coin, res.product.price)
        if(deal == false)
        res.status(500).json("Error of deal")
        else{
            await res.product.remove()
            res.send(deal)
        }
        
    }catch(err){
        res.status(500).json({message: err.message});
    }
})
//delete product
router.delete('/coins/products/:id', [tokenMiddleware.authenticateToken, productMiddleware.getProduct], async (req, res) => {
    const user = await User.findById(req.user.id);
    if(!userController.canModerate(user.role) || user._id != res.product.user_id) return res.status(500).json({message: "You do not have rights for this action"});
    try{
        await res.product.remove();
        res.json({message: 'Delete successful'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})
//view all lots
router.get("/coins/lots", async (req, res) => {
    try{
        const lots = await Lot.find();
        res.json(lots)
    }catch(err){
        res.status(500).json({message: err.message});
    } 
})

//view all lots sorted by some parameter
router.get("/coins/lots/sort/:param", async (req, res) => {
    try{
        const lots = await Lot.find();
        var sortedLots
        switch(req.params.param){
            case "start-price":
            sortedLots = sorts.sortLotsByStartPrice(lots)
            break
            case "current-price":
            sortedLots = sorts.sortLotsByCurrentPrice(lots)
            break
            default:
            sortedLots = "Unknown parameter"
            break
        }
        res.json(sortedLots)
    }catch(err){
        res.status(500).json({message: err.message});
    } 
})

//view all lots that feature some coin
router.get("/coins/lots/coin/:id", async (req, res) => {
    try{
        const lots = await Lot.find({coin_id: req.params.id});
        res.json(lots)
    }catch(err){
        res.status(500).json({message: err.message});
    } 
})

//view lot
router.get('/coins/lots/:id', lotMiddleware.getLot, async (req,res) => {
    res.send(res.lot)
})
//create lot
router.post('/coins/coin/:id/create-lot', [tokenMiddleware.authenticateToken, coinMiddleware.getCoin], async (req, res) => {
    const user = await User.findById(req.user.id)
    try{
        if(coinController.isCoinInCollection(user, res.coin)){
            const lot = await coinController.createLot(user, res.coin, req.body)
            const newLot = await lot.save()
            res.send(newLot)
        }
        else
        res.send("Coin is not in collection")
    }catch(err){
        res.status(500).json({message: err.message});
    }
})
//delete lot
router.delete('/coins/lots/:id', [tokenMiddleware.authenticateToken, lotMiddleware.getLot], async (req,res) =>{
    const user = await User.findById(req.user.id);
    if(!userController.canModerate(user.role) || user._id != res.lot.seller_id) return res.status(400).json({message: "You do not have rights for this action"});
    try{
        await res.lot.remove();
        res.json({message: 'Delete successful'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

//make an offer
router.post('/coins/lots/:id/make-an-offer', [tokenMiddleware.authenticateToken, lotMiddleware.getLot], async (req, res) => {
    const user = await User.findById(req.user.id)
    const userWallet = await Wallet.findOne({user_id: req.user.id})

    try{
        const offer = await coinController.makeAnOffer(user, userWallet, res.lot, req.body.price)
        res.send(offer)
    }catch(err){
        res.status(500).json({message: err.message});
    }
})
//sell lot
router.get('/coins/lots/:id/sell', [tokenMiddleware.authenticateToken, lotMiddleware.getLot], async (req,res) => {
    if(res.lot.potential_buyer_id == "nobody") res.json("You cannot sell this lot!")
    else{
    const user = await User.findById(req.user.id)
    const buyer = await User.findById(res.lot.potential_buyer_id)
    const userWallet = await Wallet.findOne({user_id: user._id})
    const buyerWallet = await Wallet.findOne({user_id: res.lot.potential_buyer_id})
    const coin = await Coin.findOne({_id: res.lot.coin_id})
    try {

        if(user._id == res.lot.seller_id){
            const deal = await coinController.buyCoin(buyer, buyerWallet,user, userWallet,coin, res.lot.current_price)
            if(deal == false)
            res.status(500).json("Error of deal")
            else{
            await res.lot.remove()
            res.send(deal)
        }}
        else{
            res.status(500).json("You are not the seller")
        }
        
    }catch(err){
        res.status(500).json({message: err.message});
    }
}
})

module.exports = router;