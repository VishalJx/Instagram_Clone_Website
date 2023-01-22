import React from "react";
import '../style/CreatePost.css';
import {useState,useEffect} from 'react';
import {toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';



function CreatePost(){
  const navigate = useNavigate();
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(()=>{
    //saving post to mongodb
    if(url){
      fetch("http://localhost:5000/createPost",{
        method:'post',
        headers:{
          "Content-Type":"application/json",
          "Authorization":""+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
          body,
          pic:url
        })
      }).then(resp => resp.json())
      .then(data => {
        if (data.error) {
          notification1(data.error)
        } else {
          notification2("Successfully Posted")
          navigate("/")
        }
      })
      .catch(err => console.log(err))

    }

  },[url])  //This use effect runs only when url changes

  //Toast Function
  const notification1 = (message)=>toast.error(message,
    {position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark"
    })
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


    //Posting image to cloudinary
    const postDetails=()=>{
      console.log(body,image);
      const data = new FormData();
      data.append("file",image);
      data.append("upload_preset","insta-clone")
      data.append("cloud_name","vjxcloud")

      fetch("https://api.cloudinary.com/v1_1/vjxcloud/image/upload",{
        method:"post",
        body:data
      }).then(resp=>resp.json())
      .then(data=>setUrl(data.url)) //here url is the image url
      .catch(err=>console.log(err))
    }

    //To create preview function
    const [selectedImage, setSelectedImage] = useState();

    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setSelectedImage(e.target.files[0]);
        }
      };
    const removeSelectedImage = () => {
         setSelectedImage();
    };

  return (
    <div className="create-post">
        <div className="post-header">
            <h4>Create New Post</h4>
            <button onClick={()=>{postDetails()}}>Share</button>
        </div>
        <div className="main-div">
            {selectedImage && (
            <div style={{display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <img id="output" src={URL.createObjectURL(selectedImage)} alt="https://www.namepros.com/attachments/empty-png.89209/"/>
                <button id="remove" onClick={removeSelectedImage}>
                Remove This Image
                </button>
            </div>
            )}            
            <input type='file' accept='image/*' onChange={(e)=>{imageChange(e);setImage(e.target.files[0])}}></input>
        </div>
        <div className="details">
            <div className="card-header">
                <div className="card-pic">
                  <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" alt="img"></img>
                </div>
                <h5>Name</h5>
            </div>
            <textarea type='text' placeholder='Write a caption' value={body} onChange={(e)=>{setBody(e.target.value)}}></textarea>
        </div>
    </div>
  )
};

export default CreatePost;
