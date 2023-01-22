import React from "react";
import '../style/Profile.css';
import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import img from "../images/img.png";

function UserProfile(){

  var picLink= img;

  const {userId} =useParams();  //must be same as given param in frontend uri;
//   const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState(false);


    //follow user
    const followUser=(userId)=>{
        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":""+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userId
            })
        }).then((resp)=>resp.json())
        .then((data)=>{
            console.log(data);
            setFollow(true);
        })
    }

    //unfollow user
    const unfollowUser=(userId)=>{
        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":""+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                followId:userId
                })
        }).then((resp)=>{resp.json()})
        .then((data)=>{
            console.log(data);
            setFollow(false);
        })
        }
    

  useEffect(()=>{
      fetch(`/user/${userId}`,{
        headers:{
          "Authorization":""+localStorage.getItem("jwt")
        },
      }).then(resp=>resp.json())
      .then((result)=>{
        setUser(result.user)
        setPosts(result.posts)
        if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
            setFollow(true)
        }
      })

  },[follow])

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
         <img src={user.Photo?user.Photo : picLink} alt="img"></img>
        </div>
        <div className="profile-data">
            <div style={{display:'flex', alignItems:'center'}}>
                <h1>{user.name}</h1>
                <button className="follow" onClick={()=>
                    {if(follow){
                        unfollowUser(user._id)
                    }else{
                        followUser(user._id)
                    }
                    }}
                    >{follow ? "unfollow" : "Follow"}</button>
            </div>
          <div className="profile-info">
            <p>{posts.length} posts</p>
            <p>{user.followers?user.followers.length:"0"} Followers</p>
            <p>{user.following?user.following.length:"0"} Following</p>
          </div>
        </div>
      </div>
<hr style={{width:'90%', margin:'10px auto', opacity:'0.2'}}/>
      <div className="gallery">
        {posts.map((pics)=>{
            return (<img key={pics._id} src={pics.photo} alt="noPost"/>)
          })
        }
      </div>
    </div>
  )
};

export default UserProfile;
