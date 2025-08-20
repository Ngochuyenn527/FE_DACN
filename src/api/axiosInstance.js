// File Cấu hình xác thực token

import axios from "axios";

// Base URL của API backend
const BASE_URL = "http://localhost:8053";

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 giây
});

// Interceptor cho request: tự động thêm accessToken nếu còn hạn
axiosInstance.interceptors.request.use(
  async (config) => {
    // Bỏ qua interceptor cho các API public không cần token
    if (
      config.url.includes("/auth/register") ||
      config.url.includes("/auth/login") ||
      config.url.includes("/auth/forgotpassword") ||
      config.url.includes("/auth/verifyotp") ||
      config.url.includes("/auth/resetpassword")
    ) {
      return config;
    }
    const token = localStorage.getItem("authToken");
    const expiredAt = localStorage.getItem("tokenExpiredAt");
    const refreshToken = localStorage.getItem("refreshToken");
    // Nếu có token và còn hạn thì thêm vào header
    if (token && expiredAt && Date.now() < Number(expiredAt)) {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }
    // Nếu token hết hạn, thử refresh
    if (refreshToken) {
      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        if (res.data && res.data.status === 200 && res.data.data) {
          const {
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn,
          } = res.data.data;
          localStorage.setItem("authToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          if (expiresIn) {
            const newExpiredAt = Date.now() + expiresIn * 1000;
            localStorage.setItem("tokenExpiredAt", newExpiredAt);
          }
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          return config;
        } else {
          // Refresh thất bại
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenExpiredAt");
          window.location.reload();
          return Promise.reject(new Error("Refresh token failed"));
        }
      } catch (err) {
        // Refresh thất bại
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiredAt");
        window.location.reload();
        return Promise.reject(err);
      }
    }
    // Không có refreshToken hoặc không hợp lệ
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiredAt");
    window.location.reload();
    return Promise.reject(new Error("No valid token"));
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
