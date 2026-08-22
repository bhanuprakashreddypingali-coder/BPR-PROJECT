import axios from "axios";

// ============================================================
// BPR FLAVORS HUB - PRODUCTION API
// ============================================================

const api = axios.create({
    baseURL: "https://bpr-backend-production-3381.up.railway.app/api",

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ============================================================
// JWT TOKEN
// ============================================================

api.interceptors.request.use(
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

    (error) => {
        return Promise.reject(error);
    }
);

// ============================================================
// RESPONSE HANDLING
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
            error.response?.data
        );

        if (status === 401) {
            console.error("Unauthorized request.");
        }

        if (status === 403) {
            console.error("Access denied.");
        }

        return Promise.reject(error);
    }
);

export default api;