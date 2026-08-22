import axios from "axios";

// ============================================================
// PRODUCTION BACKEND
// ============================================================

const API_BASE_URL =
    "https://bpr-backend-production-3381.up.railway.app/api";

// ============================================================
// MAIN AXIOS INSTANCE
// ============================================================

const API = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// ============================================================
// JWT TOKEN HELPER
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

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

API.interceptors.response.use(

    (response) => {

        return response;
    },

    (error) => {

        const status =
            error?.response?.status;

        const data =
            error?.response?.data;

        console.error(
            "API ERROR:",
            status,
            data || error.message
        );

        // ------------------------------------------------------
        // 401 UNAUTHORIZED
        // ------------------------------------------------------

        if (status === 401) {

            console.warn(
                "Unauthorized request."
            );

            /*
             * Do not automatically redirect.
             * This prevents pages from unexpectedly
             * navigating to login.
             */

            // Keep token removal disabled here because
            // some backend endpoints may return 401
            // temporarily.
        }

        // ------------------------------------------------------
        // 403 FORBIDDEN
        // ------------------------------------------------------

        if (status === 403) {

            console.warn(
                "Access denied. Check JWT token and user role."
            );
        }

        return Promise.reject(error);
    }
);


// ============================================================
// REVIEW API
// ============================================================

export const reviewApi = {

    // ----------------------------------------------------------
    // GET RESTAURANT REVIEWS
    // ----------------------------------------------------------

    getRestaurantReviews: (restaurantId) => {

        return API.get(
            `/reviews/restaurant/${restaurantId}`
        );
    },

    // ----------------------------------------------------------
    // ADD REVIEW
    // ----------------------------------------------------------

    addReview: (reviewData) => {

        return API.post(
            "/reviews",
            reviewData
        );
    },

    // ----------------------------------------------------------
    // GET MY REVIEWS
    // ----------------------------------------------------------

    getMyReviews: () => {

        return API.get(
            "/reviews/my"
        );
    },

    // ----------------------------------------------------------
    // GET ALL REVIEWS
    // ----------------------------------------------------------

    getAllReviews: () => {

        return API.get(
            "/reviews"
        );
    },

    // ----------------------------------------------------------
    // GET REVIEW BY ID
    // ----------------------------------------------------------

    getReviewById: (reviewId) => {

        return API.get(
            `/reviews/${reviewId}`
        );
    },

    // ----------------------------------------------------------
    // UPDATE REVIEW
    // ----------------------------------------------------------

    updateReview: (
        reviewId,
        reviewData
    ) => {

        return API.put(
            `/reviews/${reviewId}`,
            reviewData
        );
    },

    // ----------------------------------------------------------
    // DELETE REVIEW
    // ----------------------------------------------------------

    deleteReview: (reviewId) => {

        return API.delete(
            `/reviews/${reviewId}`
        );
    }

};


// ============================================================
// SUPPORT API
// ============================================================

export const supportApi = {

    // ----------------------------------------------------------
    // CREATE SUPPORT TICKET
    // ----------------------------------------------------------

    createTicket: (ticketData) => {

        return API.post(
            "/support/tickets",
            ticketData
        );
    },

    // ----------------------------------------------------------
    // GET MY SUPPORT TICKETS
    // ----------------------------------------------------------

    getMyTickets: () => {

        return API.get(
            "/support/tickets/my"
        );
    },

    // ----------------------------------------------------------
    // GET SUPPORT TICKET BY ID
    // ----------------------------------------------------------

    getTicketById: (ticketId) => {

        return API.get(
            `/support/tickets/${ticketId}`
        );
    },

    // ----------------------------------------------------------
    // ADD USER MESSAGE
    // ----------------------------------------------------------

    addMessage: (
        ticketId,
        messageData
    ) => {

        return API.post(
            `/support/tickets/${ticketId}/messages`,
            messageData
        );
    },

    // ----------------------------------------------------------
    // GET TICKET MESSAGES
    // ----------------------------------------------------------

    getMessages: (ticketId) => {

        return API.get(
            `/support/tickets/${ticketId}/messages`
        );
    },

    // ----------------------------------------------------------
    // CLOSE TICKET
    // ----------------------------------------------------------

    closeTicket: (ticketId) => {

        return API.put(
            `/support/tickets/${ticketId}/close`
        );
    },

    // ----------------------------------------------------------
    // ADMIN - GET ALL TICKETS
    // ----------------------------------------------------------

    getAllTickets: () => {

        return API.get(
            "/support/tickets"
        );
    },

    // ----------------------------------------------------------
    // ADMIN - UPDATE TICKET STATUS
    // ----------------------------------------------------------

    updateTicketStatus: (
        ticketId,
        status
    ) => {

        return API.put(
            `/support/tickets/${ticketId}/status`,
            {
                status
            }
        );
    },

    // ----------------------------------------------------------
    // ADMIN - ADD ADMIN MESSAGE
    // ----------------------------------------------------------

    addAdminMessage: (
        ticketId,
        messageData
    ) => {

        return API.post(
            `/support/tickets/${ticketId}/admin-message`,
            messageData
        );
    }

};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default API;