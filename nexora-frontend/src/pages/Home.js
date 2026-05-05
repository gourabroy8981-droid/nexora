import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  // ✅ NEW
  const [menuOpen, setMenuOpen] = useState(false);

  return (
      <div
          className={`min-h-screen flex flex-col relative overflow-hidden transition-all duration-500 ${
              darkMode ? "bg-[#020617] text-white" : "bg-gray-50 text-gray-900"
          }`}
      >

        {/* BACKGROUND */}
        <div className="absolute inset-0 -z-10">
          <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1518770660439-4636190af475')",
              }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* 🔥 NAVBAR */}
        <div className="px-4 sm:px-6 md:px-12 py-4 backdrop-blur-md bg-white/5 border-b border-white/10">

          <div className="flex justify-between items-center">

            {/* LOGO */}
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Nexora
            </h1>

            {/* HAMBURGER */}
            <button
                className="md:hidden text-2xl"
                onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex gap-4 items-center">

              <button onClick={() => navigate("/login")} className="nav-btn">
                Login
              </button>

              <button
                  onClick={() => navigate("/register")}
                  className="nav-btn primary"
              >
                Join
              </button>

              <button onClick={() => navigate("/admin-login")} className="nav-btn">
                Admin
              </button>

              <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="px-3 py-2 rounded-lg bg-white/10"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

            </div>
          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
              <div className="flex flex-col gap-3 mt-4 md:hidden">

                <button onClick={() => navigate("/login")} className="nav-btn">
                  Login
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className="nav-btn primary"
                >
                  Join
                </button>

                <button onClick={() => navigate("/admin-login")} className="nav-btn">
                  Admin
                </button>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-3 py-2 rounded-lg bg-white/10"
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>

              </div>
          )}
        </div>

        {/* MAIN */}
        <div className="flex flex-1 flex-col justify-center">

          {/* HERO */}
          <div className="text-center px-4 sm:px-6 max-w-4xl mx-auto">

            <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight"
            >
              Developer{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Universe
            </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-gray-300"
            >
              Chat • Share • Build • Connect — all in one place
            </motion.p>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4"
            >
              <button
                  onClick={() => navigate("/register")}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg hover:scale-105 transition"
              >
                Get Started
              </button>

              <button
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl border border-white/20 hover:border-indigo-400 text-gray-300 hover:text-white hover:bg-white/10 transition"
              >
                Login
              </button>
            </motion.div>
          </div>

          {/* FEATURES */}
          <div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
            {features.map((f, i) => (
                <motion.div
                    key={i}
                    whileHover={{ y: -6, scale: 1.03 }}
                    className="p-4 sm:p-6 rounded-2xl text-center bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg transition"
                >
                  <h3 className="text-base sm:text-lg font-semibold">{f.title}</h3>
                  <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-gray-300">{f.desc}</p>
                </motion.div>
            ))}
          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center py-4 sm:py-5 text-xs sm:text-sm text-gray-400">
          © 2026 Nexora • Built for Developers
        </div>

      </div>
  );
}

const features = [
  { title: "💼 Profile", desc: "Show your dev identity" },
  { title: "📸 Posts", desc: "Share your work" },
  { title: "💬 Chat", desc: "Real-time messaging" },
  { title: "🌐 Network", desc: "Connect with devs" },
];

export default Home;