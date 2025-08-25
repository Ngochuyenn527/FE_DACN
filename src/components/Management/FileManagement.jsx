import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../Common/Toast";

const FileManagement = () => {
  const [knowledgeBaseId, setKnowledgeBaseId] = useState("");
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [searchValues, setSearchValues] = useState({ name: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  // State mới cho modal đổi tên
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // -------------------- Search & Table Config --------------------
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

  // -------------------- Helper functions --------------------
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf": return "bi-file-earmark-pdf";
      case "doc":
      case "docx": return "bi-file-earmark-word";
      case "ppt":
      case "pptx": return "bi-file-earmark-ppt";
      case "xls":
      case "xlsx": return "bi-file-earmark-excel";
      case "zip": return "bi-file-earmark-zip";
      default: return "bi-file-earmark";
    }
  };

  const getFileIconColor = (type) => {
    switch (type) {
      case "pdf": return "text-danger";
      case "doc":
      case "docx": return "text-primary";
      case "ppt":
      case "pptx": return "text-danger";
      case "xls":
      case "xlsx": return "text-success";
      case "zip": return "text-warning";
      default: return "text-secondary";
    }
  };

  // -------------------- Load data --------------------
  useEffect(() => {
    const fetchFiles = async () => {
      if (knowledgeBases.length > 0) {
        loadFiles();
      }
    };
    fetchFiles();
  }, [currentPage, searchValues, knowledgeBases]);

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        const res = await axiosInstance.get("/knowledge_bases/list");
        if (Array.isArray(res.data)){
          setKnowledgeBases(res.data);
        }
      } catch (err) {
        console.error("Error fetching knowledge bases:", err);
      }
    };
    fetchKnowledgeBases();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/v2/files/");
      const data = res.data || [];
      let filtered = data;
      if (searchValues.name) {
        filtered = data.filter((f) =>
          f.file_name.toLowerCase().includes(searchValues.name.toLowerCase())
        );
      }

      const pageSize = 5;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const mappedFiles = filtered.slice(start, end).map((f) => {
        const kbName = f.knowledge_base_id[0] ? (knowledgeBases.find(kb => kb._id === f.knowledge_base_id[0])?.name) : "N/A";
        return {
          id: f._id,
          name: f.file_name,
          uploadDate: new Date(f.uploaded_at).toISOString().slice(0, 19).replace("T", " "),
          size: "N/A",
          knowledgeBase: kbName,
          icon: getFileIcon(f.file_name.split(".").pop()),
          iconColor: getFileIconColor(f.file_name.split(".").pop()),
        };
      });

      setFiles(mappedFiles);
      setTotalFiles(filtered.length);
    } catch (err) {
      console.error("Error loading files:", err);
      setFiles([]);
      setTotalFiles(0);
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------- Handlers --------------------
  const handleSearchFieldChange = (fieldName, value) => {
    setCurrentPage(1);
    setSearchValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSearch = () => setCurrentPage(1);
  const handleReset = () => {
    setSearchValues({ name: "" });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleShowUploadModal = () => {
    setShowUploadModal(true);
    setKnowledgeBaseId("");
    setSelectedFiles([]);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setSelectedFiles([]);
    setIsDragOver(false);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
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

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0 || !knowledgeBaseId) {
      showToast("Please select at least one file and a Knowledge Base.", { type: "info" });
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append("files", f));
    setIsUploading(true);
    try {
      const res = await axiosInstance.post("/Index/api/index", formData, {
        params: { knowledge_base_id: knowledgeBaseId },
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        showToast("Files uploaded successfully!", { type: "success" });
        handleCloseUploadModal();
        loadFiles();
      } else {
        showToast("Failed to upload files.", { type: "error" });
      }
    } catch (err) {
      console.error("Error uploading files:", err.response || err);
      showToast("Error uploading files.", { type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleMoveToTrash = async () => {
    if (selectedFileIds.length === 0) {
      showToast("Please select at least one file.", { type: "info" });
      return;
    }
  
    try {
      for (const fileId of selectedFileIds) {
        await axiosInstance.delete(`/api/v2/files/${fileId}`);
      }
      showToast("Selected files moved to trash.", { type: "success" });
      setSelectedFileIds([]); // clear selection
      loadFiles();
    } catch (err) {
      console.error("Error deleting files:", err);
      showToast("Failed to move files to trash.", { type: "error" });
    }
  };

  // -------------------- Rename Modal Handlers --------------------
  const handleOpenRenameModal = (file) => {
    setCurrentFile(file);
    setNewFileName(file.name);
    setShowRenameModal(true);
  };

  const handleCloseRenameModal = () => {
    setShowRenameModal(false);
    setCurrentFile(null);
    setNewFileName("");
  };

  const handleRenameSubmit = async () => {
    if (!newFileName.trim()) {
      showToast("New file name cannot be empty.", { type: "error" });
      return;
    }
    
    setIsRenaming(true);
    try {
      await axiosInstance.put(`/api/v2/files/${currentFile.id}`, { file_name: newFileName });
      showToast("File name updated successfully!", { type: "success" });
      handleCloseRenameModal();
      loadFiles();
    } catch (err) {
      console.error("Error updating file name:", err);
      showToast("Failed to update file name.", { type: "error" });
    } finally {
      setIsRenaming(false);
    }
  };

  // -------------------- Render --------------------
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">File Management</h5>
        <button
          className="btn btn-primary"
          onClick={handleShowUploadModal}
          style={{ borderRadius: "8px", fontWeight: "600", fontSize: "14px", padding: "8px 16px" }}
        >
          <i className="bi bi-plus-circle me-2"></i>Add file
        </button>
      </div>

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
                  <th key={i} style={{ width: col.width || "auto" }}>{col.label}</th>
                ))}
                <th style={{ width: "250px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={tableColumns.length + 2} className="text-center py-5">
                    Loading data...
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length + 2} className="text-center py-4 text-muted">
                    No files found
                  </td>
                </tr>
              ) : (
                files.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedFileIds.includes(row.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFileIds((prev) => [...prev, row.id]);
                          } else {
                            setSelectedFileIds((prev) => prev.filter((id) => id !== row.id));
                          }
                        }}
                      />
                    </td>
                    {tableColumns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                      </td>
                    ))}
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        {/* View */}
                        <button
                          className="btn btn-outline-dark btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={async () => {
                            try {
                              const res = await axiosInstance.get(`/api/v2/files/${row.id}`);
                              const fileUrl = res.data.file_path;
                              if (fileUrl) window.open(fileUrl, "_blank");
                              else showToast("File not found.", { type: "error" });
                            } catch (err) {
                              console.error(err);
                              showToast("Failed to fetch file URL.", { type: "error" });
                            }
                          }}
                        >
                          <i className="bi bi-eye mb-1" style={{ fontSize: "14px" }}></i>
                          <span style={{ fontSize: "10px" }}>View</span>
                        </button>

                        {/* Edit */}
                        <button
                          className="btn btn-outline-warning btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={() => handleOpenRenameModal(row)}
                        >
                          <i className="bi bi-pencil mb-1" style={{ fontSize: "14px" }}></i>
                          <span style={{ fontSize: "10px" }}>Edit</span>
                        </button>

                        {/* Move to trash */}
                        <button
                          className="btn btn-outline-danger btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={() => {
                            setSelectedFileIds([row.id]);
                            handleMoveToTrash();
                          }}
                        >
                          <i className="bi bi-trash3 mb-1" style={{ fontSize: "14px" }}></i>
                          <span style={{ fontSize: "10px" }}>Move to trash</span>
                        </button>

                        {/* Download */}
                        <button
                          className="btn btn-outline-success btn-sm d-flex flex-column align-items-center px-3 py-2 fw-bold"
                          onClick={async () => {
                            try {
                              const res = await axiosInstance.get(`/api/v2/files/${row.id}`);
                              const fileUrl = res.data.file_path;
                              if (fileUrl) window.location.href = fileUrl;
                              else showToast("File not found.", { type: "error" });
                            } catch (err) {
                              console.error(err);
                              showToast("Failed to fetch file URL.", { type: "error" });
                            }
                          }}
                        >
                          <i className="bi bi-download mb-1" style={{ fontSize: "14px" }}></i>
                          <span style={{ fontSize: "10px" }}>Download</span>
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
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={(e) => e.target === e.currentTarget && handleCloseUploadModal()}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-semibold">Upload Files</h5>
                <button type="button" className="btn-close" onClick={handleCloseUploadModal}></button>
              </div>
              <div className="modal-body pt-0">
                {/* Drag and Drop */}
                <div className={`border-2 border-dashed rounded-3 p-5 text-center mb-4 ${isDragOver ? "border-primary bg-primary bg-opacity-10" : "border-secondary"}`}
                     onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                     style={{ minHeight: "200px", display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 0.3s ease" }}>
                  <div className="mb-3">
                    <i className={`bi bi-cloud-upload display-1 ${isDragOver ? "text-primary" : "text-muted"}`}></i>
                  </div>
                  <h6 className={isDragOver ? "text-primary" : "text-muted"}>Drag and drop your file here to upload</h6>
                  <p className="text-muted mb-3">or</p>
                  <input type="file" multiple onChange={handleFileSelect} style={{ display: "none" }} id="fileInput" />
                  <label htmlFor="fileInput" className="btn btn-outline-primary" style={{ cursor: "pointer" }}>Choose files</label>
                </div>

                {/* Selected files list */}
                {selectedFiles.length > 0 && (
                  <div className="mb-3">
                    <h6 className="mb-2">Selected Files ({selectedFiles.length})</h6>
                    <div className="border rounded p-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                          <div className="d-flex align-items-center gap-2">
                            <i className="bi bi-file-earmark text-primary"></i>
                            <div>
                              <div className="fw-medium">{file.name}</div>
                              <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                            </div>
                          </div>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeFile(index)}>
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Knowledge Base Selection */}
                <div className="mb-3">
                  <label className="form-label">
                    Knowledge Base <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    value={knowledgeBaseId}
                    onChange={(e) => setKnowledgeBaseId(e.target.value)}
                  >
                    <option value="">Select a Knowledge Base</option>
                    {knowledgeBases.map((kb) => (
                      <option key={kb._id} value={kb._id}>
                        {kb.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary" onClick={handleCloseUploadModal}>Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleUploadFiles} 
                  disabled={selectedFiles.length === 0 || !knowledgeBaseId || isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : (
                    "OK"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={(e) => e.target === e.currentTarget && handleCloseRenameModal()}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-semibold">Rename File</h5>
                <button type="button" className="btn-close" onClick={handleCloseRenameModal}></button>
              </div>
              <div className="modal-body pt-0">
                <div className="mb-3">
                  <label htmlFor="newFileName" className="form-label">
                    New File Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="newFileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary" onClick={handleCloseRenameModal}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleRenameSubmit} disabled={!newFileName.trim() || isRenaming}>
                  {isRenaming ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    "Save"
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

export default FileManagement;