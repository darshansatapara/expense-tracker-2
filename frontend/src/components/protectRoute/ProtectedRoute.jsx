import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userStore } from "../../store/UserStore/userAuthStore.js"; // Adjust path as needed

const ProtectedRoute = () => {
  const { currentUser, checkAuth, isLoading } = userStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!currentUser) {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };
    verifyAuth();
  }, [currentUser, checkAuth]);

  if (isChecking || isLoading) {
    return <div>Loading...</div>; // Replace with a proper loading spinner if needed
  }

  return currentUser ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;