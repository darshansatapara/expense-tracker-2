import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userStore } from "../../store/UserStore/userStore.js";

const ProtectedRoute = () => {
  const isAuthenticated = userStore.getState().checkAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
