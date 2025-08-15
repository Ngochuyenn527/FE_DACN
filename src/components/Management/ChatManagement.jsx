import React, { useMemo, useRef, useState } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import Select from "react-select";

// Minimal modal component that looks like your screenshots and does not require Bootstrap JS.
function AssistantConfigModal({ open, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("assistant");

  // Form state (Assistant settings tab)
  const [assistantName, setAssistantName] = useState("");
  const [assistantDesc, setAssistantDesc] = useState("");
  const [openingGreeting, setOpeningGreeting] = useState(
    "Hi! I'm your assistant, what can I do for you?"
  );
  const kbOptions = [
    { value: "kb-demo", label: "Demo KB" },
    { value: "kb-demo2", label: "Demo KB 2" },
  ];
  const [kb, setKb] = useState(null);

  const canSave = useMemo(
    () => assistantName.trim().length > 0,
    [assistantName]
  );

  const resetForm = () => {
    setAssistantName("");
    setAssistantDesc("");
    setOpeningGreeting("Hi! I'm your assistant, what can I do for you?");
    setKb(null);
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleSave = () => {
    if (!canSave) return;
    onSave?.({
      name: assistantName.trim(),
      description: assistantDesc.trim(),
      openingGreeting,
      knowledgeBase: kbOptions?.value || "",
    });
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }}
      onClick={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="bg-white rounded shadow position-absolute start-50 translate-middle-x"
        style={{
          top: "52px",
          width: 720,
          maxWidth: "92vw",
          height: "82vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span
              className="badge rounded-circle bg-light border text-secondary d-inline-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
            >
              <i className="bi bi-app"></i>
            </span>
            <div>
              <div className="fw-semibold">Chat Configuration</div>
              <div className="small text-muted">
                Set up a chat assistant for your selected datasets (knowledge
                bases) here!
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm btn-light"
            onClick={handleClose}
            aria-label="Close"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-3 pt-2">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "assistant" ? "active" : ""
                }`}
                onClick={() => setActiveTab("assistant")}
              >
                Assistant settings
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "prompt" ? "active" : ""}`}
                onClick={() => setActiveTab("prompt")}
              >
                Prompt engine
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "model" ? "active" : ""}`}
                onClick={() => setActiveTab("model")}
              >
                Model settings
              </button>
            </li>
          </ul>
        </div>

        {/* Body */}
        <div className="p-3" style={{ maxHeight: "65vh", overflowY: "auto" }}>
          {activeTab === "assistant" && (
            <>
              {/* Assistant Name */}
              <div className="mb-3">
                <label className="form-label">
                  Assistant name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Resume Jarvis"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description of assistant</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. A chat assistant for resume."
                  value={assistantDesc}
                  onChange={(e) => setAssistantDesc(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Knowledge bases</label>
                <Select
                  options={kbOptions}
                  value={kb}
                  onChange={(opt) => setKb(opt)}
                  placeholder="Please select"
                  menuPlacement="bottom"
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Opening greeting</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={openingGreeting}
                  onChange={(e) => setOpeningGreeting(e.target.value)}
                />
              </div>
            </>
          )}

          {activeTab === "prompt" && (
            <div className="text-muted">(Prompt engine settings go here.)</div>
          )}

          {activeTab === "model" && (
            <div className="text-muted">(Model settings go here.)</div>
          )}
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-end gap-2 px-3 py-2 border-top">
          <button className="btn btn-light" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!canSave}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatManagement() {
  const [chats, setChats] = useState([
    { id: 1, name: "helee", messages: ["hi"] },
    { id: 2, name: "test", messages: [] },
  ]);
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  const handleNewChat = () => {
    const newChat = { id: Date.now(), name: "New chat", messages: [] };
    setChats((prev) => [...prev, newChat]);
    setSelectedChat(chats.length);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    const updated = [...chats];
    updated[selectedChat].messages.push(message.trim());
    setChats(updated);
    setMessage("");
  };

  const handleSaveAssistant = (payload) => {
    // do something with the form payload
    console.log("Assistant saved:", payload);
  };

  return (
    <DashboardLayout>
      <div className="p-3">
        <div
          className="d-flex bg-white rounded shadow-sm"
          style={{ height: "75vh" }}
        >
          {/* 1️⃣ Sidebar */}
          <div
            className="border-end d-flex flex-column"
            style={{ width: "220px", overflowY: "auto" }}
          >
            <div className="p-3 border-bottom">
              <button
                className="btn btn-primary w-100 fw-bold"
                onClick={() => setShowConfig(true)}
              >
                Create an Assistant
              </button>
            </div>
          </div>

          {/* 2️⃣ Chat list */}
          <div
            className="border-end d-flex flex-column"
            style={{ width: "300px", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <div className="fw-bold">
                Chat <span className="badge bg-secondary">{chats.length}</span>
              </div>
              <button
                className="btn btn-link p-0"
                onClick={handleNewChat}
                title="New chat"
              >
                <i className="bi bi-plus-circle fs-4 text-primary"></i>
              </button>
            </div>

            <ul className="list-unstyled m-0 flex-grow-1 p-3">
              {chats.map((chat, index) => (
                <li
                  key={chat.id}
                  className={`d-flex justify-content-between align-items-center mb-2 p-2 rounded ${
                    selectedChat === index
                      ? "bg-light shadow-sm"
                      : "bg-white border"
                  }`}
                  style={{ cursor: "pointer", transition: "0.2s" }}
                  onClick={() => setSelectedChat(index)}
                >
                  <span className="text-truncate" style={{ maxWidth: "200px" }}>
                    {chat.name}
                  </span>

                  <div
                    className="dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-sm border-0 bg-transparent p-0"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-three-dots-vertical text-muted"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                      <li>
                        <button className="dropdown-item text-danger">
                          <i className="bi bi-trash me-2"></i> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 3️⃣ Chat window */}
          <div className="flex-grow-1 d-flex flex-column">
            <div
              className="flex-grow-1 p-3"
              style={{
                overflowY: "auto",
                backgroundColor: "#ffffff",
                height: "100%",
              }}
            >
              {chats[selectedChat]?.messages.length === 0 ? (
                <div className="text-muted text-center mt-5">
                  No messages yet
                </div>
              ) : (
                chats[selectedChat].messages.map((msg, idx) => (
                  <div key={idx} className="d-flex mb-3">
                    <div
                      className="p-2 rounded bg-light"
                      style={{ maxWidth: "70%" }}
                    >
                      {msg}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-top d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Message the assistant..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="btn btn-primary" onClick={handleSend}>
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>

        <AssistantConfigModal
          open={showConfig}
          onClose={() => setShowConfig(false)}
          onSave={handleSaveAssistant}
        />
      </div>
    </DashboardLayout>
  );
}
