import { Routes, Route } from 'react-router-dom';
import AppLandingPage from './landingPageComponents/LandingPage';
import AppSignUp from './SignUp';
import AppLogin from './SignIn';
import AppSwipingPage from './swipingComponent/SwipingMain';
import AppProfile from './userProfileComponent/userProfile';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<AppLandingPage />} />
      <Route path="/signup" element={<AppSignUp />} />
      <Route path="/login" element={<AppLogin />} />
      <Route path="/swipe" element={<AppSwipingPage />} />
      <Route path="/profile" element={<AppProfile />} />
    </Routes>
  );
}

export default AppRoutes;
