import React from "react";

const AuthLayout = ({
  children,
  subtitle = "Sign in to your account to get started",
  maxWidth = "500px",
}) => {
  return (
    <div className="min-vh-100 d-flex">
      {/* Left Sidebar - Blue Background */}
      <div
        className="col-md-5 d-none d-md-flex align-items-center justify-content-center position-relative"
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
          minHeight: "100vh",
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="display-4 fw-bold mb-3" style={{ fontSize: "3.5rem" }}>
            BUDDY-SMART
            <br />
            MANAGEMENT
          </h1>
          <p className="fs-5 mb-4 opacity-90">SMART MANAGEMENT SYSTEM</p>
          <p className="fs-6 opacity-75">{subtitle}</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="col-md-7 col-12 d-flex align-items-center justify-content-center bg-white">
        <div className="w-100 px-5 py-4" style={{ maxWidth }}>
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="d-flex me-3">
                <img
                  src="/src/assets/logo.svg"
                  alt="Logo"
                  width="32"
                  height="32"
                  className="me-2"
                />
              </div>
              <h2
                className="fw-bold text-dark mb-0"
                style={{ fontSize: "1.8rem" }}
              >
                BUDDY
              </h2>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
