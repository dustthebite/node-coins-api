const mongoose = require("mongoose")

const lotSchema = new mongoose.Schema({
    coin_id:{
        type: String,
        required: true
    },
    seller_id:{
        type: String,
        required: true
    },
    potential_buyer_id:{
        type: String,
        required: true,
        default: "nobody"
    },
    start_price:{
        type: Number,
        required: true
    },
    current_price:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        default: "no description"
    },
    dateChanged:{
        type: Date,
        required:true,
        default: Date.now
    }
})

module.exports = mongoose.model('Lot', lotSchema)