import axios from "axios";

/* =========================================================
   API BASE URL
   ========================================================= */

const API = axios.create({
    baseURL: "https://bpr-backend-production-3381.up.railway.app/api",
    headers: {
        "Content-Type": "application/json",
    },
});

/* =========================================================
   REQUEST INTERCEPTOR
   ========================================================= */

API.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* =========================================================
   RESPONSE INTERCEPTOR
   ========================================================= */

API.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        console.error(
            "API ERROR:",
            error.response?.status,
            error.response?.data || error.message
        );

        if (error.response?.status === 401) {

            console.warn(
                "Unauthorized request. Token may be expired."
            );

            // Do not automatically remove token here.
            // This prevents unexpected logout during development.
        }

        return Promise.reject(error);
    }
);

/* =========================================================
   AUTH API
   ========================================================= */

export const authApi = {

    login: (data) => {
        return API.post("/auth/login", data);
    },

    register: (data) => {
        return API.post("/auth/register", data);
    },

    getProfile: () => {
        return API.get("/auth/profile");
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};

/* =========================================================
   USER API
   ========================================================= */

export const userApi = {

    getUsers: () => {
        return API.get("/users");
    },

    getUser: (id) => {
        return API.get(`/users/${id}`);
    },

    updateUser: (id, data) => {
        return API.put(`/users/${id}`, data);
    },

    deleteUser: (id) => {
        return API.delete(`/users/${id}`);
    },
};

/* =========================================================
   RESTAURANT API
   ========================================================= */

export const restaurantApi = {

    getAll: () => {
        return API.get("/restaurants");
    },

    getById: (id) => {
        return API.get(`/restaurants/${id}`);
    },

    create: (data) => {
        return API.post("/restaurants", data);
    },

    update: (id, data) => {
        return API.put(`/restaurants/${id}`, data);
    },

    delete: (id) => {
        return API.delete(`/restaurants/${id}`);
    },
};

/* =========================================================
   FOOD API
   ========================================================= */

export const foodApi = {

    getAll: () => {
        return API.get("/foods");
    },

    getById: (id) => {
        return API.get(`/foods/${id}`);
    },

    create: (data) => {
        return API.post("/foods", data);
    },

    update: (id, data) => {
        return API.put(`/foods/${id}`, data);
    },

    delete: (id) => {
        return API.delete(`/foods/${id}`);
    },
};

/* =========================================================
   CART API
   ========================================================= */

export const cartApi = {

    getCart: () => {
        return API.get("/cart");
    },

    addToCart: (data) => {
        return API.post("/cart", data);
    },

    updateCartItem: (id, data) => {
        return API.put(`/cart/${id}`, data);
    },

    removeFromCart: (id) => {
        return API.delete(`/cart/${id}`);
    },

    clearCart: () => {
        return API.delete("/cart/clear");
    },
};

/* =========================================================
   ORDER API
   ========================================================= */

export const orderApi = {

    createOrder: (data) => {
        return API.post("/orders", data);
    },

    getMyOrders: () => {
        return API.get("/orders/my");
    },

    getOrderById: (id) => {
        return API.get(`/orders/${id}`);
    },

    cancelOrder: (id) => {
        return API.put(`/orders/${id}/cancel`);
    },

    getAllOrders: () => {
        return API.get("/orders");
    },

    updateOrderStatus: (id, status) => {
        return API.put(
            `/orders/${id}/status`,
            { status }
        );
    },
};

/* =========================================================
   REVIEW API
   ========================================================= */

export const reviewApi = {

    getRestaurantReviews: (restaurantId) => {
        return API.get(
            `/reviews/restaurant/${restaurantId}`
        );
    },

    createReview: (data) => {
        return API.post("/reviews", data);
    },

    updateReview: (id, data) => {
        return API.put(`/reviews/${id}`, data);
    },

    deleteReview: (id) => {
        return API.delete(`/reviews/${id}`);
    },
};

/* =========================================================
   WISHLIST API
   ========================================================= */

export const wishlistApi = {

    getWishlist: () => {
        return API.get("/wishlist");
    },

    add: (foodId) => {
        return API.post(
            `/wishlist/${foodId}`
        );
    },

    remove: (foodId) => {
        return API.delete(
            `/wishlist/${foodId}`
        );
    },
};

/* =========================================================
   ADDRESS API
   ========================================================= */

export const addressApi = {

    getAll: () => {
        return API.get("/addresses");
    },

    getById: (id) => {
        return API.get(`/addresses/${id}`);
    },

    create: (data) => {
        return API.post("/addresses", data);
    },

    update: (id, data) => {
        return API.put(`/addresses/${id}`, data);
    },

    delete: (id) => {
        return API.delete(`/addresses/${id}`);
    },
};

/* =========================================================
   OWNER API
   ========================================================= */

export const ownerApi = {

    getDashboard: () => {
        return API.get("/owner/dashboard");
    },

    getRestaurant: () => {
        return API.get("/owner/restaurant");
    },

    updateRestaurant: (data) => {
        return API.put(
            "/owner/restaurant",
            data
        );
    },

    getFoods: () => {
        return API.get("/owner/foods");
    },

    getFood: (id) => {
        return API.get(`/owner/foods/${id}`);
    },

    createFood: (data) => {
        return API.post(
            "/owner/foods",
            data
        );
    },

    updateFood: (id, data) => {
        return API.put(
            `/owner/foods/${id}`,
            data
        );
    },

    deleteFood: (id) => {
        return API.delete(
            `/owner/foods/${id}`
        );
    },

    getOrders: () => {
        return API.get("/owner/orders");
    },

    updateOrderStatus: (id, status) => {
        return API.put(
            `/owner/orders/${id}/status`,
            { status }
        );
    },

    getReports: () => {
        return API.get("/owner/reports");
    },
};

/* =========================================================
   ADMIN API
   ========================================================= */

export const adminApi = {

    getDashboard: () => {
        return API.get("/admin/dashboard");
    },

    getUsers: () => {
        return API.get("/admin/users");
    },

    getRestaurants: () => {
        return API.get("/admin/restaurants");
    },

    getFoods: () => {
        return API.get("/admin/foods");
    },

    getOrders: () => {
        return API.get("/admin/orders");
    },

    getReports: () => {
        return API.get("/admin/reports");
    },
};

/* =========================================================
   SUPPORT API
   ========================================================= */

export const supportApi = {

    /* -------------------------------------------------------
       CUSTOMER / RESTAURANT OWNER
       ------------------------------------------------------- */

    createTicket: (data) => {
        return API.post(
            "/support/tickets",
            data
        );
    },

    getMyTickets: () => {
        return API.get(
            "/support/tickets"
        );
    },

    getMyTicket: (ticketId) => {
        return API.get(
            `/support/tickets/${ticketId}`
        );
    },

    addUserMessage: (ticketId, data) => {
        return API.post(
            `/support/tickets/${ticketId}/messages`,
            data
        );
    },

    /* -------------------------------------------------------
       ADMIN
       ------------------------------------------------------- */

    getAllTickets: (status = "") => {

        if (
            status !== null &&
            status !== undefined &&
            status !== ""
        ) {

            return API.get(
                `/admin/support?status=${encodeURIComponent(
                    status
                )}`
            );
        }

        return API.get(
            "/admin/support"
        );
    },

    getAdminTicket: (ticketId) => {
        return API.get(
            `/admin/support/${ticketId}`
        );
    },

    addAdminMessage: (ticketId, data) => {
        return API.post(
            `/admin/support/${ticketId}/messages`,
            data
        );
    },

    updateTicket: (ticketId, data) => {
        return API.put(
            `/admin/support/${ticketId}`,
            data
        );
    },

    closeTicket: (ticketId) => {
        return API.put(
            `/admin/support/${ticketId}/close`
        );
    },

    reopenTicket: (ticketId) => {
        return API.put(
            `/admin/support/${ticketId}/reopen`
        );
    },

    deleteTicket: (ticketId) => {
        return API.delete(
            `/admin/support/${ticketId}`
        );
    },
};

/* =========================================================
   EXPORT DEFAULT API INSTANCE
   ========================================================= */

export default API;