import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const sizeClass = size ? ` btn-${size}` : "";
  const customClass = className ? ` ${className}` : "";

  return (
    <button
      type={type}
      className={`btn btn-${variant}${sizeClass}${customClass}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
