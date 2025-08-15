import React from "react";
import Select from "react-select";

const SingleSelect = ({
  options = [],
  value = "",
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
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
      fontFamily: "'Inter', sans-serif",
      fontSize: "15px",
      fontWeight: "500",
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
    if (!value) return null;

    // Tìm option matching với value hiện tại
    const formattedOptions = formatOptions();
    const matchingOption = formattedOptions.find(
      (option) => String(option.value) === String(value)
    );

    if (matchingOption) {
      return matchingOption;
    }

    // Fallback cho string values
    if (typeof value === "string") {
      return { value: value, label: value };
    }

    return value;
  };

  const handleChange = (selectedOption) => {
    // Transform về string hoặc object tùy theo format ban đầu
    const newValue = selectedOption ? selectedOption.value : "";
    onChange(newValue);
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
        options={formatOptions()}
        value={formatValue()}
        onChange={handleChange}
        placeholder={placeholder}
        isLoading={isLoading}
        isDisabled={isDisabled}
        styles={customStyles}
        isClearable={true}
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

export default SingleSelect;
