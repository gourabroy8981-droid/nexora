import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await API.get("/users/leaderboard");
      setLeaders(response.data);
    } catch (error) {
      alert("Unauthorized. Please login again.");
      navigate("/");
    }
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return "bg-yellow-400/20 text-yellow-400 border-yellow-400/30";
    if (rank === 2) return "bg-gray-300/20 text-gray-300 border-gray-300/30";
    if (rank === 3) return "bg-orange-400/20 text-orange-400 border-orange-400/30";
    return "bg-slate-800 text-white border-slate-700";
  };

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] flex flex-col items-center py-6 sm:py-10 md:py-12 px-3 sm:px-4 transition-colors duration-500">

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-6 sm:mb-10">
          🏆 Nexora Leaderboard
        </h2>

        {/* List */}
        <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl space-y-3 sm:space-y-4">

          {leaders.map((user, index) => (
              <div
                  key={user.id}
                  className={`flex flex-col sm:flex-row sm:justify-between sm:items-center
                      gap-2 sm:gap-0
                      px-4 sm:px-6 py-3 sm:py-4 rounded-xl border
                      ${getRankStyle(user.rank)}
                      backdrop-blur-md
                      transition-all duration-300
                      hover:scale-[1.02]`}
              >

                {/* Left */}
                <div className="flex items-center gap-3 sm:gap-4">

            <span className="text-base sm:text-lg font-bold">
              #{user.rank}
            </span>

                  <span className="font-medium text-sm sm:text-base">
              {user.name}
            </span>

                </div>

                {/* Right */}
                <div className="flex justify-between sm:justify-end gap-3 sm:gap-4 text-xs sm:text-sm text-slate-300">

                  <span>⚡ {user.devScore}</span>
                  <span>🏅 {user.badge}</span>

                </div>

              </div>
          ))}

        </div>
      </div>
  );
}

export default Leaderboard;