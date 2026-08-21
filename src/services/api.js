import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add JWT token automatically
api.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle authentication errors
api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            console.error("Unauthorized request.");
        }

        if (error.response?.status === 403) {
            console.error("Access denied.");
        }

        return Promise.reject(error);
    }
);

export default api;