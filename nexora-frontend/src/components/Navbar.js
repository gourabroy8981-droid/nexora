import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";

function Navbar() {

  const [userId, setUserId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadNavbarData();
  }, [location.pathname, token]);

  // 🔥 SCROLL LOCK FIX
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [menuOpen]);

  const loadNavbarData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserId(null);
        setUnreadCount(0);
        return;
      }

      const decoded = jwtDecode(token);
      const email = decoded.sub;

      const res = await API.get("/users/email/" + email);
      const id = res.data.id;

      setUserId(id);

      const notif = await API.get("/notifications/unread-count");
      setUnreadCount(notif.data);

    } catch (err) {
      console.log("Navbar error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("userId");

    setUserId(null);
    setUnreadCount(0);

    window.location.href = "/";
  };

  return (
      <div className="bg-gray-900 text-white shadow-lg px-4 md:px-6 py-3 sticky top-0 z-50">

        {/* Top Row */}
        <div className="flex justify-between items-center">

          {/* Logo */}
          <h1
              className="text-lg md:text-xl font-bold text-blue-400 cursor-pointer"
              onClick={() => navigate("/dashboard")}
          >
            Nexora 🚀
          </h1>

          {/* Hamburger */}
          <div
              className="md:hidden text-2xl cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-sm font-medium items-center">

            {location.pathname !== "/dashboard" && (
                <span onClick={() => navigate("/dashboard")} className="cursor-pointer bg-green-500 px-3 py-1 rounded-lg">
              Dashboard
            </span>
            )}

            <span onClick={() => navigate("/leaderboard")} className="cursor-pointer hover:text-blue-400">Leaderboard</span>
            <span onClick={() => navigate("/projects")} className="cursor-pointer hover:text-blue-400">Projects</span>
            <span onClick={() => navigate("/activity")} className="cursor-pointer hover:text-blue-400">Activity</span>
            <span onClick={() => navigate("/suggested")} className="cursor-pointer hover:text-blue-400">Developers</span>

            <span onClick={() => navigate("/create-project")} className="cursor-pointer bg-blue-500 px-3 py-1 rounded-lg">
            + Create Project
          </span>

            {/* Notifications */}
            <div className="relative cursor-pointer" onClick={() => navigate("/notifications")}>
              🔔
              {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 rounded-full">
                {unreadCount}
              </span>
              )}
            </div>

            {userId && (
                <span onClick={() => navigate("/profile/" + userId)} className="cursor-pointer">
              Profile
            </span>
            )}

            <span onClick={logout} className="cursor-pointer text-red-400">
            Logout
          </span>

          </div>
        </div>

        {/* 🔥 FULLSCREEN MOBILE MENU */}
        {menuOpen && (
            <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center gap-6 text-lg font-medium overflow-hidden">

              {/* Close Button */}
              <button
                  className="absolute top-5 right-6 text-3xl"
                  onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>

              <span onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}>
            Dashboard
          </span>

              <span onClick={() => { navigate("/leaderboard"); setMenuOpen(false); }}>
            Leaderboard
          </span>

              <span onClick={() => { navigate("/projects"); setMenuOpen(false); }}>
            Projects
          </span>

              <span onClick={() => { navigate("/activity"); setMenuOpen(false); }}>
            Activity
          </span>

              <span onClick={() => { navigate("/suggested"); setMenuOpen(false); }}>
            Developers
          </span>

              <span onClick={() => { navigate("/create-project"); setMenuOpen(false); }}>
            + Create Project
          </span>

              <span onClick={() => { navigate("/notifications"); setMenuOpen(false); }}>
            🔔 Notifications ({unreadCount})
          </span>

              {userId && (
                  <span onClick={() => { navigate("/profile/" + userId); setMenuOpen(false); }}>
              Profile
            </span>
              )}

              <span
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="text-red-400"
              >
            Logout
          </span>

            </div>
        )}

      </div>
  );
}

export default Navbar;