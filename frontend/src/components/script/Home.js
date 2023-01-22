import React,{useEffect,useState} from "react";
import { useNavigate} from "react-router-dom";
import '../style/Home.css';
import { Link } from "react-router-dom";
import {toast } from 'react-toastify';
import img from "../images/img.png";


function Home(){

  var picLink= img;

  const navigate = useNavigate("");
  const [data,setData] = useState([]);
  const [comment, setComment] = useState();
  const [show, setShow] = useState(false);   //for show comments
  const [items, setItems] = useState();

  //Notification
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

  //to show comment page
  const toggleComment=(post)=>{   //receiving post parameter from onClick.
    if(show){
      setShow(false);
    }else{
      setShow(true);
      setItems(post)
    }
  }

  //if token is not available then we'll navigate back to signup/in page
  useEffect(()=>{
    const token = localStorage.getItem("jwt");
    if(!token){
        navigate("signup")
    } 

    //fetching data of all posts using get api
fetch("http://localhost:5000/allPosts",{
  headers:{
    "Content-Type":"application/json",
    "Authorization":""+localStorage.getItem("jwt")
  }
}).then(resp=>resp.json())
.then(result=>setData(result))
.catch(err=>console.log(err));

  },[]);

  //Like post
  const likePost = (id)=>{
      fetch("http://localhost:5000/likes",{
        method:"put",
        headers:{
          "Authorization":""+localStorage.getItem("jwt"),
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          postId:id,  //should be same as created in createPost api.
        })
      }).then(resp=>resp.json())
      .then((result)=>{
        const newData = data.map((posts)=>{
          if(posts._id == result._id){  //just to rerender the component; we'll check that our liked post matches the id of any exisiting post.
            return result;
          }else{
            return posts;
          }
        })
        setData(newData);
        console.log(result)})
  }

  //UnLike post
  const unlikePost = (id)=>{
    fetch("http://localhost:5000/unlikes",{
      method:"put",
      headers:{
        "Authorization":""+localStorage.getItem("jwt"),
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        postId:id,  //should be same as created in createPost api.
      })
    }).then(resp=>resp.json())
    .then((result)=>{
      const newData = data.map((posts)=>{
        if(posts._id == result._id){  //just to rerender the component; we'll check that our liked post matches the id of any exisiting post.
          return result;
        }else{
          return posts;
        }
      })
      setData(newData);
      console.log(result)})}

  //function to make comment
  const makeComment =(text,id)=>{
    fetch("/comment",{
      method:"put",
      headers:{
        "Authorization":""+localStorage.getItem("jwt"),
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        postId:id,  //should be same as created in createPost api.
        text:text,
      })
    }).then(resp=>resp.json())
    .then((result)=>{
      const newData = data.map((posts)=>{
        if(posts._id == result._id){  //just to rerender the component; we'll check that our liked post matches the id of any exisiting post.
          return result;
        }else{
          return posts;
        }
      })
      setData(newData);
      setComment("")
      notification2("Commented Successfully !")
      console.log(result)})  
    }
    
  return (
    <div>
      {data.map((post)=>{   //all the data of the post will be set inside data-variable
        return(
          <div className="card">
            <div className="header">
              <img src={post.postedBy.Photo?post.postedBy.Photo:picLink} alt="img"></img>
              <h5><Link to={`/profile/${post.postedBy._id}`} style={{textDecoration:'none',color:'black'}}>{post.postedBy.name}</Link></h5>
            </div>
            <div className="post-image">
              <img src={post.photo} alt="img"></img>
            </div>
            <div className="post-content">
              {
                post.likes.includes(JSON.parse(localStorage.getItem("user"))._id)?//to convert json data receiving from local storage to objec data.
              (<span className="material-symbols-outlined unlike" onClick={()=>{unlikePost(post._id)}}>favorite</span>
              ):(<span className="material-symbols-outlined " onClick={()=>{likePost(post._id)}}>favorite</span>)
              }
              <p>{post.likes.length} Likes</p>
              <p style={{display:"flex",alignItems:"center"}}><span style={{marginRight:"4px",fontSize:"15px",fontWeight:'700'}}>{post.postedBy.name}</span>{post.body}</p>
              <p style={{color:"grey",fontWeight:"bold",cursor:"pointer"}} onClick={()=>{toggleComment(post)}}>View all comments</p>
            </div>
            <div className="comment">
              <span className="material-symbols-outlined">mood</span>
              <input type="text" placeholder="Add a comment" value={comment} onChange={(e)=>{setComment(e.target.value)}}></input>
              <button onClick={()=>{makeComment(comment,post._id)}}>Post</button>
            </div>
        </div>
        )
      })}

      {/*Show comments */}
      {show && (
        <div className="showComment">
        <div className="container">
          <div className="postPic">
            <img src={items.photo} alt="none"></img>   {/*we get data of post from toggleComment function*/}
          </div>
          <div className="details">
            <div className="cardHeader" style={{borderBottom:"1px solid rgb(204, 204, 204)"}}>
              <div className="header">
                <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="img"></img>
                <h5>{items.postedBy.name}</h5>
              </div>
            </div>

            <div className="commentSection" style={{borderBottom:"1px solid rgb(204, 204, 204)"}}>
              {
                items.comments.map((comment)=>{
                 return (<p className="com">
                    <span style={{backgroundColor:"rgb(232, 230, 230)",fontWeight:'bolder',marginRight:'4px'}}>{comment.postedBy.name} </span>
                    <span>{comment.comment}</span>
                  </p>)
                })
              }
            </div>
            <div className="post-content">
              <p>{items.likes.length} Likes</p>
              <p style={{display:"flex",alignItems:"center"}}><span style={{marginRight:"4px",fontSize:"15px",fontWeight:'700'}}>XYZ</span>{items.body}</p>
            </div>
            <div className="comment">
              <span className="material-symbols-outlined">mood</span>
              <input type="text" placeholder="Add a comment" value={comment} onChange={(e)=>{setComment(e.target.value)}}></input>
              <button onClick={()=>{makeComment(comment, items._id); toggleComment()}}>Post</button>
            </div>
          </div>
        </div>
        <div className="closeComment">
          <span class="material-symbols-outlined material-symbols-outlined-closeBt" onClick={()=>toggleComment()}>close</span>
        </div>
      </div>)
      }

  </div>
  )

};

export default Home;
