import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
import ProfileSection from "../src/components/signupComponents/ProfileSection";
import SigninPage from "./pages/SigninPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup/*" element={<SignupPage />} />
        {/* <Route path="/signup/profilesignup" element={<ProfileSection />} /> */}

        <Route path="/signin" element={<SigninPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
