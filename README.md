# BUDDY-SMART MANAGEMENT SYSTEM

A modern, responsive web application for smart management system built with React and Vite.

## 🚀 Features

### 🔐 Authentication System

- **Login**: Support both verification code and password login
- **User Registration**: Complete registration flow with email verification
- **Password Recovery**: Forgot password with OTP verification

### 📊 Knowledge Base Management

- **Knowledge Base Creation**: Create and manage multiple knowledge bases
- **File Management**: Upload, organize and manage files
- **Dataset Management**: Advanced dataset handling with pagination
- **Search & Filter**: Powerful search and filtering capabilities

### 💬 Chat Management

- **AI-Powered Chat**: Create and manage chat assistants
- **Chat Configuration**: Customize assistant settings and behavior
- **Real-time Messaging**: Interactive chat interface
- **Chat History**: Persistent chat conversations

### 🌟 File Management

- **File Upload**: Support multiple file types (PDF, DOCX, TXT, etc.)
- **File Organization**: Organize files by knowledge base and categories
- **Advanced Search**: Search files by name, type, and content
- **Bulk Operations**: Delete, move, and manage multiple files
- **File Preview**: View file details and metadata
- **Download Files**: Download individual or multiple files
- **File Processing**: Parse and process files for knowledge base integration

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 4.1.0
- **UI Framework**: Bootstrap 5.3.2

## 📁 Project Structure

```
src/
├── api/                    # API configuration
│   └── axiosInstance.js   # Axios setup && Authentication
├── assets/                # Static assets
│   └── logo.svg          # Application logo
├── components/            # React components
│   ├── Auth/             # Authentication components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── OTPVerification.jsx
│   │   └── ResetPassword.jsx
│   ├── Common/           # Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pagination.jsx
│   │   ├── SearchForm.jsx
│   │   └── Toast.jsx
│   ├── Layout/           # Layout components
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   └── Management/       # Business logic components
│       ├── ChatManagement.jsx
│       ├── DatasetPage.jsx
│       ├── FileManagement.jsx
│       └── KnowledgeBaseManagement.jsx
├── App.jsx               # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```
   git clone https://github.com/Ngochuyenn527/FE_DACN.git
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Start development server**

   ```
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### API Configuration

The application uses Axios for API communication. Configure your API endpoints in `src/api/axiosInstance.js`.

## 📱 Pages & Routes

- `/login` - User login page
- `/register` - User registration page
- `/forgot-password` - Password recovery
- `/verify-otp` - OTP verification
- `/reset-password` - Password reset
- `/dashboard/knowledge-base-management` - Knowledge base management
- `/dashboard/chat-management` - Chat system management
- `/dashboard/file-management` - File management system
- `/dataset/:kbId/:kbName` - Dataset management page

---

**BUDDY-SMART MANAGEMENT SYSTEM** - Built with using React & Vite
