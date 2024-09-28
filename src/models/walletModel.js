const mongoose = require("mongoose")

const walletSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    balance:{
        type: Number,
        required: true,
        default: 0
    },
    dateChanged:{
        type: Date,
        required:true,
        default: Date.now
    }
})

module.exports = mongoose.model('Wallet', walletSchema)