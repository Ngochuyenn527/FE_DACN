import React from "react";

const Logo = ({ className = "", size = "large" }) => {
  const sizeClasses = {
    small: "fs-5",
    medium: "fs-3",
    large: "fs-1",
  };

  return (
    <div
      className={`text-white ${sizeClasses[size]} ${className}`}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: "700",
        letterSpacing: "-0.03em",
        lineHeight: "1.1",
        fontFeatureSettings: "'cv02', 'cv03', 'cv04', 'cv11'",
      }}
    >
      <div className="mb-2" style={{ fontWeight: "700" }}>
        BUDDY-SMART
      </div>
      <div style={{ fontWeight: "600", letterSpacing: "-0.02em" }}>
        MANAGEMENT
      </div>
      <div
        className="mt-2"
        style={{
          fontSize: "0.35em",
          fontWeight: "500",
          letterSpacing: "0.05em",
          opacity: "0.9",
          textTransform: "uppercase",
        }}
      >
        Smart Management System
      </div>
    </div>
  );
};

export default Logo;
