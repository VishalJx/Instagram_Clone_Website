const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const POST = mongoose.model("POST");

router.get("/allPosts",requireLogin,(req,resp)=>{
    //post data is saved as POST hence getting data using POST
    POST.find()
    .populate("postedBy","_id name Photo")  //returns detailed infromation about given 1st paramter and 2nd parameter can be specific values from 1st paramter.
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")  //saves post in descending order
    .then(posts=>resp.json(posts))
    .catch(err=>console.log(err));
})


router.post("/createPost",requireLogin,(req,resp)=>{
    const {body,pic} = req.body;
    if(!body || !pic){
        return resp.status(422).json({error:"Please add all the fields"})
    }
    req.user
    const post = new POST({
        body,
        photo:pic, //since in react we have given name as pic
        postedBy:req.user
    })
    post.save().then((result)=>{
        return resp.json({post:result})
    }).catch(err=>console.log(err))
})


router.get("/myPost",requireLogin,(req,resp)=>{
    POST.find({postedBy:req.user._id})
    .populate("postedBy","_id name")  //returns detailed infromation about given 1st paramter and 2nd parameter can be specific values from 1st paramter.
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")  //saves post in descending order
    .then(myPost=>{resp.json(myPost)})
    .catch(err=>console.log(err));
})


router.put("/likes",requireLogin,(req,resp)=>{  //since we'll not post likes but update it
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}  //req.user gets all data about user from our middleware
    },{
        new:true
    }).populate("postedBy","_id name Photo") 
    .exec((err,result)=>{
        if(err){
            return resp.status(422).json({error:err})
        }else{
            resp.json(result)
        }
    })
})

router.put("/unlikes",requireLogin,(req,resp)=>{  //since we'll not post likes but update it
    POST.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}  //req.user gets all data about user from our middleware
    },{
        new:true
    }).populate("postedBy","_id name Photo") 
    .exec((err,result)=>{
        if(err){
            return resp.status(422).json({error:err})
        }else{
            resp.json(result)
        }
    })
})


router.put("/comment",requireLogin,(req,resp)=>{ 
    const comment={
        comment:req.body.text,
        postedBy: req.user._id
    }

    POST.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true,
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")   //on render; the account holders name gets disappeared after commenting cause this api does not return much data; hence we adding this line. 
    .exec((err,result)=>{
        if(err){
            return resp.status(422).json({error:err})
        }else{
            resp.json(result)
        }
    })
})


router.delete("/deletePost/:postId",requireLogin,(req,resp)=>{ 
    // console.log(req.params.postId)   Gives id of the post
    POST.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        // console.log(post)  //Gives all the data about post
        if(err || !post){
            return resp.status(422).json({error:err})
        }
           //console.log(post.postedBy._id,req.user._id)

          //From database      //From middleware
        if(post.postedBy._id.toString() == req.user._id.toString()){//to check if the account holder is the one who's deleting his own post.
            post.remove()
            .then(result=>{
                return res.json({ message: "Successfully deleted" }) 
            }).catch((err) => {
                console.log(err)
            })
        }  
    })
})


//to show following users post
router.get("/myFollowingPost",requireLogin,(req,resp)=>{
    POST.find({postedBy:{$in:req.user.following}})  //the$in operator selects the document where the value of a field(postedBy) equals any value in the specified array.
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(post=>{
        resp.json(post)
    }).catch(err=>{console.log(err)})

})

module.exports = router;