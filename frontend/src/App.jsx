import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
<<<<<<< HEAD
import ProfileSection from "../src/components/signupComponents/ProfileSection";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage";
=======
import SignIn from "./components/signinComponent/Signin";
>>>>>>> be8dc402662d68c2a7c3abc347bd6c7731f2125f

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup/*" element={<SignupPage />} />
<<<<<<< HEAD
        {/* <Route path="/signup/profilesignup" element={<ProfileSection />} /> */}

        <Route path="/signin" element={<SigninPage />} />
        <Route path="/" element={<HomePage />} />
=======
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/signup/profilesignup" element={<ProfileSection />} /> */}
>>>>>>> be8dc402662d68c2a7c3abc347bd6c7731f2125f
      </Routes>
    </BrowserRouter>
  );
}

export default App;
