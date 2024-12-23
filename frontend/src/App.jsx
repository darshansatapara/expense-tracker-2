import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
import ProfileSignup from "../src/components/signupComponents/ProfileSection";
import SignIn from "./components/signinComponent/Signin";
import  Contact from "../src/pages/Contact";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profilesignup" element={<ProfileSignup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
