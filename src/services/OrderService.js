import API from "./ApiService";

// ============================================================
// PLACE ORDER
// ============================================================

export const placeOrder = (order) => {

    return API.post(
        "/orders",
        order
    );
};

// ============================================================
// GET MY ORDERS
// ============================================================

export const getMyOrders = () => {

    return API.get(
        "/orders/my"
    );
};

// ============================================================
// GET SINGLE ORDER
// ============================================================

export const getOrderById = (id) => {

    return API.get(
        `/orders/${id}`
    );
};

// ============================================================
// GET ORDER STATUS
// ============================================================

export const getOrderStatus = (
    id,
    status
) => {

    return API.get(
        `/orders/${id}/status`,
        {
            params: {
                status
            }
        }
    );
};

// ============================================================
// CANCEL / DELETE ORDER
// ============================================================

export const cancelMyOrder = (id) => {

    return API.delete(
        `/orders/${id}`
    );
};

// ============================================================
// DELETE ORDER
// ============================================================

export const deleteOrder = (id) => {

    return API.delete(
        `/orders/${id}`
    );
};