const mongoose = require("mongoose")

const _ = new mongoose.Schema({
    lot_id:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Offer', _)