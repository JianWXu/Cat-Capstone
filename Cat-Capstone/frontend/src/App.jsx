import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { useLocation, useNavigate } from "react-router-dom";
import CatApi from '../../api';
import AppNavBar from './components/routes/navbarComponents/NavBar';
import AppLandingPage from './components/routes/landingPageComponents/LandingPage';
import AppRoutes from "./components/routes/Routes";
import AppSignUp from './components/routes/SignUp';
import AppLogin from './components/routes/SignIn';
import AppSwipingPage from './components/routes/swipingComponent/SwipingMain';
import AppProfile from './components/routes/userProfileComponent/userProfile';
import AppAddCat from './components/useCatComponent/addCat'
import Footer from './Footer';
import UserContext from './userContext';
import './App.css';

function App() {
  const INITIAL_STATE = null;

  const [username, setUsername] = useState(INITIAL_STATE);
  const [user, setUser] = useLocalStorage("user", INITIAL_STATE);
  const [userToken, setUserToken] = useLocalStorage("userToken", INITIAL_STATE);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const token = localStorage.getItem('userToken');
        console.log("Retrieved token from localStorage:", token);
        if (!token) {
          console.error("Token not found in local storage");
          return;
        }
  
        const headers = { Authorization: `Bearer ${token.replace(/^"(.*)"$/, '$1')}` };
        const res = await CatApi.getUser(username, { headers });
        console.log("getUser response:", res);
  
        if (res && res.user) {
          setUsername(res.user.username)
          setUser(res.user);
          setUserToken(token.replace(/^"(.*)"$/, '$1'));
        } else {
          console.error("Invalid response from getUser API:", res);
        }
      } catch (err) {
        console.error("Error finding user", err);
      }
    }
  
    if (username) {
      getUser();
    }
  }, [username]);  // Dependency array only includes `username` to avoid infinite loop

  const authLoginInfo = async (data) => {
    try {
      const res = await CatApi.verifyUserSignIn(data);
      console.log("authLoginInfo response:", res);
      if (res) {
        const token = res.replace(/\"/g, "");  // Remove any quotes if present
        localStorage.setItem('userToken', token);
        setUserToken(token);
  
        const payload = JSON.parse(atob(token.split('.')[1]));
        const fetchedUsername = payload.username;
        setUsername(fetchedUsername);
  
        const headers = { Authorization: `Bearer ${token}` };
        const userData = await CatApi.getUser(fetchedUsername, { headers });
        console.log("userData:", userData);
        if (userData && userData.user) {
          setUser(userData.user);
        } else {
          console.error("Invalid response from getUser API:", userData);
        }
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
      if (res && res.token) {
        console.log('New user registered successfully');
        // Do not store anything in local storage or state
      } else {
        console.error('Invalid response from signUp API:', res);
      }
    } catch (err) {
      console.error('Error signing up:', err);
    }
  };
  

  const signOut = () => {
    setUserToken(INITIAL_STATE);
    setUsername(INITIAL_STATE);
    setUser(INITIAL_STATE);
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    navigate('/login');
    console.log("Signed out", username);
  };

  const shouldShowSignUp = location.pathname === '/signup';
  const shouldShowLogin = location.pathname === '/login';
  const shouldShowLanding = location.pathname === '/home';
  const shouldShowSwiping = location.pathname === '/swipe';
  const shouldShowPatch = location.pathname === '/profile';
  const shouldShowAddCat = location.pathname === '/addCat';

  return (
    <>
      <UserContext.Provider value={{ user, userToken, signOut }}>
        <AppNavBar signOut={signOut} />
        <AppRoutes />
        {shouldShowLanding && <AppLandingPage shouldShowLanding={shouldShowLanding} />}
        {shouldShowLogin && <AppLogin authLoginInfo={authLoginInfo} shouldShowLogin={shouldShowLogin} />}
        {shouldShowSignUp && <AppSignUp signUp={signUp} shouldShowSignUp={shouldShowSignUp} />}
        {shouldShowSwiping && <AppSwipingPage shouldShowSwiping={shouldShowSwiping} />}
        {shouldShowPatch && <AppProfile shouldShowPatch={shouldShowPatch} />}
        {shouldShowAddCat && <AppAddCat shouldShowAddCat={shouldShowAddCat} />}
        <Footer />
      </UserContext.Provider>
    </>
  );
}

export default App;
