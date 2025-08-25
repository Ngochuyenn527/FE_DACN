import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../Common/Toast";
import axiosInstance from "../../api/axiosInstance";
import AuthLayout from "../Layout/AuthLayout";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("verify"); // "verify" or "reset"
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
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
        params: { to_email: formData.email},
      });

      if (res.status === 200) {
        showToast("Verification code sent to your email!", { type: "success" });
      } else {
        showToast(res.data.message || "Failed to send code!", {
          type: "error",
        });
      }
    } catch (error) {
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

    if (currentStep === "verify") {
      // Step 1: Verify OTP code
      const newErrors = {};
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.verificationCode.trim()) {
        newErrors.verificationCode = "Verification code is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.post("/auth/validate-otp", {
          email: formData.email,
          otp_code: formData.verificationCode,
        });
        if (response.status === 200) {
          showToast("Verification successful!", { type: "success" });
          setCurrentStep("reset");
        } else {
          setErrors({
            general: response.data.message || "Invalid verification code",
          });
          showToast(response.data.message || "Invalid verification code!", {
            type: "error",
          });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Verification failed";
        setErrors({ general: errorMessage });
        showToast(errorMessage, { type: "error" });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Step 2: Reset password
      const newErrors = {};
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      }
      if (!formData.newPassword.trim()) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.post("/auth/reset-password", {
          email: formData.email,
          new_password: formData.newPassword,
        });

        if (response.status === 200) {
          showToast("Password reset successfully!", { type: "success" });
          navigate("/login");
        } else {
          setErrors({
            general: response.data.message || "Failed to reset password",
          });
          showToast(response.data.message || "Failed to reset password!", {
            type: "error",
          });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to reset password";
        setErrors({ general: errorMessage });
        showToast(errorMessage, { type: "error" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthLayout subtitle="Reset your password to get back to your account">
      {/* Step Progress Indicator */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-center position-relative">
          {/* Step 1: Verify */}
          <div className="d-flex flex-column align-items-center">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                currentStep === "verify"
                  ? "bg-primary text-white"
                  : currentStep === "reset"
                  ? "bg-success text-white"
                  : "bg-light text-muted"
              }`}
              style={{
                width: "48px",
                height: "48px",
                fontSize: "18px",
                fontWeight: "600",
                border:
                  currentStep === "verify"
                    ? "3px solid #4f46e5"
                    : currentStep === "reset"
                    ? "3px solid #10b981"
                    : "3px solid #e5e7eb",
              }}
            >
              {currentStep === "reset" ? (
                <i className="bi bi-check-lg"></i>
              ) : (
                "1"
              )}
            </div>
            <span
              className={`fw-semibold ${
                currentStep === "verify"
                  ? "text-primary"
                  : currentStep === "reset"
                  ? "text-success"
                  : "text-muted"
              }`}
              style={{ fontSize: "14px" }}
            >
              Verify
            </span>
          </div>

          {/* Connection Line */}
          <div
            className="mx-4"
            style={{
              width: "60px",
              height: "3px",
              backgroundColor: currentStep === "reset" ? "#10b981" : "#e5e7eb",
              borderRadius: "2px",
            }}
          ></div>

          {/* Step 2: Reset */}
          <div className="d-flex flex-column align-items-center">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                currentStep === "reset"
                  ? "bg-primary text-white"
                  : "bg-light text-muted"
              }`}
              style={{
                width: "48px",
                height: "48px",
                fontSize: "18px",
                fontWeight: "600",
                border:
                  currentStep === "reset"
                    ? "3px solid #4f46e5"
                    : "3px solid #e5e7eb",
              }}
            >
              2
            </div>
            <span
              className={`fw-semibold ${
                currentStep === "reset" ? "text-primary" : "text-muted"
              }`}
              style={{ fontSize: "14px" }}
            >
              Reset
            </span>
          </div>
        </div>

        {/* Step Description */}
        <div className="text-center mt-3">
          <h5 className="fw-bold text-dark mb-2">
            {currentStep === "verify" ? "Email Verification" : "Reset Password"}
          </h5>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            {currentStep === "verify"
              ? "Enter your email and verification code to proceed"
              : "Enter your old password and create a new one"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-danger" role="alert">
            {errors.general}
          </div>
        )}

        {currentStep === "verify" ? (
          // Step 1: Verify
          <>
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
                  placeholder="Enter your email"
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

            {/* Verification Code Field */}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSendCode();
                  }}
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

            {/* Next Step Button */}
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
                    Verifying...
                  </>
                ) : (
                  "Next Step"
                )}
              </button>
            </div>
          </>
        ) : (
          // Step 2: Reset Password
          <>
            {/* Email Field (Read-only) */}
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
                  className="form-control border-start-0"
                  style={{
                    borderRadius: "0 8px 8px 0",
                    border: "1px solid #e5e7eb",
                    padding: "12px 16px",
                    fontSize: "16px",
                    backgroundColor: "#f9fafb",
                  }}
                  value={formData.email}
                  readOnly
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="mb-3">
              <div className="input-group input-group-lg">
                <span
                  className="input-group-text bg-white border-end-0"
                  style={{ borderRadius: "8px 0 0 8px" }}
                >
                  <i className="bi bi-key" style={{ color: "#6b7280" }}></i>
                </span>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className={`form-control border-start-0 ${
                    errors.newPassword ? "is-invalid" : ""
                  }`}
                  style={{
                    borderRadius: "0 8px 8px 0",
                    border: "1px solid #e5e7eb",
                    padding: "12px 16px",
                    fontSize: "16px",
                  }}
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.newPassword && (
                <div className="invalid-feedback d-block">
                  {errors.newPassword}
                </div>
              )}
            </div>

            {/* Reset Password Button */}
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </>
        )}

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