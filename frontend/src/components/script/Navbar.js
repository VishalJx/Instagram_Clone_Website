import React,{useContext} from "react";
import '../style/Navbar.css';
import insta from '../images/insta.png';
import {Link} from 'react-router-dom';
import {LoginContext} from '../context/LoginContext';
import {useNavigate} from 'react-router-dom';

function Navbar({login}){
  const navigate=useNavigate();
  const {setModalOpen} = useContext(LoginContext);

const loginStatus=()=>{
  const token = localStorage.getItem("jwt");
  if(login ||token){  //if token is available then showing profile/Create-profile on navbar else singup/signin options.
    return[
      <>
        <Link className='link' to='/profile'><li className='li'>Profile</li></Link>
        <Link className='link' to='/createPost'><li className='li'>Create-Post</li></Link>
        <Link className='link' to='followingPost'><li className='li'>Feeds</li></Link>
        <Link to={""}>
          <button className="primary-btn" onClick={()=>setModalOpen(true)}>Log Out</button>
        </Link>
      </>
    ]
  }else{
    return[
      <>
        <Link className='link' to='/signup'><li className='li'>SignUp</li></Link>
        <Link className='link' to='/signin'><li className='li'>SignIn</li></Link>
      </>
    ]
  }
};

  return (
    <div className='navbar'>
        <img className='name-logo-img' src={insta} onClick={()=>{navigate("/")}} alt=''/>
        <ul className='nav-list' key="null">
          {loginStatus()}
        </ul>
    </div>
  )
};

export default Navbar;
