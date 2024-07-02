import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserContext from '../../UserContext';
import AppLandingPage from './landingPageComponents/LandingPage';
import AppSignUp from './SignUp';
import AppLogin from './SignIn';
import AppSwipingPage from './swipingComponent/SwipingMain';
import AppProfile from './userProfileComponent/userProfile';
import AppAddCat from './userCatComponent/addCat';
import AppUserCats from './userCatComponent/userCats'; // Assuming the correct import path
import AppCatDetails from './userCatComponent/catDetail'
import PrivateRoute from '../../PrivateRoute';

function AppRoutes() {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/home" element={<AppLandingPage />} />
      <Route path="/signup" element={<AppSignUp />} />
      <Route path="/login" element={<AppLogin />} />
      <Route path="/swipe" element={<AppSwipingPage />} />
      <Route path="/profile" element={<PrivateRoute><AppProfile /></PrivateRoute>} />
      <Route path="/addCat" element={<PrivateRoute><AppAddCat /></PrivateRoute>} />
      <Route path="/userCats" element={user ? <AppUserCats shouldShowUserCats={true} /> : <Navigate to="/" />} />
      <Route path="/cat/:catId" element={<AppCatDetails />} />

      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default AppRoutes;
