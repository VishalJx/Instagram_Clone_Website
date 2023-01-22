const jwt = require('jsonwebtoken');
const {jwt_secret} = require('../keys');
const mongoose = require('mongoose');
const USER = mongoose.model('USER');

module.exports=(req,resp,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return resp.status(401).json({error:"You must have logged in-1"})
    }
    const token = authorization
    jwt.verify(token,jwt_secret,(err,payload)=>{
        if(err){
            return resp.status(401).json({error:"You must have logged in-2"})
        }
        const{ _id } = payload
        USER.findById(_id).then(userData=>{
            req.user=userData;
            next()//used to first run the middleware and then the rest of the function.
        })

    })
}