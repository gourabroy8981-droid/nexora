import { useNavigate } from "react-router-dom";

function AdminNavbar() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        sessionStorage.removeItem("userId");

        window.location.href = "/";
    };

    return (
        <div className="bg-gray-900 text-white px-4 md:px-6 py-3 shadow-md">

            <div className="flex justify-between items-center flex-wrap gap-2">

                {/* Logo */}
                <h1
                    className="text-lg md:text-xl font-bold text-yellow-400 cursor-pointer"
                    onClick={() => navigate("/admin")}
                >
                    Nexora Admin 👨‍💼
                </h1>

                {/* Right Section */}
                <div className="flex items-center gap-3">

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 px-3 md:px-4 py-1 rounded-lg text-xs md:text-sm transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AdminNavbar;