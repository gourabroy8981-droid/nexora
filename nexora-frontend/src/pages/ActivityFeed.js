import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import api from "../services/api";

export default function ActivityFeed() {

  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get("/activity");
      setActivities(res.data);
    } catch (err) {
      console.error("Feed error:", err);
    }
  };

  const formatTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getIcon = (type) => {
    switch (type) {
      case "USER_FOLLOWED": return "👥";
      case "PROJECT_LIKED": return "❤️";
      case "PROJECT_CREATED": return "🚀";
      default: return "🔥";
    }
  };

  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case "PROJECT_LIKED":
      case "PROJECT_CREATED":
        navigate("/projects");
        break;
      case "USER_FOLLOWED":
        navigate(`/profile/${activity.referenceId}`);
        break;
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-[#0B1120] px-3 sm:px-4 md:px-6 py-4 md:py-6 transition-colors duration-500">

        <div className="max-w-3xl md:max-w-4xl mx-auto">

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-gray-800 dark:text-white">
            Activity Feed 🔥
          </h1>

          {activities.length === 0 ? (
              <div className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md rounded-2xl shadow p-4 sm:p-6 text-center">
                <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base">
                  No activities yet 👀
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                  Follow developers to see their updates
                </p>
              </div>
          ) : (
              <div className="space-y-3 sm:space-y-4">

                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        onClick={() => handleActivityClick(activity)}
                        className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md
                         border border-gray-200 dark:border-slate-800
                         rounded-xl sm:rounded-2xl shadow-md
                         p-3 sm:p-4
                         hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]
                         transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">

                        {/* Avatar */}
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full
                                bg-gradient-to-r from-cyan-500 to-blue-500
                                flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
                          {activity.actor?.name?.charAt(0)}
                        </div>

                        <div className="flex-1">

                          {/* Text */}
                          <p className="text-sm sm:text-base text-gray-800 dark:text-white leading-relaxed">
                    <span className="font-semibold">
                      {activity.actor?.name}
                    </span>{" "}
                            {activity.description.replace(activity.actor?.name, "")}
                          </p>

                          {/* Footer */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-1">

                            <p className="text-xs sm:text-sm text-gray-400">
                              {formatTime(activity.createdAt)}
                            </p>

                            <span className="text-base sm:text-lg">
                      {getIcon(activity.type)}
                    </span>

                          </div>
                        </div>
                      </div>
                    </div>
                ))}

              </div>
          )}
        </div>
      </div>
  );
}