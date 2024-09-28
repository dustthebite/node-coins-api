const Product = require('../models/productModel')

async function getProduct(req, res, next){
    let prod
    try{
        prod = await Product.findById(req.params.id)
        if(!prod){
            return res.status(404).json({message: "Cannot find product"}); 
        }
    }catch(err){
        return res.send("error with finding, maybe it does'nt exist?")
    }

    res.product = prod
    next()
}

module.exports = {getProduct}