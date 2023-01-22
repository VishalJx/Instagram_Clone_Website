import React from "react";
import {useState,useContext} from 'react';
import '../style/SignIn.css';
import {Link, useNavigate} from 'react-router-dom';
import insta from '../images/insta.png';
import {toast } from 'react-toastify';
import { LoginContext } from "../context/LoginContext";


function SignIn(){

  const {setUserLogin} = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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

  const mailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const postData =async()=>{
    //checking validity of email using regex
    if(!mailRegex.test(email)){
      notification1("Invalid Email")
      return        //to not to execute further
    }
    //Sending data to server
    fetch("/signin",{
      method:'post',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email:email,   //RHS variable is from useState
        password:password
      })
    }).then(resp=>resp.json())
    .then(data=>{
      if(data.error){
        notification1(data.error)
      }else{
        notification2(data.message);
        console.log(data.token);
        localStorage.setItem("jwt",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
        setUserLogin(true);
        navigate('/');
      }
    })
  }
  return (
    <div className='signin'>
      <div className="singin-form-container">
        <form className="signin-form">
            <div className='signup-logo'>
                <img className='signup-logo-img' src={insta} alt='logo' style={{marginBottom:'40px'}}></img>
            </div>
            <div>
                <input type='email' name='email' id='input' placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
            </div>
            <div>
                <input type='password' name='password' id='input' placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
            </div>
            <div>
                <button onClick={(e)=>{e.preventDefault();postData()}}>Sign In</button>
            </div>
            <div className="form-2" style={{fontSize:'15px',marginTop:'15px',color:'#606061'}}>
              <span>Don't have an account?</span>
              <Link to='/signup'><span style={{textDecoration:'none',color:'#024bab'}}> Sign Up</span></Link>
            </div>
        </form>
      </div>
    </div>
  )
};

export default SignIn;
