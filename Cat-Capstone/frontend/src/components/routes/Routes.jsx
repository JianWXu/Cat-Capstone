import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserContext from '../../UserContext';
import AppLandingPage from './landingPageComponents/LandingPage';
import AppSignUp from './SignUp';
import AppLogin from './SignIn';
import AppSwipingPage from './swipingComponent/SwipingMain';
import AppProfile from './userProfileComponent/userProfile';
import AppAddCat from './userCatComponent/addCat';
import AppUserCats from './userCatComponent/userCats';
import AppUpdateCat from './userCatComponent/updateCat';
import PrivateRoute from '../../PrivateRoute';

function AppRoutes({ signUp, authLoginInfo }) {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/home" element={<AppLandingPage />} />
      <Route path="/signup" element={<AppSignUp signUp={signUp} />} />
      <Route path="/login" element={<AppLogin authLoginInfo={authLoginInfo}/>} />
      <Route path="/swipe" element={<PrivateRoute><AppSwipingPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><AppProfile /></PrivateRoute>} />
      <Route path="/addCat" element={<PrivateRoute><AppAddCat /></PrivateRoute>} />
      <Route path="/userCats" element={<PrivateRoute><AppUserCats /></PrivateRoute>} />
      <Route path="/cats/:catId/update" element={<AppUpdateCat />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default AppRoutes;
