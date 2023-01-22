import React from "react"
import {Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import insta from '../images/insta.png';
import '../style/SignUp.css';
import {toast } from 'react-toastify';

function SignUp(){
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
const notification2 = ()=>toast.success("Data registered successfully !!",
{position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
})

const mailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const postData =()=>{
  //checking validity of email using regex
  if(!mailRegex.test(email)){
    notification1("Invalid Email")
    return        //to not to execute further
  }
  //Sending data to server
  fetch("/signup",{
    method:'post',
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      email:email,   //RHS variable is from useState
      name:name,
      username:username,
      password:password
    })
  }).then(resp=>resp.json())
  .then(data=>{
    if(data.error){
      notification1(data.error)
    }else{
      notification2(data.message)
      setTimeout(navigate("/signin"),3000)
    }
    console.log(data)})
}


  return (
    <div className="signup">
      <div className="signup-form">
            <div className='signup-logo'>
              
              <img className='signup-logo-img' src={insta} alt='logo'/>
            </div>

              <div className='signup-form-container'>
                  <p style={{fontSize:'18px',color:'#838385',padding:'5px 0px 30px 0px',fontWeight:'700'}}>Sign up to see photos and<br/> videos from your friends.</p>
                  <div>
                      <input type='email' name='email' id='input' placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
                  </div>

                  <div>
                      <input type='text' name='name' id='input' placeholder='Full name' value={name} onChange={(e)=>{setName(e.target.value)}}></input>
                  </div>

                  <div>
                      <input type='text' name='username' id='input' placeholder='Username' value={username} onChange={(e)=>{setUsername(e.target.value)}}></input>
                  </div>

                  <div>
                      <input type='password' name='password' id='input' placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
                  </div>
                  <div style={{margin:'12px 0px 12px 0px',fontSize:'13px',color:'grey'}}>
                    <p>By signing up, you agree to our Terms , Privacy Policy and Cookies Policy </p>
                  </div>
                  <div>
                    <button onClick={()=>{postData()}}>Sign Up</button>
                  </div>
          </div>
          <div className="form-2" style={{fontSize:'15px',marginTop:'15px',color:'#606061'}}>
            <span>Already have an account?</span>
            <Link to='/signin'><span style={{textDecoration:'none',color:'#024bab'}}> Sign In</span></Link>
          </div>
      </div>
    </div>
  )
};

export default SignUp;
