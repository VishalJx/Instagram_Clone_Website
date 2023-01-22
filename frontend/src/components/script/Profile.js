import React from "react";
import '../style/Profile.css';
import { useNavigate} from "react-router-dom";
import {toast } from 'react-toastify';
import {useEffect, useState} from 'react';
import ProfilePic from "./ProfilePic";
import img from "../images/img.png";

function Profile(){

  var picLink= img;

  const navigate = useNavigate();
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(false);

  const [user, setUser] = useState('');

    //to show comment page
    const toggleDetails=(posts)=>{   //receiving posts parameter from onClick.
      if(show){
        setShow(false);
      }else{
        setShow(true);
        setPosts(posts)
      }
    };

    const notification2 = (message)=>toast.success(message,
      {position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light"
      })

    //Delete Post
    const removePost = (postId) => {
      if (window.confirm("Do you really want to delete this post ?")) {
        fetch(`/deletePost/${postId}`, {
          method: "delete",
          headers: {
            Authorization: "" + localStorage.getItem("jwt"),
          }
        })
          .then((resp) => resp.json())
          .then((result) => {
            toggleDetails();
            navigate("/");
            notification2("Successfully");
          });
      }
    };

    //change profile pic
    const changeProfile=()=>{
      if(profile){
        setProfile(false);
      }else{
        setProfile(true)
      }
    }

  useEffect(()=>{
      fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
        headers:{
          "Authorization":""+localStorage.getItem("jwt")
        },
      }).then(resp=>resp.json())
      .then((result)=>{
        console.log(result)
        setPic(result.posts);
        setUser(result.user)})
  },[])

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
         <img src={user.Photo?user.Photo : picLink} 
         alt="img" onClick={changeProfile}></img>
        </div>
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info">
            <p>{pic?pic.length:"0"} posts</p>
            <p>{user.followers?user.followers.length:"0"} followers</p>
            <p>{user.following?user.following.length:"0"} following</p>
          </div>
        </div>
      </div>
<hr style={{width:'90%', margin:'10px auto', opacity:'0.2'}}/>
      <div className="gallery">
        {pic.map((pics)=>{
            return <img key={pics._id} src={pics.photo} alt="noPost" onClick={()=>toggleDetails(pics)}/>
          })
        }
      </div>

      {/**Show Pic details */}
      {
        show && 
        <div className="showComment">
        <div className="container">
          <div className="postPic">
            <img src={posts.photo} alt="none"></img>   {/*we get data of post from toggleComment function*/}
          </div>
          <div className="details">
            <div className="cardHeader" style={{borderBottom:"1px solid rgb(204, 204, 204)"}}>
              <div className="header">
                <img src={user.Photo?user.Photo : picLink}
                alt="img"></img>
                <h5>{posts.postedBy.name}</h5>
                <div className="delete-post" onClick={()=>{removePost(posts._id)}}>
                  <span className="material-symbols-outlined">delete</span>
                </div>
              </div>
            </div>

            <div className="commentSection" style={{borderBottom:"1px solid rgb(204, 204, 204)"}}>
              {
                posts.comments.map((comment)=>{
                 return (<p className="com">
                    <span style={{backgroundColor:"rgb(232, 230, 230)",fontWeight:'bolder',marginRight:'4px'}}>{comment.postedBy.name} </span>
                    <span>{comment.comment}</span>
                  </p>)
                })
              }
            </div>
            <div className="post-content">
              <p>{posts.likes.length} Likes</p>
              <p style={{display:"flex",alignItems:"center"}}><span style={{marginRight:"4px",fontSize:"15px",fontWeight:'700'}}>XYZ</span>{posts.body}</p>
            </div>
            <div className="comment">
              <span className="material-symbols-outlined">mood</span>
              <input type="text" placeholder="Add a comment"></input>
              <button>Post</button>
            </div>
          </div>
        </div>
        <div className="closeComment">
          <span className="material-symbols-outlined material-symbols-outlined-closeBt" onClick={()=>{toggleDetails()}}>close</span>
        </div>
      </div>
      }
      {
        profile &&
        <ProfilePic changeProfile={changeProfile}/>
      }
    </div>
  )
};

export default Profile;
