import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Hàm tiện ích để show toast ở bất kỳ đâu
export const showToast = (message, options = {}) => {
  toast(message, {
    position: options.position || "top-right",
    autoClose: options.autoClose || 3000,
    hideProgressBar: options.hideProgressBar || false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: options.type || "default", // "success", "error", "info", "warning"
    ...options,
  });
};

// Component ToastContainer dùng 1 lần ở App gốc
const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};

export default Toast;
