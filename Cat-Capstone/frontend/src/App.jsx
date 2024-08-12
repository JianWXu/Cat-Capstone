import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { useNavigate } from "react-router-dom";
import CatApi from './api';
import AppLandingPage from './components/routes/landingPageComponents/LandingPage';
import AppNavBar from './components/routes/navbarComponents/NavBar';
import AppRoutes from "./components/routes/Routes";
import Footer from './Footer';
import UserContext from './UserContextTEMP';
import './App.css';

function App() {
  const INITIAL_STATE = null;

  const [username, setUsername] = useState(INITIAL_STATE);
  const [user, setUser] = useLocalStorage("user", INITIAL_STATE);
  const [userToken, setUserToken] = useLocalStorage("userToken", INITIAL_STATE);

  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          return;
        }

        const headers = { Authorization: `Bearer ${token.replace(/^"(.*)"$/, '$1')}` };
        const res = await CatApi.getUser(username, { headers });

        if (res && res.user) {
          setUsername(res.user.username);
          setUser(res.user);
          setUserToken(token.replace(/^"(.*)"$/, '$1'));
        }
      } catch (err) {
        console.error("Error finding user", err);
      }
    }

    if (username) {
      getUser();
    }
  }, [username]);

  const authLoginInfo = async (data) => {
    try {
      const res = await CatApi.verifyUserSignIn(data);
      console.log("API Response:", res);
  
      if (res) {
        const token = res;
        console.log("Token:", token);
  
        localStorage.setItem('userToken', token);
        setUserToken(token);
  
        const payload = JSON.parse(atob(token.split('.')[1]));
        const fetchedUsername = payload.username;
        setUsername(fetchedUsername);
         
        const headers = { Authorization: `Bearer ${token}` };

        const userData = await CatApi.getUser(fetchedUsername, { headers });
        if (userData && userData.user) {
          setUser(userData.user);
          return true;
        }  else {
          throw new Error("User data not found");
        }
      } else {
        console.error("Token not found in response");
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
  };

  return (
    <UserContext.Provider value={{ user, userToken, signOut }}>      
      <AppNavBar signOut={signOut} />
      <AppRoutes signUp={signUp} authLoginInfo={authLoginInfo}/>
      <Footer />
    </UserContext.Provider>
  );
}

export default App;
