import axios from "axios";

// =========================================================
// API BASE URL
// =========================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://bpr-backend-production-3381.up.railway.app/api";

// =========================================================
// AXIOS INSTANCE
// =========================================================

const API = axios.create({
    baseURL: API_BASE_URL.replace(/\/+$/, ""),
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
            "================================================="
        );
        console.log(
            "API REQUEST:",
            config.method?.toUpperCase(),
            `${config.baseURL}${config.url}`
        );

        if (config.data) {
            console.log("REQUEST DATA:", config.data);
        }

        console.log(
            "================================================="
        );

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

API.interceptors.response.use(
    (response) => {
        console.log(
            "API RESPONSE:",
            response.status,
            response.config?.url
        );

        return response;
    },

    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        console.error(
            "================================================="
        );
        console.error("API ERROR STATUS:", status);
        console.error("API ERROR DATA:", data);
        console.error(
            "API ERROR URL:",
            error.config?.baseURL + error.config?.url
        );
        console.error(
            "================================================="
        );

        if (status === 401) {
            console.warn(
                "Authentication expired or invalid."
            );
        }

        return Promise.reject(error);
    }
);

// =========================================================
// AUTH API
// =========================================================

export const authApi = {

    login: (data) =>
        API.post("/auth/login", data),

    register: (data) =>
        API.post("/auth/register", data),

    getProfile: () =>
        API.get("/users/profile"),
};

// =========================================================
// USER API
// =========================================================

export const userApi = {

    getProfile: () =>
        API.get("/users/profile"),

    updateProfile: (data) =>
        API.put("/users/profile", data),
};

// =========================================================
// RESTAURANT API
// =========================================================

export const restaurantApi = {

    getAll: () =>
        API.get("/restaurants"),

    getById: (id) =>
        API.get(`/restaurants/${id}`),

    create: (data) =>
        API.post("/restaurants", data),

    update: (id, data) =>
        API.put(`/restaurants/${id}`, data),

    delete: (id) =>
        API.delete(`/restaurants/${id}`),
};

// =========================================================
// FOOD API
// =========================================================

export const foodApi = {

    getAll: () =>
        API.get("/foods"),

    getById: (id) =>
        API.get(`/foods/${id}`),

    getByRestaurant: (restaurantId) =>
        API.get(`/foods/restaurant/${restaurantId}`),

    create: (data) =>
        API.post("/foods", data),

    update: (id, data) =>
        API.put(`/foods/${id}`, data),

    delete: (id) =>
        API.delete(`/foods/${id}`),
};

// =========================================================
// CART API
// =========================================================

export const cartApi = {

    getCart: () =>
        API.get("/cart"),

    addToCart: (data) =>
        API.post("/cart", data),

    updateQuantity: (id, quantity) =>
        API.put(`/cart/${id}`, {
            quantity,
        }),

    removeItem: (id) =>
        API.delete(`/cart/${id}`),

    clearCart: () =>
        API.delete("/cart/clear"),
};

// =========================================================
// ORDER API
// =========================================================

export const orderApi = {

    create: (data) =>
        API.post("/orders", data),

    getMyOrders: () =>
        API.get("/orders/my"),

    getById: (id) =>
        API.get(`/orders/${id}`),

    cancel: (id) =>
        API.put(`/orders/${id}/cancel`),
};

// =========================================================
// REVIEW API
// =========================================================

export const reviewApi = {

    getRestaurantReviews: (restaurantId) =>
        API.get(
            `/reviews/restaurant/${restaurantId}`
        ),

    create: (data) =>
        API.post("/reviews", data),

    update: (id, data) =>
        API.put(`/reviews/${id}`, data),

    delete: (id) =>
        API.delete(`/reviews/${id}`),
};

// =========================================================
// SUPPORT API
// =========================================================
// IMPORTANT:
//
// Frontend base URL:
// https://bpr-backend-production-3381.up.railway.app/api
//
// Therefore:
//
// "/support/tickets"
// becomes:
//
// https://bpr-backend-production-3381.up.railway.app/api/support/tickets
//
// DO NOT use "/support" for ticket creation.
// =========================================================

export const supportApi = {

    // =====================================================
    // CUSTOMER / OWNER
    // =====================================================

    createTicket: (data) => {
        console.log(
            "CREATE TICKET:",
            `${API_BASE_URL}/support/tickets`,
            data
        );

        return API.post(
            "/support/tickets",
            data
        );
    },

    getMyTickets: () => {
        console.log(
            "GET MY TICKETS:",
            `${API_BASE_URL}/support/tickets`
        );

        return API.get(
            "/support/tickets"
        );
    },

    getMyTicket: (ticketId) => {
        console.log(
            "GET MY TICKET:",
            `${API_BASE_URL}/support/tickets/${ticketId}`
        );

        return API.get(
            `/support/tickets/${ticketId}`
        );
    },

    addUserMessage: (
        ticketId,
        data
    ) => {
        console.log(
            "ADD USER MESSAGE:",
            `${API_BASE_URL}/support/tickets/${ticketId}/messages`,
            data
        );

        return API.post(
            `/support/tickets/${ticketId}/messages`,
            data
        );
    },

    // =====================================================
    // ADMIN
    // =====================================================

    getAllTickets: (status = "") => {

        console.log(
            "GET ADMIN SUPPORT TICKETS"
        );

        if (status) {
            return API.get(
                "/admin/support",
                {
                    params: {
                        status,
                    },
                }
            );
        }

        return API.get(
            "/admin/support"
        );
    },

    getAdminTicket: (ticketId) =>
        API.get(
            `/admin/support/${ticketId}`
        ),

    addAdminMessage: (
        ticketId,
        data
    ) =>
        API.post(
            `/admin/support/${ticketId}/messages`,
            data
        ),

    updateTicket: (
        ticketId,
        data
    ) =>
        API.put(
            `/admin/support/${ticketId}`,
            data
        ),

    closeTicket: (ticketId) =>
        API.put(
            `/admin/support/${ticketId}/close`
        ),

    reopenTicket: (ticketId) =>
        API.put(
            `/admin/support/${ticketId}/reopen`
        ),

    deleteTicket: (ticketId) =>
        API.delete(
            `/admin/support/${ticketId}`
        ),
};

// =========================================================
// ADMIN API
// =========================================================

export const adminApi = {

    getDashboard: () =>
        API.get("/admin/dashboard"),

    getUsers: () =>
        API.get("/admin/users"),

    getRestaurants: () =>
        API.get("/admin/restaurants"),

    getFoods: () =>
        API.get("/admin/foods"),

    getOrders: () =>
        API.get("/admin/orders"),
};

// =========================================================
// OWNER API
// =========================================================

export const ownerApi = {

    getDashboard: () =>
        API.get("/owner/dashboard"),

    getRestaurant: () =>
        API.get("/owner/restaurant"),

    updateRestaurant: (data) =>
        API.put(
            "/owner/restaurant",
            data
        ),

    getFoods: () =>
        API.get("/owner/foods"),

    getOrders: () =>
        API.get("/owner/orders"),
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default API;