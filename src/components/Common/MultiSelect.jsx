import React from "react";
import Select from "react-select";

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = "Chọn...",
  isLoading = false,
  isDisabled = false,
  error = "",
  label = "",
  className = "",
  ...props
}) => {
  // Custom styles cho react-select để match với Bootstrap theme
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      border: error ? "2px solid #dc3545" : "2px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(37, 99, 235, 0.1)" : "none",
      borderColor: state.isFocused ? "#2563eb" : error ? "#dc3545" : "#e5e7eb",
      fontFamily: "'Inter', sans-serif",
      fontSize: "15px",
      fontWeight: "400",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: state.isFocused ? "#2563eb" : "#9ca3af",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#eff6ff",
      borderRadius: "6px",
      border: "1px solid #dbeafe",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#1e40af",
      fontFamily: "'Inter', sans-serif",
      fontSize: "13px",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#6b7280",
      "&:hover": {
        backgroundColor: "#fecaca",
        color: "#dc2626",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontFamily: "'Inter', sans-serif",
      fontSize: "15px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
        ? "#eff6ff"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      fontFamily: "'Inter', sans-serif",
      fontSize: "14px",
      fontWeight: state.isSelected ? "500" : "400",
      "&:hover": {
        backgroundColor: state.isSelected ? "#2563eb" : "#eff6ff",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px",
      maxHeight: "200px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#6b7280",
    }),
  };

  // Transform options nếu cần
  const formatOptions = () => {
    return options.map((option) => {
      if (typeof option === "string") {
        return { value: option, label: option };
      }
      return option;
    });
  };

  // Transform value cho react-select
  const formatValue = () => {
    if (!value || value.length === 0) return [];

    return value.map((val) => {
      if (typeof val === "string") {
        return { value: val, label: val };
      }
      return val;
    });
  };

  const handleChange = (selectedOptions) => {
    // Transform về array của strings hoặc objects tùy theo format ban đầu
    const values = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    onChange(values);
  };

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label
          className="form-label"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: "500",
            fontSize: "14px",
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}

      <Select
        isMulti
        options={formatOptions()}
        value={formatValue()}
        onChange={handleChange}
        placeholder={placeholder}
        isLoading={isLoading}
        isDisabled={isDisabled}
        styles={customStyles}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        components={{
          IndicatorSeparator: () => null,
        }}
        {...props}
      />

      {error && (
        <div
          className="invalid-feedback d-block"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
