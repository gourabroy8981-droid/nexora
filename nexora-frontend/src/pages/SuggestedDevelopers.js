import { useEffect, useState } from "react";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function SuggestedDeveloper() {
  const [developers, setDevelopers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const decoded = jwtDecode(token);
      const email = decoded.sub;

      const userResponse = await API.get(`/users/email/${email}`);
      const userId = userResponse.data.id;

      setCurrentUserId(userId);

      const response = await API.get(`/users/${userId}/suggested`);
      setDevelopers(response.data);

    } catch (error) {
      navigate("/");
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      await API.post(`/users/${currentUserId}/follow/${targetUserId}`);

      setDevelopers(prev =>
        prev.filter(dev => dev.id !== targetUserId)
      );

    } catch (error) {
      alert("Already following or error occurred");
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "GOLD":
        return "text-yellow-400";
      case "SILVER":
        return "text-gray-300";
      case "BRONZE":
        return "text-orange-400";
      default:
        return "text-slate-400";
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] px-3 sm:px-4 md:px-6 py-4 md:py-8 transition-colors duration-500">

        <div className="max-w-sm sm:max-w-md md:max-w-4xl mx-auto">

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 md:mb-10 text-gray-800 dark:text-white">
            🤝 Suggested Developers
          </h2>

          {developers.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400">
                No suggestions available.
              </p>
          ) : (
              <div className="space-y-4 sm:space-y-6">

                {developers.map((dev, index) => (
                    <div
                        key={dev.id}
                        className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800
                         p-4 sm:p-5 md:p-6 rounded-xl
                         flex flex-col sm:flex-row sm:justify-between sm:items-center
                         gap-3 sm:gap-0
                         transition-all duration-300 hover:shadow-md"
                    >

                      {/* LEFT */}
                      <div className="flex items-center gap-3 sm:gap-4">

                        {/* Avatar */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full
                                bg-gradient-to-r from-cyan-500 to-blue-500
                                flex items-center justify-center text-white font-bold text-sm sm:text-base">
                          {dev.name?.charAt(0)}
                        </div>

                        <div>
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-white">
                            {dev.name}
                          </h3>

                          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400">
                            DevScore: {dev.devScore}
                          </p>

                          <p className={`text-xs sm:text-sm font-semibold ${getBadgeColor(dev.badge)}`}>
                            {dev.badge}
                          </p>
                        </div>

                      </div>

                      {/* RIGHT BUTTONS */}
                      <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-end">

                        <button
                            onClick={() => navigate(`/profile/${dev.id}`)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-200 dark:bg-slate-800 text-gray-800 dark:text-white rounded-lg"
                        >
                          View
                        </button>

                        <button
                            onClick={() => handleFollow(dev.id)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-cyan-500 text-black rounded-lg"
                        >
                          Follow
                        </button>

                      </div>

                    </div>
                ))}

              </div>
          )}

        </div>
      </div>
  );
}

export default SuggestedDeveloper;