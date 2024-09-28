const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    coin_id:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    price:{
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

module.exports = mongoose.model('Product', productSchema)