import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await API.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 px-3 sm:px-4 md:px-6 py-4 md:py-8">

        <div className="max-w-sm sm:max-w-md md:max-w-3xl mx-auto">

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8">
            🔔 Notifications
          </h2>

          {notifications.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500">
                No notifications yet.
              </p>
          ) : (
              <div className="space-y-3 sm:space-y-4">

                {notifications.map((notification) => (

                    <div
                        key={notification.id}
                        className={`p-3 sm:p-4 md:p-5 rounded-xl shadow-md transition
                ${notification.read ? "bg-white" : "bg-blue-50"}`}
                    >
                      <p className="text-sm sm:text-base text-gray-800">
                        {notification.message}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-3">

                <span className="text-xs sm:text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>

                        {!notification.read && (
                            <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs sm:text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 w-fit"
                            >
                              Mark as read
                            </button>
                        )}

                      </div>

                    </div>

                ))}

              </div>
          )}

        </div>

      </div>
  );
}

export default Notifications;