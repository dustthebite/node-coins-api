const Coin = require("../models/coinModel");

async function getCoin(req, res, next) {
    let coin;
    try{
        coin = await Coin.findById(req.params.id);
        if(!coin){
            return res.status(404).json({message: "Cannot find coin"});
        }
    }catch(err){
        return res.send("error with finding, maybe it does'nt exist?");
    }

    res.coin = coin;
    next();
}

module.exports = {getCoin};