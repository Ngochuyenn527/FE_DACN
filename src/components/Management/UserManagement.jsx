import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../Common/Toast";
import { Link, useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [searchValues, setSearchValues] = useState({ username: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  // State mới cho modal xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchFields = [
    {
      name: "username",
      placeholder: "Search by user name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "User Name",
    },
  ];

  const tableColumns = [
    { key: "fullname", label: "Name", width: "200px" },
    { key: "username", label: "Username", width: "220px" },
    { key: "email", label: "Email", width: "150px" },
    { key: "role", label: "Role", width: "120px" },
  ];

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchValues]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/v2/users/", {
        params: {
          page: currentPage - 1,
          size: 5,
          query: searchValues.username
            ? `user_name=="*${searchValues.username}*"`
            : "",
        },
      });

      if (response.data) {
        // Map API -> UI
        const mappedUsers = response.data.map((u) => ({
          id: u.id,
          fullname: u.full_name,
          username: u.username,
          email: u.email,
          role: u.role,
        }));

        setUsers(mappedUsers);
        setTotalUsers(response.data.length); // vì API trả mảng
      } else {
        setUsers([]);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchFieldChange = (fieldName, value) => {
    setCurrentPage(1);
    setSearchValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchValues({ username: "" });
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    navigate(`/dashboard/users/edit/${user.id}`);
  };

  // Hàm để mở modal xác nhận xóa
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Hàm để đóng modal xác nhận xóa
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Hàm thực hiện xóa khi được xác nhận
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/api/v2/users/${userToDelete.id}`);
      showToast("Delete successful!", { type: "success" });
      loadUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Delete failed. Please try again.";
      showToast(message, { type: "error" });
    } finally {
      setIsDeleting(false);
      handleCloseDeleteModal();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">User Management</h5>
      </div>

      {/* Search */}
      <SearchForm
        fields={searchFields}
        values={searchValues}
        onFieldChange={handleSearchFieldChange}
        onSearch={handleSearch}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Table */}
      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 text-center">
            <thead className="table-light">
              <tr>
                <th style={{ width: "50px" }}></th>
                {tableColumns.map((col, i) => (
                  <th key={i} style={{ width: col.width || "auto" }}>
                    {col.label}
                  </th>
                ))}
                <th style={{ width: "300px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={tableColumns.length + 2} className="text-center py-5">
                    Loading data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length + 2} className="text-center py-4 text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={(e) => {
                          if (e.target.checked) {
                            console.log("Checked user id:", row.id);
                          } else {
                            console.log("Unchecked user id:", row.id);
                          }
                        }}
                      />
                    </td>
                    {tableColumns.map((col, colIndex) => (
                      <td key={colIndex}>{row[col.key]}</td>
                    ))}
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-outline-warning btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={() => handleEdit(row)}
                          style={{ minWidth: "60px", fontWeight: "600" }}
                        >
                          <i className="bi bi-pencil mb-1" style={{ fontSize: "14px" }}></i>
                          <span style={{ fontSize: "10px" }}>Edit</span>
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={() => handleOpenDeleteModal(row)}
                          style={{ minWidth: "80px", fontWeight: "600" }}
                        >
                          <i className="bi bi-trash3 mb-1" style={{ fontSize: "14px" }}></i>
                          <span style={{ fontSize: "10px" }}>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalUsers / 5)}
        totalItems={totalUsers}
        itemsPerPage={5}
        onPageChange={handlePageChange}
      />

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={(e) => e.target === e.currentTarget && handleCloseDeleteModal()}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-semibold">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
              </div>
              <div className="modal-body pt-0">
                <p>Are you sure you want to delete user "<strong>{userToDelete?.fullname}</strong>"?</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteModal}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserManagement;