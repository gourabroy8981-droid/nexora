import { useEffect, useState } from "react";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  hardDeleteUser,
} from "../services/adminApi";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUserId = sessionStorage.getItem("userId");

  // 🌙 THEME
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  // 📦 FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🚫 BLOCK
  const handleBlock = async (id) => {
    if (!window.confirm("Block this user?")) return;

    try {
      await blockUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, locked: true } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to block user");
    }
  };

  // ✅ UNBLOCK
  const handleUnblock = async (id) => {
    if (!window.confirm("Unblock this user?")) return;

    try {
      await unblockUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, locked: false } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unblock user");
    }
  };

  // ❌ SOFT DELETE
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "⚠️ Are you sure you want to DELETE this user? This action cannot be undone!"
      )
    )
      return;

    try {
      await deleteUser(id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, deleted: true, locked: true, active: false } : u
        )
      );
      alert("User soft-deleted successfully!");
    } catch (err) {
      console.error(err);
      if (err.response) {
        const status = err.response.status;
        if (status === 404)
          alert("User not found. It may have already been deleted.");
        else if (status === 400) alert("Cannot delete admin user!");
        else if (status === 409)
          alert("Cannot delete user: related data exists!");
        else alert("Failed to delete user. Server error.");
      } else {
        alert("Failed to delete user. Network error or server not reachable.");
      }
    }
  };

  // 🗑 HARD DELETE (auto-soft-delete if needed)
  const handleHardDelete = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) {
      alert("User not found!");
      return;
    }

    // If user is not soft-deleted, soft-delete automatically
    if (!user.deleted) {
      try {
        await deleteUser(id);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, deleted: true, locked: true, active: false } : u
          )
        );
        alert("User was not soft-deleted. Soft-deleting now...");
      } catch (err) {
        console.error(err);
        alert("Failed to soft-delete user. Cannot proceed with hard delete.");
        return;
      }
    }

    if (!window.confirm("⚠️ Permanently delete this user from database?"))
      return;

    try {
      await hardDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("User permanently deleted!");
    } catch (err) {
      console.error(err);
      if (err.response) {
        const status = err.response.status;
        if (status === 404)
          alert("User not found. It may have already been deleted.");
        else if (status === 400) alert("Cannot delete admin user!");
        else if (status === 409)
          alert(
            "Cannot permanently delete user: related data exists in the system. Please remove or reassign related data first."
          );
        else alert("Failed to permanently delete user. Server error.");
      } else {
        alert(
          "Failed to permanently delete user. Network error or server not reachable."
        );
      }
    }
  };

  // 🔍 FILTER
  const filteredUsers = users.filter((u) =>
    (u.name + u.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="px-3 sm:px-4 md:px-6 py-4 md:py-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            👨‍💼 Admin Dashboard
          </h2>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">

            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-auto px-3 py-1 rounded-lg text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none"
            />

            <button
                onClick={toggleTheme}
                className="px-4 py-1 rounded-lg text-sm bg-gray-800 text-white dark:bg-yellow-400 dark:text-black transition"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden transition">

          {/* 🔥 SCROLL FIX */}
          <div className="overflow-x-auto">

            <table className="min-w-[700px] w-full text-sm">

              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Score</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
              </thead>

              <tbody>
              {filteredUsers.map((u) => (
                  <tr
                      key={u.id}
                      className={`border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                          u.deleted ? "text-gray-400 dark:text-gray-500" : ""
                      }`}
                  >
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.devScore}</td>

                    <td className="p-3">
                      {u.deleted ? (
                          <span className="text-gray-400 font-semibold">Deleted</span>
                      ) : u.locked ? (
                          <span className="text-red-500 font-semibold">Blocked</span>
                      ) : (
                          <span className="text-green-500 font-semibold">Active</span>
                      )}
                    </td>

                    <td className="p-3 flex flex-wrap gap-2">
                      {u.deleted ? (
                          <button
                              onClick={() => handleHardDelete(u.id)}
                              className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            Hard Delete
                          </button>
                      ) : u.role === "ADMIN" || String(u.id) === currentUserId ? (
                          <span className="text-gray-400 text-xs">Protected</span>
                      ) : (
                          <>
                            {u.locked ? (
                                <button
                                    onClick={() => handleUnblock(u.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                                >
                                  Unblock
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleBlock(u.id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs"
                                >
                                  Block
                                </button>
                            )}

                            <button
                                onClick={() => handleDelete(u.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs"
                            >
                              Delete
                            </button>
                          </>
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>

            </table>

          </div>
        </div>
      </div>
  );
}

export default AdminDashboard;