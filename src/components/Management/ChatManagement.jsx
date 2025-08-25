import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import Select from "react-select";
import { showToast } from "../Common/Toast";
import axiosInstance from "../../api/axiosInstance";
import qs from "qs";

// Minimal modal component that looks like your screenshots and does not require Bootstrap JS.
function AssistantConfigModal({ open, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("assistant");

  // Form state (Assistant settings tab)
  const [assistantName, setAssistantName] = useState("");
  const [assistantDesc, setAssistantDesc] = useState("");
  const [openingGreeting, setOpeningGreeting] = useState(
    "Hi! I'm your assistant, what can I do for you?"
  );

  // Thêm state mới để lưu trữ KB Options từ API
  const [kbOptions, setKbOptions] = useState([]);
  const [kb, setKb] = useState(null);

  // Thêm useEffect để fetch dữ liệu khi modal được mở
  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        const response = await axiosInstance.get("/knowledge_bases/list");
        if (Array.isArray(response.data)) {
          const options = response.data.map((item) => ({
            value: item._id,
            label: item.name,
          }));
          setKbOptions(options);
        } else {
          showToast("Failed to load knowledge bases. Invalid data format.", {
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching knowledge bases:", error);
        showToast("Error fetching knowledge bases.", { type: "error" });
      }
    };

    if (open) {
      fetchKnowledgeBases();
    }
  }, [open]);

  // Form state (Prompt engine tab)
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an intelligent assistant. Please summarize the content of the knowledge base to answer the question. Please list the data in the knowledge base and answer in detail. When all knowledge base content is irrelevant to the question, your answer must include the sentence "The answer you are looking for is not found in the knowledge base!" Answers need to consider chat history.'
  );

  // Form state (Model settings tab)
  const modelOptions = [
    { value: "deepseek-v3@giteeai", label: "DeepSeek-V3@GiteeAI" },
    { value: "gpt-4o-mini", label: "GPT-4o-mini" },
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

  const canSave = assistantName.trim().length > 0;

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
    const payload = {
      assistant_name: assistantName.trim(),
      description_assistant: assistantDesc.trim(),
      opening_greeting: openingGreeting.trim(),
      knowledgeBase: kb?.value || "",
      system_prompt: systemPrompt.trim(),
      model: selectedModel?.value || "",
      temperature: temperature,
    };

    if (onSave) {
      onSave(payload);
    }
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{ background: "rgba(0,0,0,0.35)", zIndex: 1050 }}
      onClick={(e) => {
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
                      style={{ height: "8px" }}
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

//------------------------------------------------------------------------------------------------
export default function ChatManagement() {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [assistantChats, setAssistantChats] = useState({}); // Lưu trữ chat theo từng assistant
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  // Lấy danh sách assistants từ API
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await axiosInstance.get("/chat-model/all");
        if (response.status === 200) {
          setAssistants(response.data);
          if (response.data.length > 0) {
            setSelectedAssistant(response.data[0]);
          }
        } else {
          showToast("Failed to load assistants.", { type: "error" });
        }
      } catch (error) {
        console.error("Error fetching assistants:", error);
        showToast("Error fetching assistants.", { type: "error" });
      }
    };
    fetchAssistants();
  }, []);

  // Lấy danh sách chats khi assistant được chọn
  useEffect(() => {
    const fetchChats = async () => {
      if (!selectedAssistant) return;

      try {
        const response = await axiosInstance.get(
          `/api/v2/history/conversation/by-assistant/${selectedAssistant.id}`
        );

        // Nếu status 200 nhưng data null hoặc không phải mảng thì mặc định mảng rỗng
        const chatsForAssistant = Array.isArray(response.data)
          ? response.data
          : [];

        setAssistantChats((prev) => ({
          ...prev,
          [selectedAssistant.id]: chatsForAssistant,
        }));

        // Tự động chọn conversation đầu tiên nếu có
        setSelectedChat(
          chatsForAssistant.length > 0 ? chatsForAssistant[0] : null
        );
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Nếu không tìm thấy conversation thì set mảng rỗng, không show error toast
          setAssistantChats((prev) => ({
            ...prev,
            [selectedAssistant.id]: [],
          }));
          setSelectedChat(null);
        } else {
          // Lỗi khác mới show toast
          console.error("Error fetching chats:", error);
          showToast("Error fetching assistant conversations.", {
            type: "error",
          });
        }
      }
    };

    fetchChats();
  }, [selectedAssistant]);

  const handleNewChat = async () => {
    if (!selectedAssistant) {
      showToast("Please select an assistant first to create a new chat.", {
        type: "info",
      });
      return;
    }
    try {
      // Gọi API để tạo cuộc trò chuyện mới
      const newChatPayload = {
        assistant_id: selectedAssistant.id,
        name: `New chat with ${selectedAssistant.assistant_name}`,
      };
      const response = await axiosInstance.post(
        "/api/v2/history/conversation/create",
        newChatPayload
      );

      if (response.status === 200 && response.data.id) {
        const newChat = {
          conversation_id: response.data.id, // Lấy ID từ response.data.id
          name: newChatPayload.name,
          messages: [], // Khởi tạo messages rỗng cho chat mới
        };
        showToast("New chat created successfully!", { type: "success" });

        // Cập nhật trạng thái `assistantChats`
        setAssistantChats((prev) => {
          const updatedChats = { ...prev };
          const chatsForThisAssistant =
            updatedChats[selectedAssistant.id] || [];
          updatedChats[selectedAssistant.id] = [
            ...chatsForThisAssistant,
            newChat,
          ];
          return updatedChats;
        });

        // Chọn cuộc trò chuyện mới
        setSelectedChat(newChat);
      } else {
        showToast("Failed to create new chat.", { type: "error" });
      }
    } catch (error) {
      showToast("Error creating new chat.", { type: "error" });
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    console.log("Selected chat:", chat);
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;

    const userMessage = { role: "user", content: message };
    setMessage("");

    // Hiển thị ngay tin nhắn của user
    setAssistantChats((prev) => {
      const updated = { ...prev };
      updated[selectedAssistant.id] = (updated[selectedAssistant.id] || []).map(
        (chat) =>
          chat.conversation_id === selectedChat.conversation_id
            ? { ...chat, messages: [...(chat.messages || []), userMessage] }
            : chat
      );
      return updated;
    });

    // Tạo sẵn tin nhắn rỗng cho bot
    const botMessage = { role: "assistant", content: "" };
    setAssistantChats((prev) => {
      const updated = { ...prev };
      updated[selectedAssistant.id] = (updated[selectedAssistant.id] || []).map(
        (chat) =>
          chat.conversation_id === selectedChat.conversation_id
            ? { ...chat, messages: [...(chat.messages || []), botMessage] }
            : chat
      );
      return updated;
    });

    try {
      const payload = {
        conversation_id: selectedChat.conversation_id,
        message: userMessage.content,
      };

      const response = await fetch("/api/v2/Chat/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        // Cập nhật botMessage content liên tục
        setAssistantChats((prev) => {
          const updated = { ...prev };
          updated[selectedAssistant.id] = (
            updated[selectedAssistant.id] || []
          ).map((chat) =>
            chat.conversation_id === selectedChat.conversation_id
              ? {
                  ...chat,
                  messages: chat.messages.map((m) =>
                    m === botMessage ? { ...m, content: accumulated } : m
                  ),
                }
              : chat
          );
          return updated;
        });
      }
    } catch (err) {
      console.error("Stream error:", err);

      setAssistantChats((prev) => {
        const updated = { ...prev };
        updated[selectedAssistant.id] = (
          updated[selectedAssistant.id] || []
        ).map((chat) =>
          chat.conversation_id === selectedChat.conversation_id
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m === botMessage ? { ...m, content: "⚠️ Lỗi stream" } : m
                ),
              }
            : chat
        );
        return updated;
      });
    }
  };
  const handleSaveAssistant = async (payload) => {
    try {
      const body = {
        assistant_name: payload.assistant_name,
        description_assistant: payload.description_assistant,
        opening_greeting: payload.opening_greeting,
        list_knowledge_base_id: payload.knowledgeBase
          ? [payload.knowledgeBase]
          : [],
        system_prompt: payload.system_prompt,
        model: payload.model,
        temperature: payload.temperature,
        top_p: 0.5,
        max_doc: 20,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const response = await axiosInstance.post("/chat-model/create", body);
      console.log("Create assistant response:", response);
      if (response.status === 201) {
        console.log("Create assistant response:", response.data);
        // 👇 lấy assistant vừa tạo từ response
        const newAssistant = response.data;

        // 👇 cập nhật state trực tiếp
        setAssistants((prev) => [...prev, newAssistant]);
        setSelectedAssistant(newAssistant);

        setShowConfig(false);
        showToast("Assistant created successfully!", { type: "success" });
        setShowConfig(false);
      } else {
        const msg = response.data?.message || "Failed to create assistant!";
        showToast(msg, { type: "error" });
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";
      showToast(msg, { type: "error" });
    }
  };
  const handleDeleteChat = async (conversation_id) => {
    try {
      await axiosInstance.delete(`/history/conversation/${conversation_id}`);
      // Cập nhật lại danh sách sau khi xoá
      setAssistantChats((prev) => {
        const updated = { ...prev };
        const chatsForThisAssistant = updated[selectedAssistant.id] || [];
        updated[selectedAssistant.id] = chatsForThisAssistant.filter(
          (chat) => chat.conversation_id !== conversation_id
        );
        return updated;
      });
      showToast("Deleted successfully", { type: "success" });
      if (selectedChat?.conversation_id === conversation_id) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      showToast("Failed to delete", "error");
    }
  };
  const handleDeleteAssistant = async (assistantId) => {
    try {
      const response = await axiosInstance.delete(
        `/chat-model/delete/${assistantId}`
      );
      if (response.status === 200) {
        showToast("Assistant deleted successfully!", { type: "success" });
        // Cập nhật danh sách assistants sau khi xóa
        setAssistants((prev) => prev.filter((a) => a.id !== assistantId));
        // Nếu assistant bị xóa là assistant đang được chọn, đặt lại selectedAssistant
        if (selectedAssistant?.id === assistantId) {
          setSelectedAssistant(null);
          setSelectedChat(null); // Đặt lại chat nếu cần
        }
      } else {
        showToast("Failed to delete assistant.", { type: "error" });
      }
    } catch (error) {
      console.error("Error deleting assistant:", error);
      showToast("Error deleting assistant.", { type: "error" });
    }
  };

  const chats = selectedAssistant
    ? assistantChats[selectedAssistant.id] || []
    : [];
  const currentChat = chats.find((c) => c.id === selectedChat?.id);

  return (
    <DashboardLayout>
      <div className="p-3">
        <div
          className="d-flex bg-white rounded shadow-sm"
          style={{ height: "75vh" }}
        >
          {/* 1️⃣ Cột Assistant List */}
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
            <ul className="list-unstyled m-0 flex-grow-1 p-3">
              {assistants.length > 0 ? (
                assistants.map((assistant) => (
                  <li
                    key={assistant.id}
                    className={`d-flex align-items-center justify-content-between mb-2 p-2 rounded ${
                      selectedAssistant?.id === assistant.id
                        ? "bg-light shadow-sm"
                        : "bg-white border"
                    }`}
                    style={{ cursor: "pointer", transition: "0.2s" }}
                    onClick={() => {
                      console.log("Selected Assistant:", assistant);
                      setSelectedAssistant(assistant);
                    }}
                  >
                    <div
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                    >
                      {assistant.assistant_name}
                    </div>
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
                          <button
                            className="dropdown-item text-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAssistant(assistant.id);
                            }}
                          >
                            <i className="bi bi-trash me-2"></i> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-muted text-center mt-3">
                  No assistants found.
                </li>
              )}
            </ul>
          </div>
          {/* 2️⃣ Cột Chat List */}
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
              {chats.map((chat) => (
                <li
                  key={chat.conversation_id}
                  className={`d-flex justify-content-between align-items-center mb-2 p-2 rounded ${
                    selectedChat?.conversation_id === chat.conversation_id
                      ? "bg-light shadow-sm"
                      : "bg-white border"
                  }`}
                  style={{ cursor: "pointer", transition: "0.2s" }}
                  onClick={() => handleSelectChat(chat)}
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
                        <button
                          className="dropdown-item text-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.conversation_id);
                          }}
                        >
                          <i className="bi bi-trash me-2"></i> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* 3️⃣ Cửa sổ Chat */}
          <div className="flex-grow-1 d-flex flex-column">
            {selectedChat ? (
              <>
                <div className="p-3 border-bottom bg-light">
                  <h5 className="mb-0 fw-bold">{selectedChat.name}</h5>
                </div>
                <div
                  className="flex-grow-1 p-3"
                  style={{
                    overflowY: "auto",
                    backgroundColor: "#ffffff",
                    height: "100%",
                  }}
                >
                  {currentChat?.messages?.length === 0 ? (
                    <div className="text-muted text-center mt-5">
                      No messages yet
                    </div>
                  ) : (
                    currentChat?.messages?.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`d-flex mb-3 ${
                          msg.role === "user" ? "justify-content-end" : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded ${
                            msg.role === "user"
                              ? "bg-primary text-white"
                              : "bg-light"
                          }`}
                          style={{ maxWidth: "70%" }}
                        >
                          {msg.content}
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
              </>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center h-100">
                <div className="text-muted">
                  <i
                    className="bi bi-robot me-2"
                    style={{ fontSize: "5rem" }}
                  ></i>
                </div>
                <h5 className="text-muted mt-3">
                  Please select a chat or create a new one.
                </h5>
              </div>
            )}
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
