import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userStore } from "../../store/userStore";

const ProtectedRoute = () => {
  const isAuthenticated = userStore.getState().checkAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
