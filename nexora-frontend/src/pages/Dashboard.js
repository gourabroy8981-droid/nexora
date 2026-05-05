import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ThemeContext } from "../context/ThemeContext";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const decoded = jwtDecode(token);
      const email = decoded.sub;

      const response = await API.get(`/users/email/${email}`);
      setProfile(response.data);

    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  if (!profile)
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950">
          <h2 className="text-slate-600 dark:text-white">Loading...</h2>
        </div>
    );

  return (
      <div className="min-h-screen relative flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-950 transition px-3 sm:px-4 py-6">

        {/* DARK MODE */}
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-lg sm:text-xl hover:scale-110 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* MAIN CONTENT */}
        <div className="w-full max-w-md sm:max-w-lg md:max-w-3xl text-center px-3 sm:px-6">

          {/* PROFILE IMAGE */}
          <div className="flex justify-center mb-4">
            <img
                src={
                  profile.profileImage
                      ? `http://localhost:8080/uploads/${profile.profileImage}`
                      : "https://ui-avatars.com/api/?name=" + profile.name
                }
                alt="profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700"
            />
          </div>

          {/* NAME */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-800 dark:text-white">
            Welcome, {profile.name}
          </h1>

          {/* BIO */}
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-300 max-w-md mx-auto">
            {profile.bio || "No bio added yet..."}
          </p>

          {/* Actions */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">

            <button
                onClick={() => navigate("/chat")}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition text-sm sm:text-base"
            >
              Open Chat
            </button>

            <button
                onClick={() => navigate(`/profile/${profile.id}`)}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition text-sm sm:text-base"
            >
              View Profile
            </button>

          </div>

          {/* Stats */}
          <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">

            <div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                DevScore
              </p>
              <p className="text-2xl sm:text-3xl font-semibold text-teal-500 mt-2">
                {profile.devScore}
              </p>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Badge
              </p>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white mt-2">
                {profile.badge}
              </p>
            </div>

            <div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Rank
              </p>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white mt-2">
                #{profile.rank}
              </p>
            </div>

          </div>

          {/* Logout */}
          <div className="mt-10 sm:mt-14">
            <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="px-5 sm:px-6 py-2 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm sm:text-base"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
  );
}

export default Dashboard;