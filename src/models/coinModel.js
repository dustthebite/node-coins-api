const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    currency:{
        type: String,
        required: true
    },
    nominal:{
        type: Number,
        required: true,
        default: 0
    },
    country:{
        type: String,
        required: true,
        default: "---"
    },
    material:{
        type: String,
        required: true
    },
    diameter:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    dateChanged:{
        type: Date,
        required:true,
        default: Date.now
    } 
}

);

module.exports = mongoose.model('Coin', coinSchema);