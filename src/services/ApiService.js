import axios from "axios";

// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080/api";

// ============================================================
// AXIOS INSTANCE
// ============================================================

const API = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// ============================================================
// JWT REQUEST INTERCEPTOR
// ============================================================

API.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("accessToken");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

API.interceptors.response.use(
    (response) => response,

    (error) => {

        const status = error.response?.status;

        console.error(
            "API ERROR:",
            status,
            error.response?.data || error.message
        );

        if (status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
        }

        if (status === 403) {
            console.warn(
                "Access denied. Check authentication, role, or approval."
            );
        }

        return Promise.reject(error);
    }
);

// ============================================================
// REVIEW API
// ============================================================

export const reviewApi = API;

// ============================================================
// SUPPORT API
// ============================================================

export const supportApi = API;

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default API;