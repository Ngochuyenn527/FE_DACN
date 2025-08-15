import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import Button from "../Common/Button";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../Common/Toast";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy email từ location state
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      // Nếu không có email, quay lại trang đăng ký
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (error) setError("");
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedNumbers = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pastedNumbers[i] || "";
        }
        setOtp(newOtp);
        const nextIndex = Math.min(pastedNumbers.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const payload = {
        email: email,
        otp: otpString,
      };
      const res = await axiosInstance.post("/auth/verifyotp", payload);
      if (res.data && res.data.status === 200) {
        showToast(res.data.message || "OTP verification successful!", {
          type: "success",
        });
        navigate("/login");
      } else {
        showToast(res.data.message || "OTP verification failed!", {
          type: "error",
        });
      }
    } catch (err) {
      showToast(err.response?.data?.message || "OTP verification failed!", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    try {
      const payload = { email, isReset: false };
      const res = await axiosInstance.post("/auth/resendotp", payload);
      if (res.data && res.data.status === 200) {
        showToast(res.data.message || "OTP resent!", {
          type: "success",
        });
        setResendTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        showToast(res.data.message || "Failed to resend OTP!", {
          type: "error",
        });
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to resend OTP!", {
        type: "error",
      });
    }
  };

  return (
    <AuthLayout subtitle="Xác thực tài khoản để tiếp tục">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-2">OTP Verification</h2>
        <p className="text-muted mb-3">
          We have sent a 6-digit verification code to
          <br />
          <strong>{email}</strong>
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        {/* OTP Input Fields */}
        <div className="d-flex justify-content-center gap-2 mb-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className={`form-control text-center fw-bold fs-4 ${
                error ? "is-invalid" : ""
              }`}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "8px",
                border: "2px solid #dee2e6",
              }}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        {error && (
          <div className="alert alert-danger text-center py-2 mb-3">
            <small>{error}</small>
          </div>
        )}
        <div className="d-grid mb-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || otp.join("").length !== 6}
            className="py-3 fw-semibold"
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
              "Verify OTP"
            )}
          </Button>
        </div>
        {/* Resend OTP */}
        <div className="text-center mb-3">
          {canResend ? (
            <button
              type="button"
              className="btn btn-link text-primary text-decoration-none p-0"
              onClick={handleResendOTP}
            >
              Resend OTP
            </button>
          ) : (
            <span className="text-muted">Resend in {resendTimer}s</span>
          )}
        </div>
        <div className="text-center">
          <Link to="/login" className="text-muted text-decoration-none">
            ← Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OTPVerification;
