import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
import ProfileSignup from "./components/signupComponents/ProfileSignup";
import SignIn from "./components/signinComponent/Signin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profilesignup" element={<ProfileSignup />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
