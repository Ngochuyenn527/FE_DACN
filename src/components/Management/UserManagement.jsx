import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [searchValues, setSearchValues] = useState({ username: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  // Chế độ mock
  const useMockData = true;

  // -------------------- Mock Data --------------------
  const allMockUsers = [
    {
      id: 1,
      fullname: "Nguyen Van A",
      username: "nva",
      email: "nva@example.com",
      role: "Admin",
    },
    {
      id: 2,
      fullname: "Tran Thi B",
      username: "ttb",
      email: "ttb@example.com",
      role: "User",
    },
    {
      id: 3,
      fullname: "Le Van C",
      username: "lvc",
      email: "lvc@example.com",
      role: "User",
    },
    {
      id: 4,
      fullname: "Pham Thi D",
      username: "ptd",
      email: "ptd@example.com",
      role: "Admin",
    },
    {
      id: 5,
      fullname: "Do Van E",
      username: "dve",
      email: "dve@example.com",
      role: "User",
    },
    {
      id: 6,
      fullname: "Hoang Thi F",
      username: "htf",
      email: "htf@example.com",
      role: "User",
    },
  ];

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

    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter theo name
      const filtered = allMockUsers.filter((user) =>
        user.username
          .toLowerCase()
          .includes(searchValues.username.toLowerCase())
      );

      // Pagination mock
      const pageSize = 5;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      setUsers(filtered.slice(start, end));
      setTotalUsers(filtered.length);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/api/users/search", {
        params: {
          page: currentPage - 1,
          size: 5,
          query: searchValues.username
            ? `username=="*${searchValues.username}*"`
            : "",
        },
      });

      if (response.data) {
        setUsers(response.data.content);
        setTotalUsers(response.data.totalElements);
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

  const handleEdit = async (user) => {
    try {
      await axiosInstance.put(`/api/users/edit/${user.id}`);
      alert("Edit successful!");
      loadUsers();
    } catch (err) {
      alert("Edit failed.");
      console.error(err);
    }
  };

  const handleDelete = async (user) => {
    if (confirm(`Are you sure you want to delete user \"${user.fullname}\"?`)) {
      try {
        await axiosInstance.delete(`/api/users/${user.id}`);
        alert("Delete successful!");
        loadUsers();
      } catch (err) {
        alert("Delete failed.");
        console.error(err);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // -------------------- Render --------------------
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
                  <td
                    colSpan={tableColumns.length + 2}
                    className="text-center py-5"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumns.length + 2}
                    className="text-center py-4 text-muted"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <input type="checkbox" className="form-check-input" />
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
                          <i
                            className="bi bi-pencil mb-1"
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontSize: "10px" }}>Edit</span>
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={() => handleDelete(row)}
                          style={{ minWidth: "80px", fontWeight: "600" }}
                        >
                          <i
                            className="bi bi-trash3 mb-1"
                            style={{ fontSize: "14px" }}
                          ></i>
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
    </DashboardLayout>
  );
};

export default UserManagement;
