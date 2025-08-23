import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import Pagination from "../Common/Pagination";

// Mock data for dataset files - Expanded for pagination demo
const allMockFiles = [
  {
    id: 1,
    name: "3. Hướng dẫn sử dụng...",
    chunkNumber: 9,
    uploadDate: "10/07/2025 19:29:13",
    chunkingMethod: "General",
  },
  {
    id: 2,
    name: "3. Hướng dẫn sử dụng...",
    chunkNumber: 9,
    uploadDate: "10/07/2025 19:29:13",
    chunkingMethod: "General",
  },
  {
    id: 3,
    name: "3. Hướng dẫn sử dụng...",
    chunkNumber: 9,
    uploadDate: "10/07/2025 19:29:13",
    chunkingMethod: "General",
  },
  {
    id: 4,
    name: "3. Hướng dẫn sử dụng...",
    chunkNumber: 9,
    uploadDate: "10/07/2025 19:29:13",
    chunkingMethod: "General",
  },
  {
    id: 5,
    name: "3. Hướng dẫn sử dụng...",
    chunkNumber: 9,
    uploadDate: "10/07/2025 19:29:13",
    chunkingMethod: "General",
  },
  {
    id: 6,
    name: "3. Hướng dẫn sử dụng...",
    chunkNumber: 9,
    uploadDate: "10/07/2025 19:29:13",
    chunkingMethod: "General",
  },
];

export default function DatasetPage() {
  const { kbId, kbName } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dataset");
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const itemsPerPage = 4; // Show 5 items per page for demo

  const handleBackToKB = () => {
    navigate("/knowledge-base");
  };

  const toggleFileEnabled = (id) => {
    setFiles(
      files.map((file) =>
        file.id === id ? { ...file, enabled: !file.enabled } : file
      )
    );
  };

  const loadFiles = async () => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filter files based on search query
    const filtered = allMockFiles.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedFiles = filtered.slice(start, end);

    setFiles(paginatedFiles);
    setTotalFiles(filtered.length);
    setIsLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEditFile = (file) => {
    setSelectedFile(file);
    setNewFileName(file.name);
    setShowRenameModal(true);
  };

  const handleCloseRenameModal = () => {
    setShowRenameModal(false);
    setSelectedFile(null);
    setNewFileName("");
  };

  const handleSaveRename = () => {
    if (!newFileName.trim() || !selectedFile) return;

    // Update the file name in the files array
    setFiles(
      files.map((file) =>
        file.id === selectedFile.id
          ? { ...file, name: newFileName.trim() }
          : file
      )
    );

    // Also update in allMockFiles for consistency
    const fileIndex = allMockFiles.findIndex((f) => f.id === selectedFile.id);
    if (fileIndex !== -1) {
      allMockFiles[fileIndex].name = newFileName.trim();
    }

    handleCloseRenameModal();
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

  useEffect(() => {
    loadFiles();
  }, [currentPage, searchQuery]);

  return (
    <DashboardLayout>
      <div className="d-flex min-vh-100">
        {/* Left Sidebar */}
        <div
          className="bg-light border-end"
          style={{ width: "280px", minHeight: "100vh" }}
        >
          {/* Knowledge Base Info */}
          <div className="p-3 border-bottom bg-white">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-folder text-primary"></i>
              <small className="text-muted">Knowledge Base</small>
            </div>
            <h6 className="mb-0 fw-semibold text-truncate">
              {decodeURIComponent(kbName) || "Dataset"}
            </h6>
          </div>

          {/* Sidebar Menu */}
          <div className="p-3">
            <nav>
              <div
                className={`d-flex align-items-center gap-3 p-2 rounded mb-2 cursor-pointer ${
                  activeTab === "dataset"
                    ? "bg-primary text-white"
                    : "text-muted"
                }`}
                onClick={() => setActiveTab("dataset")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-file-earmark-text"></i>
                <span>Dataset</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-fill">
          {/* Header */}
          <div className="bg-white border-bottom p-3">
            <div className="d-flex align-items-center gap-2 text-muted mb-2">
              <button
                className="btn btn-link text-muted p-0 text-decoration-none"
                onClick={handleBackToKB}
              >
                Knowledge Base
              </button>
              <span>/</span>
              <span>{kbName || "Dataset"}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1 fw-semibold">{kbName || "Dataset"}</h4>
                <div className="d-flex align-items-center gap-2 text-warning">
                  <i className="bi bi-clock"></i>
                  <small>
                    Please wait for your files to finish parsing before starting
                    an AI-powered chat.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4">
            {/* Controls */}
            <div className="d-flex justify-content-end align-items-center mb-4">
              <div className="d-flex gap-2">
                <div className="input-group" style={{ width: "300px" }}>
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search your files"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
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
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "40px" }}>
                      <input type="checkbox" className="form-check-input" />
                    </th>
                    <th>Name</th>
                    <th>Chunk Number</th>
                    <th>Upload Date</th>
                    <th>Chunking method</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2">Loading files...</div>
                      </td>
                    </tr>
                  ) : files.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        No files found
                      </td>
                    </tr>
                  ) : (
                    files.map((file) => (
                      <tr key={file.id}>
                        <td>
                          <input type="checkbox" className="form-check-input" />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-file-earmark-text text-primary"></i>
                            <span>{file.name}</span>
                          </div>
                        </td>
                        <td>{file.chunkNumber}</td>
                        <td>{file.uploadDate}</td>
                        <td>{file.chunkingMethod}</td>

                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              title="Edit"
                              onClick={() => handleEditFile(file)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              title="Download"
                            >
                              <i className="bi bi-download"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Professional Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalFiles / itemsPerPage)}
              totalItems={totalFiles}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              showInfo={true}
            />
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseRenameModal();
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-semibold">Rename</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseRenameModal}
                ></button>
              </div>
              <div className="modal-body pt-0">
                <div className="mb-3">
                  <label className="form-label">
                    <span className="text-danger">*</span> Name:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newFileName.trim()) {
                        handleSaveRename();
                      }
                      if (e.key === "Escape") {
                        handleCloseRenameModal();
                      }
                    }}
                    autoFocus
                    placeholder="Enter file name"
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseRenameModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveRename}
                  disabled={!newFileName.trim()}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
}
