import { Routes, Route, Navigate } from 'react-router-dom';import AppLandingPage from './landingPageComponents/LandingPage';
import AppSignUp from './SignUp';
import AppLogin from './SignIn';
import AppSwipingPage from './swipingComponent/SwipingMain';
import AppProfile from './userProfileComponent/userProfile';
import PrivateRoute from '../../PrivateRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<AppLandingPage />} />
      <Route path="/signup" element={<AppSignUp />} />
      <Route
        path="/login"
        element={
          <PrivateRoute>
            <AppLogin />
          </PrivateRoute>
        }
      />
      <Route path="/swipe" element={<AppSwipingPage />} />
      <Route path="/profile" element={<AppProfile />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default AppRoutes;
