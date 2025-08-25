import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OTPVerification from "./components/Auth/OTPVerification";
import ResetPassword from "./components/Auth/ResetPassword";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Toast from "./components/Common/Toast";
import KnowledgeBaseManagement from "./components/Management/KnowledgeBaseManagement";
import ChatManagement from "./components/Management/ChatManagement";
import FileManagement from "./components/Management/FileManagement";
import DatasetPage from "./components/Management/DatasetPage";
import UserManagement from "./components/Management/UserManagement";
import EditUser from "./components/Management/EditUser";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Toast />
        <Routes>
          {/* Auth Routes - Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard Routes - Protected */}
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard/knowledge-base-management" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/knowledge-base-management"
            element={
              <ProtectedRoute>
                <KnowledgeBaseManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chat-management"
            element={
              <ProtectedRoute>
                <ChatManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/file-management"
            element={
              <ProtectedRoute>
                <FileManagement />
              </ProtectedRoute>
            }
          /> */}

          {/* Dashboard Routes - Protected */}
          <Route
            path="/dashboard"
            element={
              <Navigate to="/dashboard/knowledge-base-management" replace />
            }
          />
          <Route
            path="/dashboard/knowledge-base-management"
            element={<KnowledgeBaseManagement />}
          />
          <Route
            path="/dashboard/chat-management"
            element={<ChatManagement />}
          />
          <Route
            path="/dashboard/file-management"
            element={<FileManagement />}
          />
          <Route
            path="/dashboard/user-management"
            element={<UserManagement />}
          />
          <Route path="/dashboard/users/edit/:id" element={<EditUser />} />

          <Route path="/knowledge-base" element={<KnowledgeBaseManagement />} />
          <Route path="/dataset/:kbId/:kbName" element={<DatasetPage />} />

          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
