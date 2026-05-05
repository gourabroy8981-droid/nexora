import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import ProjectFeed from "./pages/ProjectFeed";
import CreateProject from "./pages/CreateProject";
import Profile from "./pages/Profile";
import SuggestedDevelopers from "./pages/SuggestedDevelopers";
import Notifications from "./pages/Notifications";
import ActivityFeed from "./pages/ActivityFeed";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import EditProject from "./pages/EditProject";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar"; // ✅ ADDED

// =========================
// 🔐 USER ROUTE
// =========================
function UserRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role !== "USER") return <Navigate to="/admin" />;

  return children;
}

// =========================
// 🔥 ADMIN ROUTE
// =========================
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role !== "ADMIN") return <Navigate to="/" />;

  return children;
}

// =========================
// 🔁 CHAT WRAPPER
// =========================
function ChatWrapper() {
  const { userId } = useParams();
  return <Chat selectedUserId={userId} />;
}

// =========================
// ✅ FIXED LAYOUT
// =========================
function Layout() {

  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <>
      {/* ✅ ROLE-BASED NAVBAR */}
      {token &&
        location.pathname !== "/login" &&
        location.pathname !== "/register" && (
          role === "ADMIN" ? <AdminNavbar /> : <Navbar />
      )}

      <Routes>

        {/* ========================= */}
        {/* 🏠 PUBLIC ROUTES */}
        {/* ========================= */}

        <Route
          path="/"
          element={
            token
              ? role === "ADMIN"
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Home />
          }
        />

        <Route
          path="/login"
          element={
            token
              ? role === "ADMIN"
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Login />
          }
        />

        <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" /> : <Register />}
        />

        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ========================= */}
        {/* 👤 USER ROUTES */}
        {/* ========================= */}

        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <UserRoute>
              <Leaderboard />
            </UserRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <UserRoute>
              <ProjectFeed />
            </UserRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <UserRoute>
              <CreateProject />
            </UserRoute>
          }
        />

          <Route
              path="/edit-project/:projectId"
              element={
                  <UserRoute>
                      <EditProject />
                  </UserRoute>
              }
          />

        <Route
          path="/profile/:userId"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
        />

        <Route
          path="/suggested"
          element={
            <UserRoute>
              <SuggestedDevelopers />
            </UserRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <UserRoute>
              <Notifications />
            </UserRoute>
          }
        />

        <Route
          path="/activity"
          element={
            <UserRoute>
              <ActivityFeed />
            </UserRoute>
          }
        />

        {/* ========================= */}
        {/* 👨‍💼 ADMIN ROUTE */}
        {/* ========================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ========================= */}
        {/* 💬 CHAT */}
        {/* ========================= */}

        <Route
          path="/chat"
          element={
            <UserRoute>
              <Chat />
            </UserRoute>
          }
        />

        <Route
          path="/chat/:userId"
          element={
            <UserRoute>
              <ChatWrapper />
            </UserRoute>
          }
        />

        {/* ========================= */}
        {/* ❌ FALLBACK */}
        {/* ========================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </>
  );
}

// =========================
// 🚀 APP ROOT
// =========================
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;