import axios from "axios";

// ============================================================
// BASE API
// ============================================================

// Railway production backend
const API = axios.create({
    baseURL: "https://bpr-backend-production-3381.up.railway.app/api",

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

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
            error.response?.data
        );

        // Unauthorized
        if (status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");

            console.warn("401 Unauthorized - session cleared");
        }

        // Forbidden
        if (status === 403) {

            console.warn(
                "403 Forbidden - check authentication and role"
            );
        }

        return Promise.reject(error);
    }
);

// ============================================================
// ADMIN API
// ============================================================

export const adminApi = {

    getDashboard: () =>
        API.get("/admin/dashboard"),

    getUsers: () =>
        API.get("/admin/users"),

    getAllUsers: () =>
        API.get("/admin/users"),

    approveOwner: (id) =>
        API.put(`/admin/users/${id}/approve`),

    rejectOwner: (id) =>
        API.put(`/admin/users/${id}/reject`),

    deleteUser: (id) =>
        API.delete(`/admin/users/${id}`),

    getRestaurants: () =>
        API.get("/admin/restaurants"),

    getOrders: () =>
        API.get("/admin/orders")
};

// ============================================================
// SUPPORT API
// ============================================================

export const supportApi = {

    createTicket: (data) =>
        API.post("/support/tickets", data),

    getMyTickets: () =>
        API.get("/support/tickets"),

    getMyTicket: (ticketId) =>
        API.get(`/support/tickets/${ticketId}`),

    addUserMessage: (ticketId, data) =>
        API.post(
            `/support/tickets/${ticketId}/messages`,
            data
        ),

    getAllTickets: (status = "") => {

        if (status && status.trim()) {

            return API.get(
                `/admin/support/tickets?status=${encodeURIComponent(
                    status
                )}`
            );
        }

        return API.get("/admin/support/tickets");
    },

    getAdminTicket: (ticketId) =>
        API.get(
            `/admin/support/tickets/${ticketId}`
        ),

    addAdminMessage: (ticketId, data) =>
        API.post(
            `/admin/support/tickets/${ticketId}/messages`,
            data
        ),

    updateTicket: (ticketId, data) =>
        API.put(
            `/admin/support/tickets/${ticketId}`,
            data
        )
};

// ============================================================
// REVIEW API
// ============================================================

export const reviewApi = {

    getRestaurantReviews: (restaurantId) =>
        API.get(
            `/reviews/restaurant/${restaurantId}`
        ),

    addReview: (data) =>
        API.post(
            "/reviews",
            data
        ),

    getMyReviews: () =>
        API.get(
            "/reviews/my"
        ),

    deleteReview: (id) =>
        API.delete(
            `/reviews/${id}`
        )
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default API;