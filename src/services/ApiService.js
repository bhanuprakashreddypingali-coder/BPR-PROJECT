import axios from "axios";

// ============================================================
// PRODUCTION BACKEND
// ============================================================

const API_BASE_URL =
    "https://bpr-backend-production-3381.up.railway.app/api";

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
// GET JWT TOKEN
// ============================================================

const getToken = () => {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("jwtToken") ||
        localStorage.getItem("accessToken")
    );
};

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

API.interceptors.request.use(
    (config) => {

        const token = getToken();

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

API.interceptors.response.use(
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

        // ----------------------------------------------------
        // 401 UNAUTHORIZED
        // ----------------------------------------------------

        if (status === 401) {

            console.warn(
                "401 Unauthorized - JWT may be expired or invalid."
            );

            localStorage.removeItem("token");
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("accessToken");

            localStorage.removeItem("user");
            localStorage.removeItem("role");
        }

        // ----------------------------------------------------
        // 403 FORBIDDEN
        // ----------------------------------------------------

        if (status === 403) {

            console.warn(
                "403 Forbidden - User does not have permission."
            );

            console.warn(
                "Response:",
                error.response?.data
            );
        }

        return Promise.reject(error);
    }
);

// ============================================================
// SUPPORT API
// ============================================================

export const supportApi = {

    // --------------------------------------------------------
    // CUSTOMER / OWNER
    // --------------------------------------------------------

    createTicket: (data) => {
        return API.post("/support", data);
    },

    getMyTickets: () => {
        return API.get("/support");
    },

    getTicket: (id) => {
        return API.get(`/support/${id}`);
    },

    addMessage: (id, data) => {
        return API.post(
            `/support/${id}/messages`,
            data
        );
    },

    // --------------------------------------------------------
    // ADMIN
    // --------------------------------------------------------

    getAllTickets: () => {
        return API.get("/admin/support");
    },

    getAdminTickets: () => {
        return API.get("/admin/support");
    },

    getAdminTicket: (id) => {
        return API.get(
            `/admin/support/${id}`
        );
    },

    updateTicket: (id, data) => {
        return API.put(
            `/admin/support/${id}`,
            data
        );
    },

    replyToTicket: (id, data) => {
        return API.post(
            `/admin/support/${id}/messages`,
            data
        );
    },

    addAdminMessage: (id, data) => {
        return API.post(
            `/admin/support/${id}/messages`,
            data
        );
    }
};

// ============================================================
// REVIEW API
// ============================================================

export const reviewApi = {

    // --------------------------------------------------------
    // GET RESTAURANT REVIEWS
    // --------------------------------------------------------

    getRestaurantReviews: (restaurantId) => {
        return API.get(
            `/reviews/restaurant/${restaurantId}`
        );
    },

    // --------------------------------------------------------
    // GET FOOD REVIEWS
    // --------------------------------------------------------

    getFoodReviews: (foodId) => {
        return API.get(
            `/reviews/food/${foodId}`
        );
    },

    // --------------------------------------------------------
    // CREATE REVIEW
    // --------------------------------------------------------

    createReview: (data) => {
        return API.post(
            "/reviews",
            data
        );
    },

    // --------------------------------------------------------
    // UPDATE REVIEW
    // --------------------------------------------------------

    updateReview: (id, data) => {
        return API.put(
            `/reviews/${id}`,
            data
        );
    },

    // --------------------------------------------------------
    // DELETE REVIEW
    // --------------------------------------------------------

    deleteReview: (id) => {
        return API.delete(
            `/reviews/${id}`
        );
    },

    // --------------------------------------------------------
    // MY REVIEWS
    // --------------------------------------------------------

    getMyReviews: () => {
        return API.get("/reviews/my");
    }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default API;