import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../Common/Toast";

// Util: format date time
function formatDateTime(dt) {
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// A single KB Card like the screenshot
function KnowledgeBaseCard({ kb, onOpen, onDelete }) {
  return (
    <div className="card shadow-sm h-100" style={{ borderRadius: 14 }}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light"
            style={{ width: 44, height: 44 }}
          >
            <i className="bi bi-person fs-5 text-secondary" />
          </div>
          <div className="dropdown">
            <button
              className="btn btn-link text-muted p-0"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-three-dots" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() =>
                    onDelete?.(kb.id)
                  }
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>

        <button
          className="btn text-start px-0 mt-3"
          onClick={() => onOpen?.(kb)}
        >
          <h4 className="m-0 fw-semibold" style={{ lineHeight: 1.2 }}>
            {kb.title}
          </h4>
        </button>

        <div className="mt-auto">
          <div className="d-flex align-items-center gap-2 text-muted mb-1">
            <i className="bi bi-file-earmark-text" />
            <span>{kb.docs} Docs</span>
          </div>
          <div className="d-flex align-items-center gap-2 text-muted">
            <i className="bi bi-calendar3" />
            <span>{formatDateTime(kb.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KnowledgeBasePage() {
  const navigate = useNavigate();

  // Mock data
  const [username, setUsername] = useState("");
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newKbName, setNewKbName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [kbToDelete, setKbToDelete] = useState(null);

  useEffect(() => {
    const fetchKbList = async () => {
      try {
        const res = await axiosInstance.get("/knowledge_bases/list");
        console.log("Dữ liệu từ API /knowledge_bases/list:", res.data);
        const list = res.data || [];
        setItems(
          list.map((kb) => ({
            id: kb._id,
            title: kb.name,
            docs: kb.docs || 0,
            updatedAt: kb.created_at || Date.now(),
          }))
        );
      } catch (err) {
        console.error("Fetch KB list error:", err);
        showToast("error", "Failed to load knowledge bases ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchKbList();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.title.toLowerCase().includes(q));
  }, [items, query]);

  const createNew = () => {
    setShowModal(true);
  };

  const handleCreateKb = async () => {
    if (!newKbName.trim()) return;
  
    try {
      const res = await axiosInstance.post("/knowledge_bases/create", {
        name: newKbName.trim(),
      });
  
      const createdKb = res.data;
      console.log("Created KB:", createdKb);
  
      // cập nhật list
      setItems((prev) => [
        ...prev,
        {
          id: createdKb.id,            // lấy id từ BE
          title: newKbName.trim(),     // dùng tên vừa nhập
          docs: 0,                     // mới tạo => 0 Docs
          updatedAt: Date.now(),       // thời điểm hiện tại
        },
      ]);
  
      setShowModal(false);
      setNewKbName("");
  
      showToast("success", createdKb.message || "Knowledge base created successfully ✅");
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        const msg = data?.message || "Something went wrong ❌";
  
        if (status === 400) {
          showToast("error", msg);
        } else if (status === 401) {
          showToast("error", msg || "Unauthorized ❌");
        } else if (status === 409) {
          showToast("error", msg || "Knowledge base already exists ⚠️");
        } else {
          showToast("error", msg);
        }
      } else if (err.request) {
        showToast("error", "No response from server ⚠️");
      } else {
        showToast("error", "Unexpected error ❌");
      }
      console.error("Create KB error:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewKbName("");
  };

  const onOpen = (kb) => {
    navigate(`/dataset/${kb.id}/${encodeURIComponent(kb.title)}`);
  };

  const onDelete = async (id) => {
    setKbToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteKb = async () => {
    try {
      const res = await axiosInstance.delete(`/knowledge_bases/delete/${kbToDelete}`);
      showToast(res.data);

      // Cập nhật danh sách sau khi xóa
      setItems((prev) => prev.filter((x) => x.id !== kbToDelete));
      setShowDeleteModal(false);
      setKbToDelete(null);
    } catch (err) {
      console.error("Lỗi xóa KB:", err);
      if (err.response) {
        const { status, data } = err.response;
        const msg = data?.message || "Xóa thất bại ❌";

        if (status === 404) {
          showToast("error", "Không tìm thấy knowledge base ❌");
        } else if (status === 401) {
          showToast("error", "Không có quyền truy cập ❌");
        } else {
          showToast("error", msg);
        }
      } else if (err.request) {
        showToast("error", "Không nhận được phản hồi từ server ⚠️");
      } else {
        showToast("error", "Lỗi bất ngờ ❌");
      }
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid py-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Bên trái */}
          <div>
            <h3 className="fw-bold m-0">Welcome back, {username}</h3>
            <div className="text-muted">
              Which knowledge bases will you use today?
            </div>
          </div>

          {/* Bên phải */}
          <div className="d-flex align-items-stretch gap-2 flex-shrink-0">
            <div className="input-group" style={{ maxWidth: 400 }}>
              <span className="input-group-text bg-white">
                <i className="bi bi-search" />
              </span>
              <input
                className="form-control"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={createNew}
              style={{
                borderRadius: "8px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: "600",
                fontSize: "14px",
                padding: "8px 16px",
              }}
            >
              <i className="bi bi-plus-circle me-2"></i> Add
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="row g-3">
          {filtered.map((kb) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={kb.id}>
              <KnowledgeBaseCard kb={kb} onOpen={onOpen} onDelete={onDelete} />
            </div>
          ))}
        </div>

        {/* Footer empty text */}
        <div className="text-center text-muted py-4">
          {filtered.length === 0
            ? "No knowledge base found."
            : "That's all. Nothing more. 🥲"}
        </div>
      </div>

      {/* Create Knowledge Base Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-semibold">
                  Create knowledge base
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
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
                    placeholder="Please input name!"
                    value={newKbName}
                    onChange={(e) => setNewKbName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newKbName.trim()) {
                        handleCreateKb();
                      }
                    }}
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateKb}
                  disabled={!newKbName.trim()}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: "12px" }}>
              <div className="modal-header border-0 pb-2">
                <h5 className="modal-title fw-semibold">Xác nhận xóa</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body pt-0">
                <p>Bạn có chắc muốn xóa knowledge base này?</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteKb}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
