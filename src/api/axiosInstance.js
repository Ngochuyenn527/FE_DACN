// File: axiosInstance.js

import axios from "axios";

const BASE_URL = "http://localhost:8053";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor cho request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Bỏ qua interceptor cho các API public
    if (
      config.url.includes("/auth/signup") ||
      config.url.includes("/auth/login") ||
      config.url.includes("/auth/forgotpassword") ||
      config.url.includes("/auth/send_otp") ||
      config.url.includes("/auth/reset-password") ||
      config.url.includes("/auth/validate-otp")
    ) {
      return config;
    }

    const token = localStorage.getItem("authToken");
    const expiredAt = localStorage.getItem("tokenExpiredAt");
    const refreshToken = localStorage.getItem("refreshToken");

    // Nếu có token và (chưa hết hạn hoặc không có expiredAt) thì dùng luôn
    if (token && (!expiredAt || Date.now() < Number(expiredAt))) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // Nếu token hết hạn và có refreshToken thì gọi refresh
    if (token && expiredAt && Date.now() >= expiredAt && refreshToken) {
      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const data = res.data?.data || {};
        const newAccess =
          data.access_token || data.accessToken || data["access token"];
        const newRefresh =
          data.refresh_token || data.refreshToken || data["refresh token"];
        const newExp = data.expires_in || data.expiresIn;

        if (newAccess) {
          localStorage.setItem("authToken", newAccess);
          if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
          if (newExp) {
            localStorage.setItem(
              "tokenExpiredAt",
              String(Date.now() + newExp * 1000)
            );
          }
          config.headers.Authorization = `Bearer ${newAccess}`;
          return config;
        }
      } catch (err) {
        // Refresh thất bại => xóa sạch token, reload
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiredAt");
        window.location.reload();
        return Promise.reject(err);
      }
    }

    // Trường hợp không có expiredAt (BE không trả), hoặc refresh fail
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // Không có token => clear + reload
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiredAt");
    window.location.reload();
    return Promise.reject(new Error("No valid token"));
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
