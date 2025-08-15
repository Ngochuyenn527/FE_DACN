import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../Common/Toast";
import axiosInstance from "../../api/axiosInstance";
import AuthLayout from "../Layout/AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/forgotpassword", {
        email: formData.email,
      });
      const result = response.data;

      if (response.status === 200 && result.status === 200) {
        // Success
        showToast(result.message || "OTP code has been sent to your email!", {
          type: "success",
        });
        // Navigate to reset password page with email
        navigate("/reset-password", { state: { email: formData.email } });
      } else if (result.status === 400 && Array.isArray(result.data)) {
        // Validation error
        const fieldErrors = {};
        result.data.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
        showToast(result.message || "Validation error!", { type: "error" });
      } else {
        // Other error
        setErrors({ general: result.message || "Failed to send OTP code." });
        showToast(result.message || "Failed to send OTP code!", {
          type: "error",
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const result = error.response.data;
        setErrors({ general: result.message || "Failed to send OTP code." });
        showToast(result.message || "Failed to send OTP code!", {
          type: "error",
        });
      } else {
        setErrors({ general: "Unable to connect to server." });
        showToast("Unable to connect to server!", { type: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Reset your password to get back to your account">
      {/* Page Title */}
      <div className="text-center mb-4">
        <h3 className="fw-bold text-dark mb-2">Forgot Password</h3>
        <p className="text-muted">
          Enter your email address and we'll send you an OTP code to reset your
          password
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-danger" role="alert">
            {errors.general}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <div className="input-group input-group-lg">
            <span
              className="input-group-text bg-white border-end-0"
              style={{ borderRadius: "8px 0 0 8px" }}
            >
              <i className="bi bi-envelope" style={{ color: "#6b7280" }}></i>
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
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

        {/* Send Code Button */}
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
                Sending OTP Code...
              </>
            ) : (
              "Send OTP Code"
            )}
          </button>
        </div>

        {/* Back to Login Link */}
        <div className="text-center">
          <Link
            to="/login"
            className="text-primary text-decoration-none fw-semibold d-flex align-items-center justify-content-center gap-2"
            style={{ fontSize: "14px" }}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
