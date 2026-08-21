import axios from "axios";

// ============================================================
// BASE API
// ============================================================

const API = axios.create({
    baseURL: "http://localhost:8080/api",

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
            error.response?.data
        );

        if (status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
        }

        if (status === 403) {
            console.warn(
                "403 Forbidden - check authentication/role"
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

    // GET /api/reviews/restaurant/{restaurantId}
    getRestaurantReviews: (restaurantId) =>
        API.get(
            `/reviews/restaurant/${restaurantId}`
        ),

    // POST /api/reviews
    addReview: (data) =>
        API.post(
            "/reviews",
            data
        ),

    // GET /api/reviews/my
    getMyReviews: () =>
        API.get(
            "/reviews/my"
        ),

    // DELETE /api/reviews/{id}
    deleteReview: (id) =>
        API.delete(
            `/reviews/${id}`
        )
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default API;