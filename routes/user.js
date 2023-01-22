const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const USER = mongoose.model('USER');
const POST = mongoose.model("POST");
const requireLogin = require('../middleware/requireLogin');


//to get user profile
router.get("/user/:id",(req,resp)=>{
    USER.findOne({_id:req.params.id})  //finding using user id given in params
    .select("-password") //this will help to not give password in response
    .then(user=>{
            POST.find({postedBy: req.params.id})
            .populate("postedBy","_id")
            .exec((err,posts)=>{
                if(err){
                    return resp.status(422).json({error:err});
                }
                resp.status(200).json({user,posts})
            })
    }).catch(err=>{
        return resp.status(404).json({error:"User not found"});
    })
})


//to follow user
router.put("/follow", requireLogin, (req, res) => {
    USER.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        USER.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {
            new: true
        }).then(result => {
            res.json(result)

        }).catch(err => { return res.status(422).json({ error: err }) })
    }
    )
})


//to unfollow user
router.put("/unfollow", requireLogin, (req, resp) => {
    USER.findByIdAndUpdate(req.body.followId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        USER.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }
        }, {
            new: true
        }).then(result => {
            resp.json(result)

        }).catch(err => { return res.status(422).json({ error: err }) })
    }
    )
})


//to upload profile pic
router.put("/uploadProfile", requireLogin, (req, resp) => {
    USER.findByIdAndUpdate(req.user._id,{
        $set:{Photo:req.body.pic}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return resp.status(422).json({error:err});
        }else{
            resp.json(result);
        }
    })
})

module.exports = router;