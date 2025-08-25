import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../Common/Toast";
import axiosInstance from "../../api/axiosInstance";
import AuthLayout from "../Layout/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("verification"); // "verification" or "password"
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSendCode = async () => {
    if (!formData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }
    setIsSendingCode(true);
    try {
      const res = await axiosInstance.post("/auth/send_otp", null, {
        params : {to_email: formData.email},
      });
      console.log("Response from send_otp:", res);
      if (res.data && res.data.status === 200) {
        showToast("Verification code sent to your email!", { type: "success" });
      } else {
        showToast(res.data.message || "Failed to send code!", {
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      showToast(error.response?.data?.message || "Failed to send code!", {
        type: "error",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (activeTab === "verification") {
      if (!formData.verificationCode) {
        newErrors.verificationCode = "Verification code is required";
      }
    } else {
      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    let endpoint = "";
    let payload = {};
  
    if (activeTab === "password") {
      endpoint = "/auth/login";
      payload = {
        username_or_email: formData.email,
        password: formData.password,
      };
    } else {
      endpoint = "/auth/validate-otp";
      payload = {
        email: formData.email,
        otp_code: formData.verificationCode,
      };
    }

    try {
      
      const response = await axiosInstance.post(endpoint, payload);
      const result = response.data;
      console.log("Response from login:", response);

      if (response.status === 200) {
        // Success
        showToast(result.message || "Login successful!", {
          type: "success",
        });
        const user = result.user;
        // Save token, refreshToken and expired time
        localStorage.setItem("authToken", result.access_token);
        if (result.refresh_token) {
          localStorage.setItem("refreshToken", result.refresh_token);
        }
        if (result.expiresIn) {
          const expiredAt = Date.now() + result.expiresIn * 1000;
          localStorage.setItem("tokenExpiredAt", expiredAt);
        }
        if (user?.username) {
          localStorage.setItem("username", user.username);
        }
        // Redirect
        navigate("/dashboard/knowledge-base-management", { replace: true });
      } else if (response.status === 400 && Array.isArray(result.data)) {
        // Validation error
        const fieldErrors = {};
        result.data.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
        showToast(result.message || "Validation error!", { type: "error" });
      } else {
        // Other error
        setErrors({ general: result.message || "Login failed." });
        showToast(result.message || "Login failed!", { type: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
    
      const status = error.response?.status;
      const data = error.response?.data;
    
      if (status === 401 && data?.detail === "Need to verify") {
        showToast("You need to verify your account!", { type: "warning" });
        navigate("/verify-otp", { state: { email: formData.email } });
      } else if (status === 400 && Array.isArray(data?.data)) {
        const fieldErrors = {};
        data.data.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
        showToast(data.message || "Validation error!", { type: "error" });
      } else {
        const message =
          data?.message || data?.detail || "Login failed. Please try again.";
        setErrors({ general: message });
        showToast(message, { type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Sign in to your account to get started">
      {/* Tabs */}
      <div className="mb-4">
        <div className="d-flex border-bottom">
          <button
            type="button"
            className={`btn btn-link text-decoration-none px-3 py-2 border-0 ${
              activeTab === "verification"
                ? "text-primary border-bottom border-primary"
                : "text-muted"
            }`}
            onClick={() => setActiveTab("verification")}
            style={{
              borderBottomWidth: activeTab === "verification" ? "2px" : "0",
            }}
          >
            Verification code
          </button>
          <button
            type="button"
            className={`btn btn-link text-decoration-none px-3 py-2 border-0 ${
              activeTab === "password"
                ? "text-primary border-bottom border-primary"
                : "text-muted"
            }`}
            onClick={() => setActiveTab("password")}
            style={{
              borderBottomWidth: activeTab === "password" ? "2px" : "0",
            }}
          >
            Password
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-danger" role="alert">
            {errors.general}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-3">
          <div className="input-group input-group-lg">
            <span
              className="input-group-text bg-white border-end-0"
              style={{ borderRadius: "8px 0 0 8px" }}
            >
              <i className="bi bi-person" style={{ color: "#6b7280" }}></i>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`form-control border-start-0 ${
                errors.email ? "is-invalid" : ""
              }`}
              style={{
                borderRadius: "0 8px 8px 0",
                border: "1px solid #e5e7eb",
                padding: "12px 16px",
                fontSize: "16px",
              }}
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && (
            <div className="invalid-feedback d-block">{errors.email}</div>
          )}
        </div>

        {/* Conditional Fields based on Tab */}
        {activeTab === "verification" ? (
          <div className="mb-3">
            <div className="d-flex gap-2">
              <div className="input-group input-group-lg flex-grow-1">
                <span
                  className="input-group-text bg-white border-end-0"
                  style={{ borderRadius: "8px 0 0 8px" }}
                >
                  <i
                    className="bi bi-shield-check"
                    style={{ color: "#6b7280" }}
                  ></i>
                </span>
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Enter your code"
                  className={`form-control border-start-0 ${
                    errors.verificationCode ? "is-invalid" : ""
                  }`}
                  style={{
                    borderRadius: "0 8px 8px 0",
                    border: "1px solid #e5e7eb",
                    padding: "12px 16px",
                    fontSize: "16px",
                  }}
                  value={formData.verificationCode}
                  onChange={handleChange}
                />
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
                style={{
                  borderRadius: "8px",
                  padding: "12px 20px",
                  border: "1px solid #e5e7eb",
                  color: "rgb(0, 0, 0)",
                  whiteSpace: "nowrap",
                  backgroundColor: "rgb(39, 254, 16)",
                }}
                onClick={handleSendCode}
                disabled={isSendingCode || !formData.email}
              >
                {isSendingCode ? "Sending..." : "Send Code"}
              </button>
            </div>
            {errors.verificationCode && (
              <div className="invalid-feedback d-block">
                {errors.verificationCode}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-3">
            <div className="input-group input-group-lg">
              <span
                className="input-group-text bg-white border-end-0"
                style={{ borderRadius: "8px 0 0 8px" }}
              >
                <i className="bi bi-lock" style={{ color: "#6b7280" }}></i>
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className={`form-control border-start-0 ${
                  errors.password ? "is-invalid" : ""
                }`}
                style={{
                  borderRadius: "0 8px 8px 0",
                  border: "1px solid #e5e7eb",
                  padding: "12px 16px",
                  fontSize: "16px",
                }}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>
        )}

        {/* Auto Sign In & Forgot Password */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          {activeTab === "password" && (
            <Link
              to="/forgot-password"
              className="text-primary text-decoration-none"
              style={{ fontSize: "14px" }}
            >
              Forgot password?
            </Link>
          )}
        </div>
        {/* Sign In Button */}
        <div className="d-grid mb-4">
          <button
            type="submit"
            className="btn btn-primary btn-lg fw-semibold"
            disabled={isLoading}
            style={{
              backgroundColor: "#4f46e5",
              borderColor: "#4f46e5",
              borderRadius: "8px",
              padding: "14px 24px",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mb-4">
          <span style={{ color: "#6b7280", fontSize: "14px" }}>
            No account?{" "}
          </span>
          <Link
            to="/register"
            className="text-primary text-decoration-none fw-semibold"
            style={{ fontSize: "14px" }}
          >
            sign up now
          </Link>
        </div>

        {/* Social Login */}
        <div className="text-center">
          <div className="d-flex justify-content-center gap-3">
            <button
              type="button"
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "35px",
                height: "35px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
              }}
              onClick={() => {
                /* Handle Google login */
              }}
            >
              <i
                className="bi bi-google"
                style={{ fontSize: "15px", color: "#db4437" }}
              ></i>
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
