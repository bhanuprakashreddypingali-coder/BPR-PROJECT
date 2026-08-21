import API from "./ApiService";

const CustomerService = {

    // =====================================================
    // RESTAURANTS
    // =====================================================

    getRestaurants: () => {
        return API.get("/restaurants");
    },

    getRestaurantById: (id) => {
        return API.get(`/restaurants/${id}`);
    },

    // =====================================================
    // FOODS
    // =====================================================

    getFoods: () => {
        return API.get("/foods");
    },

    getFoodsByRestaurant: (restaurantId) => {
        return API.get(
            `/foods/restaurant/${restaurantId}`
        );
    },

    getFoodById: (id) => {
        return API.get(`/foods/${id}`);
    },

    // =====================================================
    // CART
    // =====================================================

    addToCart: (cartData) => {
        return API.post("/cart", cartData);
    },

    getCart: () => {
        return API.get("/cart");
    },

    updateCartItem: (cartItemId, quantity) => {
        return API.put(
            `/cart/${cartItemId}?quantity=${quantity}`
        );
    },

    removeCartItem: (cartItemId) => {
        return API.delete(
            `/cart/${cartItemId}`
        );
    },

    clearCart: () => {
        return API.delete("/cart/clear");
    },

    // =====================================================
    // CHECKOUT
    // =====================================================

    checkout: (checkoutData) => {
        return API.post(
            "/cart/checkout",
            checkoutData
        );
    },

    // =====================================================
    // ORDERS
    // =====================================================

    createOrder: (orderData) => {
        return API.post(
            "/orders",
            orderData
        );
    },

    getOrders: () => {
        return API.get("/orders/my");
    },

    getOrderById: (orderId) => {
        return API.get(
            `/orders/${orderId}`
        );
    },

    cancelOrder: (orderId) => {
        return API.put(
            `/orders/${orderId}/cancel`
        );
    },

    // =====================================================
    // PROFILE
    // =====================================================

    getProfile: () => {
        return API.get(
            "/users/profile"
        );
    },

    updateProfile: (data) => {
        return API.put(
            "/users/profile",
            data
        );
    }

};

export default CustomerService;