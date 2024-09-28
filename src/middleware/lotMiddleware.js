const Lot = require('../models/lotModel')

async function getLot(req,res,next){
    let lot
    try{
        lot = await Lot.findById(req.params.id)
        if(!lot){
            return res.status(404).json({message: "Cannot find lot"})
        }
    }catch(err){
        return res.send("error with finding, maybe it does'nt exist?")
    }

    res.lot = lot
    next()
}

module.exports ={getLot}