import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './components/Signup/Signup'; // Adjust the path if necessary

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
