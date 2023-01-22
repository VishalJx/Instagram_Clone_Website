const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{type:ObjectId, ref:"USER"}],
    following:[{type:ObjectId, ref:"USER"}],
    
    Photo:{
        type:String,
    },
});
module.exports = mongoose.model('USER',userSchema)