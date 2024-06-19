import { useState, useEffect } from 'react';
import { useLocalStorage } from "@uidotdev/usehooks";
import { useLocation, useNavigate } from "react-router-dom";
import CatApi from '../../api';
import AppNavBar from './components/routes/navbarComponents/NavBar';
import AppLandingPage from './components/routes/landingPageComponents/LandingPage';
import AppRoutes from "./components/routes/Routes";
import AppSignUp from './components/routes/SignUp';
import AppLogin from './components/routes/SignIn';
import AppSwipingPage from './components/routes/swipingComponent/SwipingMain';
import AppProfile from './components/routes/userProfileComponent/userProfile';
import Footer from './Footer';
import UserContext from './userContext';
import './App.css';

function App() {
  const INITIAL_STATE = "";

  const [userToken, setUserToken] = useState(INITIAL_STATE);
  const [username, setUsername] = useState(INITIAL_STATE);
  const [user, setUser] = useLocalStorage("user", INITIAL_STATE);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }
      try {
        const headers = { Authorization: `Bearer ${token}` };
        // const res = await CatApi.getUser(username, { headers });
        const res = await CatApi.getUser(username)
  
        console.log(res); // Check the response structure here
        // setUser(res.user); // Assuming res.user contains the user data
        setUserToken(token);
      } catch (err) {
        console.error("Error finding user", err);
      }
    }
  
    if (username) {
      getUser();
    }
  }, [username, setUser]);
  

  const authLoginInfo = async (data) => {
  try {
    const {username } = data
    const res = await CatApi.verifyUserSignIn(data);
    if (res) {
      localStorage.setItem('userToken', res.token);
      setUserToken(res);
      setUsername(data.username);
      
      // Fetch user data separately after setting the token
      const headers = { Authorization: `Bearer ${res}` };
      const userData = await CatApi.getUser(data.username, {headers});
      setUser(userData.user); // Assuming userData.user contains the user data
    } else {
      console.error("Invalid response from login API:", res);
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
  
  

  const signUp = async (info) => {
    try {
      const res = await CatApi.makeUser(info);
      setUserToken(res.token);
      setUsername(info.username);

      console.log("new username", info.username);
    } catch (err) {
      console.error("Error signing up:", err);
    }
  };

  const signOut = () => {
    setUserToken(INITIAL_STATE);
    setUsername(INITIAL_STATE);
    setUser(INITIAL_STATE);
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/login');
    console.log("signed out", username);
  };

  const shouldShowSignUp = location.pathname === '/signup';
  const shouldShowLogin = location.pathname === '/login';
  const shouldShowLanding = location.pathname === '/home';
  const shouldShowSwiping = location.pathname === '/swipe';
  const shouldShowPatch = location.pathname === "/profile"
  

  return (
    <>
      <UserContext.Provider value={{ user }}>
        <AppNavBar signOut={signOut} />
        <AppRoutes />
        {shouldShowLanding && <AppLandingPage shouldShowLanding={shouldShowLanding} />}
        {shouldShowLogin && <AppLogin authLoginInfo={authLoginInfo} shouldShowLogin={shouldShowLogin} />}
        {shouldShowSignUp && <AppSignUp signUp={signUp} shouldShowSignUp={shouldShowSignUp} />}
        {shouldShowSwiping && <AppSwipingPage shouldShowSwiping={shouldShowSwiping} />}
        {shouldShowPatch && <AppProfile  shouldShowPatch={shouldShowPatch} />}
        <Footer />
      </UserContext.Provider>
    </>
  );
}

export default App;
