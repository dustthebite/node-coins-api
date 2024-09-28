const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
        default: 0 //0 - user, 1 - admin, 2 - owner
    },
    possessions:{
        type: Array,
        required: true,
        default: [],
    },
    country:{
        type: String,
        required: true
    },
    dateChanged:{
        type: Date,
        required:true,
        default: Date.now
    } 
});

module.exports = mongoose.model("User", userSchema);