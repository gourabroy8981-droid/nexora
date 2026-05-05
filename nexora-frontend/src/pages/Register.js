import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // ✅ NEW STATE
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Registration failed. Try again.");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6
  bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500
  dark:from-gray-900 dark:via-gray-800 dark:to-black transition duration-500">

        <div className="w-full max-w-sm sm:max-w-md p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl
    bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg
    border border-white/20 dark:border-gray-700">

          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-5 sm:mb-6
      text-gray-800 dark:text-white tracking-wide">
            🚀 Nexora Signup
          </h2>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">

            {/* NAME */}
            <div className="relative">
              <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  className="peer w-full p-2.5 sm:p-3 text-sm sm:text-base bg-transparent border-b-2 border-gray-300
            dark:border-gray-600 text-gray-800 dark:text-white
            focus:outline-none focus:border-indigo-500 transition"
              />
              <label className="absolute left-0 top-2.5 sm:top-3 text-gray-500 dark:text-gray-400
          text-xs sm:text-sm transition-all peer-focus:-top-3 peer-focus:text-xs
          peer-focus:text-indigo-500 peer-valid:-top-3 peer-valid:text-xs">
                Full Name
              </label>
            </div>

            {/* EMAIL */}
            <div className="relative">
              <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className="peer w-full p-2.5 sm:p-3 text-sm sm:text-base bg-transparent border-b-2 border-gray-300
            dark:border-gray-600 text-gray-800 dark:text-white
            focus:outline-none focus:border-indigo-500 transition"
              />
              <label className="absolute left-0 top-2.5 sm:top-3 text-gray-500 dark:text-gray-400
          text-xs sm:text-sm transition-all peer-focus:-top-3 peer-focus:text-xs
          peer-focus:text-indigo-500 peer-valid:-top-3 peer-valid:text-xs">
                Email Address
              </label>
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  onChange={handleChange}
                  className="peer w-full p-2.5 sm:p-3 pr-10 text-sm sm:text-base bg-transparent border-b-2 border-gray-300
            dark:border-gray-600 text-gray-800 dark:text-white
            focus:outline-none focus:border-indigo-500 transition"
              />

              <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2.5 sm:top-3 cursor-pointer text-gray-500 dark:text-gray-400 text-sm"
              >
            {showPassword ? "🙈" : "👁️"}
          </span>

              <label className="absolute left-0 top-2.5 sm:top-3 text-gray-500 dark:text-gray-400
          text-xs sm:text-sm transition-all peer-focus:-top-3 peer-focus:text-xs
          peer-focus:text-indigo-500 peer-valid:-top-3 peer-valid:text-xs">
                Password
              </label>
            </div>

            {/* BUTTON */}
            <button
                type="submit"
                className="w-full py-2.5 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base
          bg-gradient-to-r from-indigo-500 to-purple-600
          hover:from-indigo-600 hover:to-purple-700
          active:scale-95 transition-all duration-200 shadow-lg"
            >
              Create Account
            </button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-xs sm:text-sm mt-5 sm:mt-6 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
                to="/"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

        {/* ANIMATION */}
        <style>
          {`
      .animate-fadeIn {
        animation: fadeIn 0.6s ease-in-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}
        </style>

      </div>
  );
}

export default Register;