import {useState} from "react";
import './App.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/script/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './components/script/Home';
import SignUp from './components/script/SignUp';
import SignIn from './components/script/SignIn';
import Profile from './components/script/Profile';
import CreatePost from './components/script/CreatePost';
import {LoginContext} from "./components/context/LoginContext";
import Modal from "./components/script/Modal";
import UserProfile from "./components/script/UserProfile";
import MyFollowing from "./components/script/MyFollowing";

function App() {
  const [userLogin, setUserLogin] = useState(false);
  const[modalOpen,setModalOpen] = useState(false);
  return (
    <BrowserRouter>
        <div className="App">
        {/* //global variable seUserLogin tht can be used thoughout the app */}
          <LoginContext.Provider value={{setUserLogin,setModalOpen}}> 
          <Navbar login={userLogin}/>
            <Routes>
              <Route path='/' element={<Home/>}></Route>
              <Route path='/signup' element={<SignUp/>}></Route>
              <Route path='/signin' element={<SignIn/>}></Route>
              <Route exact path='/profile' element={<Profile/>}></Route>
              <Route path='/createPost' element={<CreatePost/>}></Route>
              <Route path='/profile/:userId' element={<UserProfile/>}></Route>
              <Route path='/followingPost' element={<MyFollowing/>}></Route>
            </Routes>
            <ToastContainer/>
            {modalOpen && <Modal setModalOpen={setModalOpen}/>}
          </LoginContext.Provider>
        </div>
    </BrowserRouter>
  );
}

export default App;
