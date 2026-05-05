import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/users/login", {
        email,
        password,
      });

      const { token, userId } = response.data;

      localStorage.setItem("token", token);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        localStorage.setItem("role", payload.role);
      } catch (e) {}

      sessionStorage.setItem("userId", userId);

      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Invalid email or password ❌");
      } else {
        alert("Login failed ❌");
      }
    }
  };

  return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-950 dark:to-black transition-all duration-300">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center px-10 xl:px-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">

          <div className="absolute w-56 h-56 xl:w-72 xl:h-72 bg-white/10 rounded-full blur-3xl top-10 left-10"></div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight z-10">
            Welcome to Nexora
          </h1>

          <p className="mt-5 xl:mt-6 text-indigo-100 text-base xl:text-lg max-w-md z-10">
            Build your developer identity, showcase your work,
            and connect with a global tech community.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-4 sm:px-6 py-6">

          <div className="w-full max-w-sm sm:max-w-md">

            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-white">
              🚀 Nexora
            </h2>

            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg">

              <h3 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6 text-slate-800 dark:text-white">
                Sign in
              </h3>

              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

                {/* EMAIL */}
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border
              bg-slate-50 dark:bg-slate-800
              text-slate-900 dark:text-white
              placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm sm:text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {/* PASSWORD */}
                <div className="relative">
                  <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border
                bg-slate-50 dark:bg-slate-800
                text-slate-900 dark:text-white
                placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm sm:text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />

                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-2.5 sm:top-3 text-xs sm:text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* LOGIN BUTTON */}
                <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white py-2.5 sm:py-3 rounded-lg font-medium shadow-md text-sm sm:text-base"
                >
                  Sign in
                </button>
              </form>

              {/* FOOTER */}
              <div className="mt-5 sm:mt-6 text-xs sm:text-sm text-center text-slate-500">
                Don’t have an account?{" "}
                <button
                    onClick={() => navigate("/register")}
                    className="text-indigo-500 hover:underline font-medium"
                >
                  Create one
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
  );
}

export default Login;