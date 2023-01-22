import React,{useState, useEffect, useRef} from "react"

function ProfilePic({changeProfile}){

    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
  
    const hiddenFileInput = useRef(null);
    const handleClick =()=>{
        hiddenFileInput.current.click();  //we are referening the click on upload button to the input tag(i.e.click on upload will be equivalent to clicking on "browse files" which we have set display:none)
    };

    //Posting image to cloudinary
    const postDetails=()=>{
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

    const postPic=()=>{
        //saving post to mongodb
            fetch("/uploadProfile",{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization":""+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:url
            })
            }).then(resp => resp.json())
            .then(data => {
                console.log(data);
                changeProfile();
                window.location.reload();
            })
            .catch(err => console.log(err))
    
        }

    useEffect(()=>{
        if(image){
            postDetails()
        }
    },[image])

    useEffect(()=>{
        if(url){
            postPic();
        }

    },[url])

  return (
    <div className="darkBg">
        <div className="change-pic centered">
            <div>
                <h2 style={{fontSize:'20px',padding:'5px 0px 5px 0px'}}>Change Profile Photo</h2>
            </div>
            <hr style={{width:'100%',border:'none', height:'2px', color:'rgb(219, 219, 219)', backgroundColor:'rgb(219, 219, 219)'}}/>
            <div>
                <button className="upload" style={{color:'rgb(2, 153, 199)'}} onClick={handleClick}>Upload Pic</button>
                <input type="file" accept="image/*" style={{display:'none'}} ref={hiddenFileInput} onChange={(e)=>{setImage(e.target.files[0])}}/>
            </div>
            <hr style={{width:'100%',border:'none', height:'2px', color:'rgb(219, 219, 219)', backgroundColor:'rgb(219, 219, 219)'}}/>
            <div>
                <button className="upload" style={{color:'red'}} onClick={()=>{
                    setUrl(null);
                    postPic();
                }}>Remove Current Photo</button>
            </div>
            <hr style={{width:'100%',border:'none', height:'2px', color:'rgb(219, 219, 219)', backgroundColor:'rgb(219, 219, 219)'}}/>
            <div onClick={changeProfile}>
                <button style={{border:'none', background:'none', cursor:'pointer', fontSize:'15px'}}>Cancel</button>
            </div>
        </div>
    </div>
  )
};

export default ProfilePic;
