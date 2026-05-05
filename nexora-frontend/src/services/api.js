import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

// ================================
// 🔐 PUBLIC ROUTES (NO TOKEN)
// ================================
const PUBLIC_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/admin-login",

    // 🔥 ADD THESE (IMPORTANT FIX)
    "/users/forgot-password",
    "/users/reset-password"
];

// ================================
// REQUEST INTERCEPTOR
// ================================
API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");
        const url = config.url || "";

        // ✅ Skip token for public routes
        if (PUBLIC_ROUTES.some((route) => url.includes(route))) {
            return config;
        }

        if (token) {
            try {
                const decoded = jwtDecode(token);

                // 🔥 Token expired
                if (decoded.exp * 1000 < Date.now()) {
                    console.log("⛔ Token expired → Redirecting to login");

                    localStorage.clear();

                    if (window.location.pathname !== "/login") {
                        window.location.href = "/login";
                    }

                    return Promise.reject("Token expired");
                }

                // ✅ Attach token
                config.headers.Authorization = `Bearer ${token}`;

                // ✅ Let browser handle FormData
                if (config.data instanceof FormData) {
                    delete config.headers["Content-Type"];
                }

            } catch (error) {
                console.log("JWT decode failed:", error);

                localStorage.clear();
                window.location.href = "/login";

                return Promise.reject(error);
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ================================
// RESPONSE INTERCEPTOR
// ================================
API.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response) {

            // 🔥 Unauthorized → logout
            if (error.response.status === 401) {
                console.log("⛔ Unauthorized → Logging out");

                localStorage.clear();

                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }

            // ⚠️ Forbidden → no logout
            if (error.response.status === 403) {
                console.log("⚠️ Forbidden:", error.response.config?.url);
            }

            // 🔥 Handle 400 errors (better debugging)
            if (error.response.status === 400) {
                console.log("❌ Bad Request:", error.response.data);
            }

            // 🔥 Handle 500 errors
            if (error.response.status === 500) {
                console.log("💥 Server Error:", error.response.data);
            }
        }

        return Promise.reject(error);
    }
);

export default API;