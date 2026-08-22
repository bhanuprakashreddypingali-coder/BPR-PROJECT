import axios from "axios";

// ============================================================
// PRODUCTION BACKEND
// ============================================================

const API_BASE_URL =
    "https://bpr-backend-production-3381.up.railway.app/api";

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// ============================================================
// JWT REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("accessToken");

        if (token) {

            config.headers = config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        const status = error.response?.status;

        console.error(
            "API ERROR:",
            status,
            error.response?.data || error.message
        );

        if (status === 401) {
            console.warn("Unauthorized request.");
        }

        if (status === 403) {
            console.warn(
                "Access denied. Check authentication or role."
            );
        }

        return Promise.reject(error);
    }
);

// ============================================================
// EXPORT
// ============================================================

export default api;