import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../Common/Toast";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailCode: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    console.log("handleSendCode clicked, email:", formData.email);
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
      const res = await axiosInstance.post("/auth/send_otp", {
        to_email: formData.email,
      });
      console.log("Response from send_otp:", res);
      if (res.data && res.data.status === 200) {
        setCodeSent(true);
        showToast("Verification code sent to your email!", { type: "success" });
      } else {
        showToast(res.data.message || "Failed to send code!", {
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error in handleSendCode:", error, error.response);
      showToast(error.response?.data?.message || "Failed to send code!", {
        type: "error",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.emailCode.trim()) {
      newErrors.emailCode = "Email verification code is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    try {
      const payload = {
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        emailCode: formData.emailCode,
      };
      const res = await axiosInstance.post("/auth/signup", payload);
      if (res.data && res.data.status === 200) {
        showToast(res.data.message || "Registration successful!", {
          type: "success",
        });
        navigate("/login", { state: { email: formData.email } });
      } else {
        showToast(res.data.message || "Registration failed!", {
          type: "error",
        });
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Registration failed!", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      subtitle="Register your account to get started"
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <label
                className="form-label fw-medium"
                style={{ color: "#6b7280", fontSize: "14px" }}
              >
                <span className="text-danger">*</span> Username :
              </label>
              <input
                type="text"
                name="username"
                className={`form-control form-control-lg ${
                  errors.username ? "is-invalid" : ""
                }`}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  padding: "12px 16px",
                  fontSize: "16px",
                }}
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            <div className="mb-3">
              <label
                className="form-label fw-medium"
                style={{ color: "#6b7280", fontSize: "14px" }}
              >
                <span className="text-danger">*</span> Password :
              </label>
              <input
                type="password"
                name="password"
                className={`form-control form-control-lg ${
                  errors.password ? "is-invalid" : ""
                }`}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  padding: "12px 16px",
                  fontSize: "16px",
                }}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            <div className="mb-3">
              <label
                className="form-label fw-medium"
                style={{ color: "#6b7280", fontSize: "14px" }}
              >
                <span className="text-danger">*</span> Display name :
              </label>
              <input
                type="text"
                name="displayName"
                className={`form-control form-control-lg ${
                  errors.displayName ? "is-invalid" : ""
                }`}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  padding: "12px 16px",
                  fontSize: "16px",
                }}
                value={formData.displayName}
                onChange={handleChange}
              />
              {errors.displayName && (
                <div className="invalid-feedback">{errors.displayName}</div>
              )}
            </div>

            <div className="mb-3">
              <label
                className="form-label fw-medium"
                style={{ color: "#6b7280", fontSize: "14px" }}
              >
                <span className="text-danger">*</span> Confirm :
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-control form-control-lg ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  padding: "12px 16px",
                  fontSize: "16px",
                }}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>
          </div>
        </div>

        {/* Email - Full Width */}
        <div className="mb-3">
          <label
            className="form-label fw-medium"
            style={{ color: "#6b7280", fontSize: "14px" }}
          >
            <span className="text-danger">*</span> Email :
          </label>
          <input
            type="email"
            name="email"
            className={`form-control form-control-lg ${
              errors.email ? "is-invalid" : ""
            }`}
            style={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              padding: "12px 16px",
              fontSize: "16px",
            }}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        {/* Email Code - Full Width with Button */}
        <div className="mb-3">
          <label
            className="form-label fw-medium"
            style={{ color: "#6b7280", fontSize: "14px" }}
          >
            <span className="text-danger">*</span> Email code :
          </label>
          <div className="d-flex gap-2">
            <input
              type="text"
              name="emailCode"
              placeholder="Enter your code"
              className={`form-control form-control-lg ${
                errors.emailCode ? "is-invalid" : ""
              }`}
              style={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                padding: "12px 16px",
                fontSize: "16px",
                flex: 1,
              }}
              value={formData.emailCode}
              onChange={handleChange}
            />
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
          {errors.emailCode && (
            <div className="invalid-feedback d-block">{errors.emailCode}</div>
          )}
        </div>

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
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        <div className="text-center mb-4">
          <span style={{ color: "#6b7280", fontSize: "14px" }}>
            Have account?{" "}
          </span>
          <Link
            to="/login"
            className="text-primary text-decoration-none fw-semibold"
            style={{ fontSize: "14px" }}
          >
            sign in now
          </Link>
        </div>

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

export default Register;
