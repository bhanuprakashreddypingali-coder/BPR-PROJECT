import axios from "axios";

// =========================================================
// PRODUCTION BACKEND
// =========================================================

const API_BASE_URL =
    "https://bpr-backend-production-3381.up.railway.app/api";

// =========================================================
// AXIOS INSTANCE
// =========================================================

const AdminService = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }

});


// =========================================================
// JWT INTERCEPTOR
// =========================================================

AdminService.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("jwtToken") ||
            localStorage.getItem("accessToken");

        if (token) {

            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }

);


// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

AdminService.interceptors.response.use(

    (response) => {

        return response;
    },

    (error) => {

        console.error(
            "Admin API Error:",
            error.response?.status,
            error.response?.data ||
            error.message
        );

        if (
            error.response?.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "jwtToken"
            );

            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "role"
            );
        }

        return Promise.reject(error);
    }

);


export default AdminService;