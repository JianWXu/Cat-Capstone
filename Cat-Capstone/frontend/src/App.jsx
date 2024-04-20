import { useState, useEffect } from 'react'
import { useLocalStorage } from "@uidotdev/usehooks";
import { useLocation } from "react-router-dom"
import axios from 'axios'
import CatApi from '../../api'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SignIn from "./components/sign-in-side/SignInSide.jsx"
import SignUp from "./components/sign-up/SignUp.jsx"
import AppRoutes from "./components/routes/Routes.jsx"
import './App.css'

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

  const shouldShowSignUp = () => {
    return location.pathname === "/signup"
  }

  const shouldShowLogin = () => {
    return location.pathname === "/login"
  }


  return (
    <>
      
      {shouldShowLogin() && (<SignIn authLoginInfo={authLoginInfo} shouldShowLogin={shouldShowLogin} />)}
      {shouldShowSignUp() && (<SignUp signUp={signUp} shouldShowSignUp={shouldShowSignUp} />)}
    </>
  )
}

export default App
