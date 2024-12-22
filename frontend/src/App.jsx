import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
import ProfileSection from "./components/signupComponents/ProfileSection";
import SignIn from "./components/signinComponent/Signin";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup/*" element={<SignupPage />} />
        {/* <Route path="/signup/profilesignup" element={<ProfileSection />} /> */}

        <Route path="/signin" element={<SignIn />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
