import React from "react";

const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  icon = null,
  error = "",
  label = "",
  ...props
}) => {
  const inputClass = `form-control${className ? ` ${className}` : ""}${
    error ? " is-invalid" : ""
  }`;

  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <div className={icon ? "input-group" : ""}>
        {icon && (
          <span className="input-group-text">
            <i className={icon}></i>
          </span>
        )}
        <input
          type={type}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input;
