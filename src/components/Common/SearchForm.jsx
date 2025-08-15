import React from "react";
import Input from "./Input";
import Button from "./Button";
import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";

const SearchForm = ({
  fields = [],
  values = {},
  onFieldChange,
  onSearch,
  onReset,
  isLoading = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(values);
  };

  const handleReset = () => {
    onReset();
  };

  const renderField = (field, index) => {
    const commonProps = {
      name: field.name,
      placeholder: field.placeholder,
      value: values[field.name] || (field.type === "multiselect" ? [] : ""),
      onChange: (value) => {
        if (field.type === "multiselect" || field.type === "singleselect") {
          onFieldChange(field.name, value);
        } else {
          onFieldChange(field.name, value.target ? value.target.value : value);
        }
      },
      error: field.error,
      label: field.label,
    };

    // Render MultiSelect for multiselect type
    if (field.type === "multiselect") {
      return (
        <div
          key={`${field.name}-${index}`}
          className={`col-md-${field.colSize || 3}`}
        >
          <MultiSelect
            {...commonProps}
            options={field.options || []}
            isLoading={field.isLoading || false}
            placeholder={field.placeholder || "Chọn..."}
          />
        </div>
      );
    }

    // Render SingleSelect for singleselect type
    if (field.type === "singleselect") {
      return (
        <div
          key={`${field.name}-${index}`}
          className={`col-md-${field.colSize || 3}`}
        >
          <SingleSelect
            {...commonProps}
            options={field.options || []}
            isLoading={field.isLoading || false}
            placeholder={field.placeholder || "Chọn..."}
          />
        </div>
      );
    }

    // Render regular select for select type (fallback)
    if (field.type === "select") {
      return (
        <div
          key={`${field.name}-${index}`}
          className={`col-md-${field.colSize || 3}`}
        >
          <div className="mb-3">
            {field.label && <label className="form-label">{field.label}</label>}
            <select
              className="form-select"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px 16px",
              }}
              name={field.name}
              placeholder={field.placeholder}
              value={values[field.name] || ""}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
            >
              {field.options?.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    // Render regular Input for other types
    return (
      <div
        key={`${field.name}-${index}`}
        className={`col-md-${field.colSize || 3}`}
      >
        <Input
          type={field.type || "text"}
          icon={field.icon}
          {...commonProps}
          onChange={(e) => onFieldChange(field.name, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="search-form bg-white rounded shadow-sm p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Dynamic Search Fields */}
          {fields.map((field, index) => renderField(field, index))}

          {/* Search Actions */}
          <div className="col-md-12">
            <div className="d-flex gap-2 justify-content-end">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
