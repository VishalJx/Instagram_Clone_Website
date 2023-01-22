const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const USER = mongoose.model('USER');
const jwt = require('jsonwebtoken');
const {jwt_secret} = require('./keys');
const requireLogin = require('./middleware/requireLogin');


router.post('/signup',(req,resp)=>{
    const {email,name,username,password} = req.body;
    if(!email || !name || !username || !password){
        resp.status(422).json({error:"Please add all the fields !!"});
    }
    /*To check for single paramter email:-*/
    // USER.findOne({email:email}).then((savedUser)=>{      //in email:email => 1st email is DB schema and 2nd email is our received email.

    /*To check for multiple paramters:- */
    USER.findOne({$or:[{email:email},{username:username}]}).then((savedUser)=>{
        if(savedUser){      //if found then return random (here return parameter savedUser)
            return resp.status(422).json({error:"User already exists"})
        }
        bcrypt.hash(password,12).then((hashedPassword)=>{
            const user = new USER({
                email,
                name,
                username,
                password:hashedPassword
            });
            user.save()
            .then(user=>{resp.json({message:"Registered Successfully"})})
            .catch(err=>{console.log(err)})
        })

    })
});

router.post('/signin',(req,resp)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return resp.status(422).json({error:"Please fill all data"})
    }
    USER.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return resp.status(422).json({error:"Invalid email"})
        }
        bcrypt.compare(password,savedUser.password).
        then((match)=>{
            if(match){
                //return resp.status(200).json({message:"Signed in successfully"});
                const token = jwt.sign({_id:savedUser.id},jwt_secret);
                const { _id, name, email, userName } = savedUser
                resp.json({ token, user: { _id, name, email, userName } })
            }else{
                return resp.status(422).json({error:"Invalid password"})
            }

        }).catch(err=>console.log(err));
    })
});

module.exports = router;