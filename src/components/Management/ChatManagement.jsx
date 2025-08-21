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

  // Form state (Prompt engine tab)
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an intelligent assistant. Please summarize the content of the knowledge base to answer the question. Please list the data in the knowledge base and answer in detail. When all knowledge base content is irrelevant to the question, your answer must include the sentence "The answer you are looking for is not found in the knowledge base!" Answers need to consider chat history.'
  );

  // Form state (Model settings tab)
  const modelOptions = [
    { value: "deepseek-v3@giteeai", label: "DeepSeek-V3@GiteeAI" },
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "claude-3", label: "Claude-3" },
    { value: "gemini-pro", label: "Gemini Pro" },
  ];
  const [selectedModel, setSelectedModel] = useState(modelOptions[0]);

  const creativityOptions = [
    { value: "precise", label: "Precise" },
    { value: "balanced", label: "Balanced" },
    { value: "creative", label: "Creative" },
  ];
  const [creativity, setCreativity] = useState(creativityOptions[0]);
  const [temperature, setTemperature] = useState(0.2);

  const canSave = useMemo(
    () => assistantName.trim().length > 0,
    [assistantName]
  );

  const resetForm = () => {
    setAssistantName("");
    setAssistantDesc("");
    setOpeningGreeting("Hi! I'm your assistant, what can I do for you?");
    setKb(null);
    setSystemPrompt(
      'You are an intelligent assistant. Please summarize the content of the knowledge base to answer the question. Please list the data in the knowledge base and answer in detail. When all knowledge base content is irrelevant to the question, your answer must include the sentence "The answer you are looking for is not found in the knowledge base!" Answers need to consider chat history.'
    );
    setSelectedModel(modelOptions[0]);
    setCreativity(creativityOptions[0]);
    setTemperature(0.2);
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
      systemPrompt: systemPrompt.trim(),
      model: selectedModel?.value || "",
      creativity: creativity?.value || "",
      temperature: temperature,
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
            <>
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2">
                  <span className="text-danger">*</span>
                  System prompt
                  <i
                    className="bi bi-question-circle text-muted"
                    title="Define how the assistant should behave and respond to users"
                    style={{ cursor: "help" }}
                  ></i>
                </label>
                <textarea
                  className="form-control"
                  rows={12}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter the system prompt that defines how your assistant should behave..."
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.5",
                    resize: "vertical",
                    minHeight: "300px",
                  }}
                />
                <div className="form-text text-muted">
                  <small>
                    This prompt defines the personality, behavior, and response
                    style of your assistant. It will be used as the foundation
                    for all conversations.
                  </small>
                </div>
              </div>

              {/* Character count */}
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Tip: Be specific about how the assistant should handle
                  knowledge base queries
                </div>
                <div className="text-muted small">
                  {systemPrompt.length} characters
                </div>
              </div>
            </>
          )}

          {activeTab === "model" && (
            <>
              <div className="mb-4">
                <label className="form-label d-flex align-items-center gap-2">
                  <span className="text-danger">*</span>
                  Model
                  <i
                    className="bi bi-question-circle text-muted"
                    title="Select the AI model to power your assistant"
                    style={{ cursor: "help" }}
                  ></i>
                </label>
                <Select
                  options={modelOptions}
                  value={selectedModel}
                  onChange={(opt) => setSelectedModel(opt)}
                  placeholder="Please select a model"
                  menuPlacement="bottom"
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                      ...base,
                      minHeight: "42px",
                      fontSize: "14px",
                    }),
                  }}
                />
                <div className="form-text text-muted">
                  <small>
                    Choose the AI model that will power your assistant.
                    Different models have varying capabilities, response times,
                    and costs.
                  </small>
                </div>
              </div>

              {/* Creativity Section */}
              <div
                className="mb-4 p-4 rounded"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="fw-semibold text-dark"
                      style={{ fontSize: "16px" }}
                    >
                      Creativity
                    </span>
                    <i
                      className="bi bi-question-circle text-muted"
                      title="Controls the creativity and randomness of responses"
                      style={{ cursor: "help", fontSize: "14px" }}
                    ></i>
                  </div>
                  <Select
                    options={creativityOptions}
                    value={creativity}
                    onChange={(opt) => setCreativity(opt)}
                    placeholder="Select creativity level"
                    menuPlacement="bottom"
                    menuPortalTarget={
                      typeof document !== "undefined" ? document.body : null
                    }
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (base) => ({
                        ...base,
                        minHeight: "40px",
                        fontSize: "14px",
                        minWidth: "160px",
                        border: "1px solid #dee2e6",
                        borderRadius: "6px",
                        backgroundColor: "white",
                      }),
                    }}
                  />
                </div>

                {/* Temperature Slider */}
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="fw-semibold text-dark"
                        style={{ fontSize: "16px" }}
                      >
                        Temperature
                      </span>
                      <i
                        className="bi bi-question-circle text-muted"
                        title="Lower values make output more focused, higher values more creative"
                        style={{ cursor: "help", fontSize: "14px" }}
                      ></i>
                    </div>
                    <div
                      className="px-3 py-2 rounded text-center fw-medium"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #dee2e6",
                        minWidth: "80px",
                        fontSize: "14px",
                        color: "#6c757d",
                      }}
                    >
                      {temperature.toFixed(2)}
                    </div>
                  </div>

                  <div className="position-relative">
                    <input
                      type="range"
                      className="form-range"
                      min="0"
                      max="2"
                      step="0.01"
                      value={temperature}
                      onChange={(e) =>
                        setTemperature(parseFloat(e.target.value))
                      }
                      style={{
                        height: "8px",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Model Info */}
              <div className="alert alert-info d-flex align-items-start gap-2">
                <i className="bi bi-info-circle mt-1"></i>
                <div>
                  <div className="fw-semibold mb-1">
                    Selected Model: {selectedModel?.label}
                  </div>
                  <div className="small">
                    {selectedModel?.value === "deepseek-v3@giteeai" &&
                      "Advanced reasoning and coding capabilities with multilingual support."}
                    {selectedModel?.value === "gpt-4" &&
                      "Most capable model with excellent reasoning and complex task handling."}
                    {selectedModel?.value === "gpt-3.5-turbo" &&
                      "Fast and efficient model suitable for most conversational tasks."}
                    {selectedModel?.value === "claude-3" &&
                      "Excellent at analysis, writing, and following complex instructions."}
                    {selectedModel?.value === "gemini-pro" &&
                      "Google's advanced model with strong multimodal capabilities."}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-end gap-2 px-3 py-2 border-top">
          <button className="btn btn-light" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              console.log(
                "OK clicked, canSave:",
                canSave,
                "assistantName:",
                assistantName
              );
              handleSave();
            }}
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
