import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showToast } from "./Toast";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  // Fetch user info
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await axiosInstance.get("/auth/aboutme");
  //       if (res.data && res.data.status === 200) {
  //         setUsername(res.data.data);
  //       }
  //     } catch (err) {
  //       if (err.response && err.response.status === 401) {
  //         showToast("Phiên đăng nhập đã hết hạn!", { type: "error" });
  //         localStorage.removeItem("authToken");
  //         localStorage.removeItem("refreshToken");
  //         localStorage.removeItem("tokenExpiredAt");
  //         navigate("/login");
  //       }
  //     }
  //   };
  //   fetchUser();
  // }, [navigate]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiredAt");
    localStorage.removeItem("username");
    localStorage.removeItem("full_name");
  
    // Reset state UI (nếu có)
    setUsername("");
  
    // Hiển thị thông báo
    showToast("Log out successfully!", { type: "success" });
  
    // Chuyển hướng về trang login
    navigate("/login");
  };
  const handleResetPassword = () => {
    navigate("/reset-password");
    }

  const baseMenuItems = [
    {
      path: "/dashboard/knowledge-base-management",
      icon: "bi bi-database",
      label: "Knowledge Base",
      active: location.pathname.includes("/dashboard/knowledge-base-management"),
    },
    {
      path: "/dashboard/chat-management",
      icon: "bi bi-chat-dots",
      label: "Chat",
      active: location.pathname.includes("/dashboard/chat-management"),
    },
    {
      path: "/dashboard/file-management",
      icon: "bi bi-folder2-open",
      label: "File Management",
      active: location.pathname.includes("/dashboard/file-management"),
    },
  ];
  
  if (role === "admin") {
    baseMenuItems.push({
      path: "/dashboard/user-management",
      icon: "bi bi-person",
      label: "User Management",
      active: location.pathname.includes("/dashboard/user-management"),
    });
  }
  
  const menuItems = baseMenuItems;

  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3"
      style={{
        background:
          "linear-gradient(135deg,rgb(255,255,255) 0%,rgb(194,241,255) 100%)",
        height: "74px",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo bên trái */}
        <Link
          to="/dashboard/knowledge-base-management"
          className="navbar-brand d-flex align-items-center text-decoration-none"
        >
          <img
            src="/src/assets/logo.svg"
            alt="Logo"
            width="32"
            height="32"
            className="me-2"
          />
          <div>
            <span
              className="fw-bold"
              style={{ color: "#1e40af", letterSpacing: "-0.5px" }}
            >
              BUDDY
            </span>
            <p className="mb-0" style={{ fontSize: "12px", color: "#3b82f6" }}>
              Smart Management
            </p>
          </div>
        </Link>

        {/* Menu ở giữa */}
        <ul className="navbar-nav flex-row mx-auto">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item mx-2">
              <Link
                to={item.path}
                className={`d-flex align-items-center px-3 py-2 text-decoration-none transition-all rounded ${
                  item.active
                    ? "bg-primary text-white"
                    : "text-muted hover-bg-light"
                }`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: item.active ? "600" : "500",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                }}
              >
                <i
                  className={`${item.icon} me-2`}
                  style={{ fontSize: "18px" }}
                ></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side - User menu */}
        <div className="navbar-nav ms-auto">
          <div className="nav-item dropdown">
            <button
              className="btn btn-link nav-link dropdown-toggle d-flex align-items-center text-decoration-none border-0 bg-transparent"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* User Avatar */}
              <div className="d-flex align-items-center">
                <div
                  className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-person text-white"></i>
                </div>
                <div className="text-start d-none d-md-block">
                  <div
                    className="fw-semibold text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    {username || "Guest"}
                  </div>
                  <small className="text-muted"></small>
                </div>
                {/* <i className="bi bi-chevron-down ms-2 text-muted"></i> */}
              </div>
            </button>

            {/* Dropdown Menu */}
            <ul
              className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2"
              style={{
                minWidth: "200px",
                zIndex: 2000,
                position: "absolute",
              }}
            >
              <li>
                <button
                  className="dropdown-item d-flex align-items-center py-2 text-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-3"></i>
                  Logout
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center py-2 text-secondary"
                  onClick={handleResetPassword}
                >
                  <i className="bi bi-key me-3"></i>
                  Reset Password
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
