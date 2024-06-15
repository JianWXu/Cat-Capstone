import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppLandingPage from './landingPageComponents/LandingPage';
import AppSignUp from './SignUp';
import AppLogin from './SignIn';
import AppSwipingPage from './swipingComponent/SwipingMain'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<AppLandingPage />} />
      <Route path="/login" element={<AppLogin />} />
      <Route path="/signup" element={<AppSignUp />} />
      <Route path="/swipe" element={<AppSwipingPage/>} />
      <Route path="*" element={<Navigate to="/home" />} />
      
    </Routes>
  );
}

export default AppRoutes;
