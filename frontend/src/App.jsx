import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "../src/pages/SignupPage";
import ProfileSection from "./components/signupComponents/ProfileSection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup/*" element={<SignupPage />} />
        {/* <Route path="/signup/profilesignup" element={<ProfileSection />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
