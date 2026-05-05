import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await API.post("/auth/admin-login", {
        email,
        password,
      });

      const { token, userId } = response.data;

      // ✅ Store token
      localStorage.setItem("token", token);

      // 🔥 FIXED ROLE STORAGE (with debug)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        console.log("JWT Payload:", payload);
        console.log("Extracted Role:", payload.role);

        const role = payload.role === "ROLE_ADMIN" ? "ADMIN" : payload.role;

        localStorage.setItem("role", role);

        console.log("Saved Role:", role);

      } catch (err) {
        console.log("Role extraction failed", err);
      }

      // ✅ Store userId
      sessionStorage.setItem("userId", userId);

      console.log("Admin Login Success:", response.data);

      // 🔥 ✅ FINAL FIX (IMPORTANT)
      window.location.href = "/admin";

    } catch (error) {

      console.log("Admin login error:", error);

      if (error.response?.status === 403) {
        alert("Access denied: Admin only ❌");
      } else if (error.response?.status === 401) {
        alert("Invalid email or password ❌");
      } else {
        alert("Admin login failed ❌");
      }

    }

  };
  return (

      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-3 sm:px-4">

        <div className="bg-gray-800 p-5 sm:p-6 md:p-8 rounded-xl shadow-lg w-full max-w-sm sm:max-w-md text-white">

          <h2 className="text-xl sm:text-2xl font-bold text-center mb-5 sm:mb-6">
            👨‍💼 Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">

            <input
                type="email"
                placeholder="Admin Email"
                className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button
                type="submit"
                className="w-full bg-red-600 p-2.5 sm:p-3 rounded-lg hover:bg-red-700 transition font-bold text-sm sm:text-base"
            >
              Login as Admin 🚀
            </button>

          </form>

          <div className="mt-5 sm:mt-6 text-center">

            <p className="text-xs sm:text-sm text-gray-400">
              Not an admin?
            </p>

            <button
                onClick={() => navigate("/login")}
                className="mt-2 text-blue-400 hover:text-blue-500 font-medium text-sm sm:text-base"
            >
              Go to User Login
            </button>

          </div>

        </div>

      </div>

  );
}

export default AdminLogin;