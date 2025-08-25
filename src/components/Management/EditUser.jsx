import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import Input from "../Common/Input";
import Button from "../Common/Button";
import axiosInstance from "../../api/axiosInstance";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    username: "",
    email: "",
    role: "",
    created_at: "",
    updated_at: "",
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(`/api/users/${id}`);
      const user = response.data.data || response.data;

      if (!user) throw new Error("User not found");

      setFormData({
        id: user._id || "",
        full_name: user.full_name || "",
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        created_at: formatDateTime(user.created_at),
        updated_at: formatDateTime(user.updated_at),
      });
    } catch (err) {
      console.error("Error fetching user:", err);
      alert("Failed to load user.");
      navigate("/dashboard/users");
    }
  };

  useEffect(() => {
    if (id) {
      setIsFetching(true);
      fetchUser().finally(() => setIsFetching(false));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };
      await axiosInstance.put(`/api/users/${id}`, payload);
      alert("User updated successfully!");
      fetchUser();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => navigate("/dashboard/users");

  if (isFetching) {
    return (
      <DashboardLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <div
              className="spinner-border text-primary mb-3"
              role="status"
            ></div>
            <p className="text-muted">Loading user data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-1">Edit User</h4>
            <p className="text-muted mb-0">Modify user information</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={handleCancel}>
              <i className="bi bi-arrow-left"></i> Back to Users
            </Button>
          </div>
        </div>

        {/* Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="alert alert-danger mb-4">
            <h6>Please fix the following errors:</h6>
            <ul>
              {Object.entries(errors).map(([field, msg]) => (
                <li key={field}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Input
                label="User ID"
                name="id"
                value={formData.id}
                disabled
                icon="bi bi-hash"
              />
            </div>
            <div className="col-md-6 mb-3">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                error={errors.full_name}
                icon="bi bi-person"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={errors.username}
                icon="bi bi-person-badge"
              />
            </div>
            <div className="col-md-6 mb-3">
              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                icon="bi bi-envelope"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Input
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                error={errors.role}
                icon="bi bi-shield-lock"
              />
            </div>
            <div className="col-md-3 mb-3">
              <Input
                label="Created At"
                name="created_at"
                value={formData.created_at}
                disabled
                icon="bi bi-calendar-plus"
              />
            </div>
            <div className="col-md-3 mb-3">
              <Input
                label="Updated At"
                name="updated_at"
                value={formData.updated_at}
                disabled
                icon="bi bi-calendar-check"
              />
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-end pt-3 border-top">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;
