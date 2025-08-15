import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    // Chỉ kiểm tra token
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    return !!token;
  };

  // Nếu chưa đăng nhập, redirect về login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị component
  return children;
};

export default ProtectedRoute;
