import {Route, Routes, Navigate} from "react-router-dom"
import SignIn from "../sign-in-side/SignInSide";
import SignUp from "../sign-up/SignUp"

function AppRoutes() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }


export default AppRoutes;