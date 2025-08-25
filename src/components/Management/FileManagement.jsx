import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";

const FileManagement = () => {
  const [searchValues, setSearchValues] = useState({ name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Chế độ mock
  const useMockData = true;

  // -------------------- Mock Data --------------------
  const allMockFiles = [
    {
      id: 1,
      name: "AI_Engineer.pdf",
      type: "pdf",
      uploadDate: "03/04/2025 12:48:32",
      size: "46.42 KB",
      knowledgeBase: "AI",
      icon: "bi-file-earmark-pdf",
      iconColor: "text-danger",
    },
    {
      id: 2,
      name: "ProjectPlan.docx",
      type: "docx",
      uploadDate: "01/04/2025 09:12:15",
      size: "120.11 KB",
      knowledgeBase: "Management",
      icon: "bi-file-earmark-word",
      iconColor: "text-primary",
    },
    {
      id: 3,
      name: "Dataset.zip",
      type: "zip",
      uploadDate: "28/03/2025 14:33:51",
      size: "1.2 MB",
      knowledgeBase: "Data",
      icon: "bi-file-earmark-zip",
      iconColor: "text-warning",
    },
    {
      id: 4,
      name: "Presentation.pptx",
      type: "pptx",
      uploadDate: "25/03/2025 08:45:00",
      size: "2.5 MB",
      knowledgeBase: "Report",
      icon: "bi-file-earmark-ppt",
      iconColor: "text-danger",
    },
    {
      id: 1,
      name: "AI_Engineer.pdf",
      type: "pdf",
      uploadDate: "03/04/2025 12:48:32",
      size: "46.42 KB",
      knowledgeBase: "AI",
      icon: "bi-file-earmark-pdf",
      iconColor: "text-danger",
    },
    {
      id: 2,
      name: "ProjectPlan.docx",
      type: "docx",
      uploadDate: "01/04/2025 09:12:15",
      size: "120.11 KB",
      knowledgeBase: "Management",
      icon: "bi-file-earmark-word",
      iconColor: "text-primary",
    },
    {
      id: 3,
      name: "Dataset.zip",
      type: "zip",
      uploadDate: "28/03/2025 14:33:51",
      size: "1.2 MB",
      knowledgeBase: "Data",
      icon: "bi-file-earmark-zip",
      iconColor: "text-warning",
    },
    {
      id: 4,
      name: "Presentation.pptx",
      type: "pptx",
      uploadDate: "25/03/2025 08:45:00",
      size: "2.5 MB",
      knowledgeBase: "Report",
      icon: "bi-file-earmark-ppt",
      iconColor: "text-danger",
    },
  ];

  const searchFields = [
    {
      name: "name",
      placeholder: "Search by file name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "File Name",
    },
  ];

  const tableColumns = [
    {
      key: "name",
      label: "File Name",
      width: "200px",
      render: (value, row) => (
        <span className="d-flex align-items-center gap-2">
          <i className={`bi ${row.icon} ${row.iconColor}`}></i>
          {value}
        </span>
      ),
    },
    { key: "uploadDate", label: "Upload Date", width: "180px" },
    { key: "size", label: "Size", width: "120px" },
    { key: "knowledgeBase", label: "Knowledge Base", width: "180px" },
  ];

  useEffect(() => {
    loadFiles();
  }, [currentPage, searchValues]);

  const loadFiles = async () => {
    setIsLoading(true);

    // Nếu đang dùng mock data
    if (useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // giả lập delay

      // Filter theo name
      const filtered = allMockFiles.filter((file) =>
        file.name.toLowerCase().includes(searchValues.name.toLowerCase())
      );

      // Pagination mock
      const pageSize = 5;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      setFiles(filtered.slice(start, end));
      setTotalFiles(filtered.length);
      setIsLoading(false);
      return;
    }

    // Khi dùng API thật
    try {
      const response = await axiosInstance.get("/api/files/search", {
        params: {
          page: currentPage - 1,
          size: 5,
          query: searchValues.name ? `name=="*${searchValues.name}*"` : "",
        },
      });

      if (response.data) {
        setFiles(response.data.content);
        setTotalFiles(response.data.totalElements);
      } else {
        setFiles([]);
        setTotalFiles(0);
      }
    } catch (error) {
      console.error("Error loading files:", error);
      setFiles([]);
      setTotalFiles(0);
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
    setSearchValues({ name: "" });
    setCurrentPage(1);
  };

  const handleEdit = async (item) => {
    if (confirm(`Are you sure you want to edit "${item.name}"?`)) {
      try {
        await axiosInstance.put(`/api/files/edit/${item.id}`);
        alert("Edit successful!");
        loadFiles();
      } catch (err) {
        alert("Edit failed.");
        console.error(err);
      }
    }
  };

  const handleMoveToTrash = async (item) => {
    if (confirm(`Are you sure you want to move "${item.name}" to trash?`)) {
      try {
        await axiosInstance.delete(`/api/projects/moveToTrash/${item.id}`);
        alert("Move to trash successful!");
        loadProjects();
      } catch (err) {
        alert("Move to trash failed.");
        console.error(err);
      }
    }
  };

  const handleDownload = async (item) => {};

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Upload modal handlers
  const handleShowUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFiles([]);
    setIsDragOver(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = () => {
    if (selectedFiles.length === 0) return;

    // Here you would typically upload the files to your server
    console.log("Uploading files:", selectedFiles);

    // For demo purposes, just close the modal
    handleCloseUploadModal();

    // You might want to refresh the file list after upload
    // loadFiles();
  };

  // -------------------- Render --------------------
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">File Management</h5>
        <button
          className="btn btn-primary"
          onClick={handleShowUploadModal}
          style={{
            borderRadius: "8px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "600",
            fontSize: "14px",
            padding: "8px 16px",
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add file
        </button>
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
                <th style={{ width: "250px" }}>Actions</th>
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
              ) : files.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumns.length + 2}
                    className="text-center py-4 text-muted"
                  >
                    No files found
                  </td>
                </tr>
              ) : (
                files.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <input type="checkbox" className="form-check-input" />
                    </td>
                    {tableColumns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.render
                          ? col.render(row[col.key], row, rowIndex)
                          : row[col.key]}
                      </td>
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
                            style={{ fontSize: "14px", fontWeight: "bold" }}
                          ></i>
                          <span
                            style={{ fontSize: "10px", fontWeight: "bold" }}
                          >
                            Edit
                          </span>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={() => handleMoveToTrash(row)}
                          style={{ minWidth: "100px", fontWeight: "600" }}
                        >
                          <i
                            className="bi bi-trash3 mb-1"
                            style={{ fontSize: "14px", fontWeight: "bold" }}
                          ></i>
                          <span
                            style={{ fontSize: "10px", fontWeight: "bold" }}
                          >
                            Move to trash
                          </span>
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={() => handleDownload(row)}
                          style={{ minWidth: "100px", fontWeight: "600" }}
                        >
                          <i
                            className="bi bi-download mb-1"
                            style={{ fontSize: "14px", fontWeight: "bold" }}
                          ></i>
                          <span
                            style={{ fontSize: "10px", fontWeight: "bold" }}
                          >
                            Download
                          </span>
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
        totalPages={Math.ceil(totalFiles / 5)}
        totalItems={totalFiles}
        itemsPerPage={5}
        onPageChange={handlePageChange}
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseUploadModal();
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-semibold">Upload Files</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseUploadModal}
                ></button>
              </div>
              <div className="modal-body pt-0">
                {/* Drag and Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-3 p-5 text-center mb-4 ${
                    isDragOver
                      ? "border-primary bg-primary bg-opacity-10"
                      : "border-secondary"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    minHeight: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="mb-3">
                    <i
                      className={`bi bi-cloud-upload display-1 ${
                        isDragOver ? "text-primary" : "text-muted"
                      }`}
                    ></i>
                  </div>
                  <h6 className={isDragOver ? "text-primary" : "text-muted"}>
                    Drag and drop your file here to upload
                  </h6>
                  <p className="text-muted mb-3">or</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    id="fileInput"
                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                  />
                  <label
                    htmlFor="fileInput"
                    className="btn btn-outline-primary"
                    style={{ cursor: "pointer" }}
                  >
                    Choose files
                  </label>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="mb-3">
                    <h6 className="mb-2">
                      Selected Files ({selectedFiles.length})
                    </h6>
                    <div
                      className="border rounded p-3"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center justify-content-between py-2 border-bottom"
                        >
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-file-earmark text-primary"></i>
                            <div>
                              <div className="fw-medium">{file.name}</div>
                              <small className="text-muted">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </small>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeFile(index)}
                            title="Remove file"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseUploadModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUploadFiles}
                  disabled={selectedFiles.length === 0}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FileManagement;
