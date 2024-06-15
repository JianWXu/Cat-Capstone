import { useState, useEffect } from 'react'
import { useLocalStorage } from "@uidotdev/usehooks";
import { useLocation } from "react-router-dom"
import axios from 'axios'
import AppNavBar from './components/routes/navbarComponents/NavBar'
import CatApi from '../../api'
import AppLandingPage from './components/routes/landingPageComponents/LandingPage';
import AppRoutes from "./components/routes/Routes"
import AppSignUp  from './components/routes/SignUp';
import AppLogin from './components/routes/SignIn';
import AppSwipingPage from './components/routes/swipingComponent/SwipingMain'
import Footer from './Footer';
import './App.css';

function App() {
  const INITIAL_STATE = "";
  const [userToken, setUserToken]  = useState(INITIAL_STATE)
  const [username, setUserName ] = useState(INITIAL_STATE)
  const [user, setUser] = useLocalStorage("user", INITIAL_STATE)
  const location = useLocation()

  useEffect(()=>{
    async function getUser() {
      const token = CatApi.token;
      const headers = {Authorization: `Bearer ${token}` }
      if(!token){
        console.error("token not found")
        return;
      }
      try {
        if(username){
          const res = await CatApi.getUser(username, {headers})

          console.log(res)
          setUser(JSON.stringify(res.user))
          setUserToken(token)
        }
        }catch(err){
          console.error("Error finding user", error)
        
      }
    }
    getUser()
  }, [user, username, setUser])

  const authLoginInfo = async (data) => {
    try {
      const res = await CatApi.verifyUserSignIn(data);
      const token = localStorage.getItem('userToken')
      console.log(res);
      setUserToken(res)
      setUsername(data.username)
    } catch (error) {
      console.error("Error logging in:", error);
      
    }
  };

  const signUp = async (info) => {
    try{
      const res = await CatApi.makeUser(info);
      setUserToken(prevUserToken => {
        // This callback function executes after userToken has been updated
        
        return res.token; // Return the updated userToken
      });
      setUsername(info.username)
      
      await console.log("new username", info.username)
    }catch(err){
      console.error("Error signing up:", err)
    }    
  }

  const signOut = () => {
    setUserToken(INITIAL_STATE)
    setUsername(INITIAL_STATE)
    setUser(INITIAL_STATE)
    console.log("signed out", username)
  }


  const shouldShowSignUp = location.pathname === '/signup';
  const shouldShowLogin = location.pathname === '/login';
  const shouldShowLanding = location.pathname === '/home';
  const shouldShowSwiping = location.pathname === '/swipe'


  return (
    <>
      
      
       <AppNavBar />
      <AppRoutes />
      {shouldShowLanding && <AppLandingPage shouldShowLanding={shouldShowLanding} />}
      {shouldShowLogin && <AppLogin authLoginInfo={authLoginInfo} shouldShowLogin={shouldShowLogin} />}
      {shouldShowSignUp && <AppSignUp signUp={signUp} shouldShowSignUp={shouldShowSignUp} />}
      {shouldShowSwiping && <AppSwipingPage shouldShowSwiping={shouldShowSwiping}/>}
      <Footer />
    </>
  )
}

export default App
