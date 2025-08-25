import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../Common/Toast";
import axiosInstance from "../../api/axiosInstance";
import AuthLayout from "../Layout/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Xác thực cơ bản
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        username_or_email: formData.email,
        password: formData.password,
      };

      const response = await axiosInstance.post("/auth/login", payload);
      const result = response.data;
      console.log("Response from login:", response);

      if (response.status === 200) {
        // Thành công
        showToast(result.message || "Login successful!", {
          type: "success",
        });

        const user = result.user;
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
        if (user?.role) {
          localStorage.setItem("role", user.role);
        }

        // Chuyển hướng
        navigate("/dashboard/knowledge-base-management", { replace: true });
      } else if (response.status === 400 && Array.isArray(result.data)) {
        // Lỗi xác thực
        const fieldErrors = {};
        result.data.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
        showToast(result.message || "Validation error!", { type: "error" });
      } else {
        // Các lỗi khác
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
      {/* Tab bar đã bị xóa */}
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-danger" role="alert">
            {errors.general}
          </div>
        )}

        {/* Trường Email */}
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

        {/* Trường Mật khẩu */}
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

        {/* Quên mật khẩu */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link
            to="/reset-password"
            className="text-primary text-decoration-none"
            style={{ fontSize: "14px" }}
          >
            Forgot password?
          </Link>
        </div>

        {/* Nút Đăng nhập */}
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

        {/* Liên kết đăng ký */}
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

        {/* Đăng nhập qua mạng xã hội */}
      </form>
    </AuthLayout>
  );
};

export default Login;