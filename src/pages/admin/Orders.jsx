import React, { useEffect, useState } from "react";
import API from "../../services/ApiService";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================================
    // LOAD ALL ORDERS
    // =========================================================

    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            console.log("Loading admin orders...");

            /*
             * IMPORTANT:
             * Your backend OrderController uses:
             *
             * GET /api/orders
             *
             * NOT:
             *
             * GET /api/admin/orders
             */

            const response = await API.get("/orders");

            console.log("================================");
            console.log("ADMIN ORDERS RESPONSE:");
            console.log(response.data);
            console.log("================================");

            const data = response?.data;

            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data?.content && Array.isArray(data.content)) {
                setOrders(data.content);
            } else {
                setOrders([]);
            }

        } catch (err) {

            console.error("ADMIN ORDERS ERROR:", err);

            console.error(
                "STATUS:",
                err?.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                err?.response?.data
            );

            if (err?.response?.status === 403) {

                setError(
                    "Access denied. Please login again as ADMIN."
                );

            } else if (err?.response?.status === 401) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else {

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data ||
                    "Failed to load orders."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadOrders();

    }, []);

    // =========================================================
    // CUSTOMER NAME
    // =========================================================

    const getCustomerName = (order) => {

        return (
            order?.customerName ||
            order?.user?.fullName ||
            order?.user?.name ||
            order?.userName ||
            order?.name ||
            "Not available"
        );
    };

    // =========================================================
    // CUSTOMER PHONE
    // =========================================================

    const getPhone = (order) => {

        return (
            order?.customerPhone ||
            order?.phone ||
            order?.user?.phone ||
            "Not available"
        );
    };

    // =========================================================
    // RESTAURANT NAME
    // =========================================================

    const getRestaurantName = (order) => {

        return (
            order?.restaurantName ||
            order?.restaurant?.restaurantName ||
            order?.restaurant?.name ||
            "Not available"
        );
    };

    // =========================================================
    // FOOD NAME
    // =========================================================

    const getFoodName = (order) => {

        return (
            order?.foodName ||
            order?.food?.foodName ||
            order?.food?.name ||
            "Not available"
        );
    };

    // =========================================================
    // QUANTITY
    // =========================================================

    const getQuantity = (order) => {

        const quantity =
            order?.quantity;

        if (
            quantity === null ||
            quantity === undefined
        ) {
            return 0;
        }

        return quantity;
    };

    // =========================================================
    // AMOUNT
    // =========================================================

    const getAmount = (order) => {

        const amount =
            order?.totalAmount;

        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "0.00";
        }

        const number =
            Number(amount);

        if (Number.isNaN(number)) {
            return "0.00";
        }

        return number.toFixed(2);
    };

    // =========================================================
    // PAYMENT METHOD
    // =========================================================

    const getPaymentMethod = (order) => {

        return (
            order?.paymentMethod ||
            order?.payment?.paymentMethod ||
            order?.payment?.method ||
            order?.paymentType ||
            order?.method ||
            "Not available"
        );
    };

    // =========================================================
    // STATUS
    // =========================================================

    const getStatus = (status) => {

        return String(
            status || "PENDING"
        )
            .trim()
            .toUpperCase()
            .replaceAll(" ", "_");
    };

    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusStyle = (status) => {

        const value =
            getStatus(status);

        if (
            value === "DELIVERED" ||
            value === "COMPLETED"
        ) {

            return {
                background: "#dff5e7",
                color: "#198754"
            };
        }

        if (
            value === "CANCELLED" ||
            value === "REJECTED"
        ) {

            return {
                background: "#fde2e2",
                color: "#dc3545"
            };
        }

        if (
            value === "PREPARING" ||
            value === "CONFIRMED" ||
            value === "OUT_FOR_DELIVERY"
        ) {

            return {
                background: "#e0ecff",
                color: "#0d6efd"
            };
        }

        if (value === "PAID") {

            return {
                background: "#dff5e7",
                color: "#198754"
            };
        }

        return {
            background: "#fff3cd",
            color: "#856404"
        };
    };

    // =========================================================
    // ORDER DATE / TIME
    // =========================================================

    const getOrderDate = (order) => {

        const value =
            order?.createdAt ||
            order?.orderDate ||
            order?.orderTime ||
            order?.createdDate ||
            order?.date ||
            null;

        if (!value) {
            return "Not available";
        }

        try {

            const date =
                new Date(value);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return String(value);
            }

            return date.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            );

        } catch {

            return String(value);
        }
    };

    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {

        return (

            <div style={styles.loadingPage}>

                <div style={styles.loadingIcon}>
                    ⏳
                </div>

                <h2 style={styles.loadingHeading}>
                    Loading Orders...
                </h2>

                <p style={styles.loadingText}>
                    Fetching orders from server.
                </p>

            </div>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div style={styles.page}>

            {/* =================================================
                HEADER
            ================================================= */}

            <div style={styles.header}>

                <div>

                    <div style={styles.brand}>
                        BPR FLAVORS HUB
                    </div>

                    <h1 style={styles.heading}>
                        Order Management
                    </h1>

                    <p style={styles.subtitle}>
                        View and manage all customer orders.
                    </p>

                </div>

                <div style={styles.headerActions}>

                    <div style={styles.countBadge}>
                        {orders.length} Orders
                    </div>

                    <button
                        type="button"
                        style={styles.refreshButton}
                        onClick={loadOrders}
                    >
                        🔄 Refresh
                    </button>

                </div>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div style={styles.errorBox}>

                    <div style={styles.errorTitle}>
                        ⚠️ Unable to load orders
                    </div>

                    <div>
                        {error}
                    </div>

                    <button
                        type="button"
                        style={styles.retryButton}
                        onClick={loadOrders}
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* =================================================
                EMPTY
            ================================================= */}

            {!error && orders.length === 0 ? (

                <div style={styles.emptyBox}>

                    <div style={styles.emptyIcon}>
                        📦
                    </div>

                    <h2 style={styles.emptyHeading}>
                        No Orders Found
                    </h2>

                    <p style={styles.emptyText}>
                        There are currently no orders.
                    </p>

                    <button
                        type="button"
                        style={styles.refreshButton}
                        onClick={loadOrders}
                    >
                        🔄 Refresh Orders
                    </button>

                </div>

            ) : (

                orders.length > 0 && (

                    <div style={styles.tableWrapper}>

                        <div style={styles.tableScroll}>

                            <table style={styles.table}>

                                <thead>

                                    <tr>

                                        <th style={styles.th}>
                                            Order ID
                                        </th>

                                        <th style={styles.th}>
                                            Customer
                                        </th>

                                        <th style={styles.th}>
                                            Phone
                                        </th>

                                        <th style={styles.th}>
                                            Restaurant
                                        </th>

                                        <th style={styles.th}>
                                            Food
                                        </th>

                                        <th style={styles.th}>
                                            Qty
                                        </th>

                                        <th style={styles.th}>
                                            Amount
                                        </th>

                                        <th style={styles.th}>
                                            Payment
                                        </th>

                                        <th style={styles.th}>
                                            Status
                                        </th>

                                        <th style={styles.th}>
                                            Order Time
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {orders.map(
                                        (order, index) => {

                                            const status =
                                                getStatus(
                                                    order?.status
                                                );

                                            return (

                                                <tr
                                                    key={
                                                        order?.id ??
                                                        index
                                                    }
                                                    style={styles.tr}
                                                >

                                                    {/* ORDER ID */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <strong
                                                            style={
                                                                styles.orderId
                                                            }
                                                        >
                                                            #
                                                            {
                                                                order?.id ??
                                                                "N/A"
                                                            }
                                                        </strong>

                                                    </td>

                                                    {/* CUSTOMER */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <div
                                                            style={
                                                                styles.customerCell
                                                            }
                                                        >

                                                            <span
                                                                style={
                                                                    styles.customerIcon
                                                                }
                                                            >
                                                                👤
                                                            </span>

                                                            <span>
                                                                {
                                                                    getCustomerName(
                                                                        order
                                                                    )
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>

                                                    {/* PHONE */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        {
                                                            getPhone(
                                                                order
                                                            )
                                                        }

                                                    </td>

                                                    {/* RESTAURANT */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        {
                                                            getRestaurantName(
                                                                order
                                                            )
                                                        }

                                                    </td>

                                                    {/* FOOD */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <strong>
                                                            {
                                                                getFoodName(
                                                                    order
                                                                )
                                                            }
                                                        </strong>

                                                    </td>

                                                    {/* QUANTITY */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                styles.quantity
                                                            }
                                                        >
                                                            {
                                                                getQuantity(
                                                                    order
                                                                )
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* AMOUNT */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <strong
                                                            style={
                                                                styles.amount
                                                            }
                                                        >
                                                            ₹
                                                            {
                                                                getAmount(
                                                                    order
                                                                )
                                                            }
                                                        </strong>

                                                    </td>

                                                    {/* PAYMENT */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <span
                                                            style={
                                                                styles.payment
                                                            }
                                                        >
                                                            {
                                                                getPaymentMethod(
                                                                    order
                                                                )
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* STATUS */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        <span
                                                            style={{
                                                                ...styles.status,
                                                                ...getStatusStyle(
                                                                    order?.status
                                                                )
                                                            }}
                                                        >
                                                            {
                                                                status
                                                            }
                                                        </span>

                                                    </td>

                                                    {/* ORDER TIME */}

                                                    <td
                                                        style={
                                                            styles.td
                                                        }
                                                    >

                                                        {
                                                            getOrderDate(
                                                                order
                                                            )
                                                        }

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )
            )}

        </div>
    );
}

// =============================================================
// STYLES
// =============================================================

const styles = {

    page: {
        minHeight: "calc(100vh - 70px)",
        background: "#f6f8fb",
        padding: "35px 5%",
        boxSizing: "border-box"
    },

    loadingPage: {
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f8fb"
    },

    loadingIcon: {
        fontSize: "45px",
        marginBottom: "10px"
    },

    loadingHeading: {
        margin: "5px 0",
        color: "#172033"
    },

    loadingText: {
        color: "#718096"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "30px",
        flexWrap: "wrap"
    },

    brand: {
        color: "#ff5722",
        fontSize: "14px",
        fontWeight: "800",
        letterSpacing: "3px",
        marginBottom: "7px"
    },

    heading: {
        margin: 0,
        color: "#172033",
        fontSize: "32px"
    },

    subtitle: {
        margin: "7px 0 0",
        color: "#718096",
        fontSize: "15px"
    },

    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap"
    },

    countBadge: {
        background: "#fff",
        border: "1px solid #e6e8eb",
        padding: "11px 16px",
        borderRadius: "9px",
        fontWeight: "700",
        color: "#333",
        whiteSpace: "nowrap"
    },

    refreshButton: {
        border: "none",
        background: "#ff5722",
        color: "#fff",
        padding: "11px 18px",
        borderRadius: "9px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "14px"
    },

    errorBox: {
        background: "#fde2e2",
        color: "#b42318",
        padding: "18px",
        borderRadius: "10px",
        marginBottom: "20px",
        border: "1px solid #f5c2c2"
    },

    errorTitle: {
        fontWeight: "800",
        marginBottom: "6px"
    },

    retryButton: {
        marginTop: "12px",
        border: "none",
        background: "#dc3545",
        color: "#fff",
        padding: "9px 15px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "700"
    },

    emptyBox: {
        background: "#fff",
        border: "1px solid #e8ebef",
        borderRadius: "15px",
        padding: "70px 20px",
        textAlign: "center"
    },

    emptyIcon: {
        fontSize: "50px"
    },

    emptyHeading: {
        color: "#172033",
        marginBottom: "8px"
    },

    emptyText: {
        color: "#718096",
        marginBottom: "20px"
    },

    tableWrapper: {
        background: "#fff",
        border: "1px solid #e5e8ec",
        borderRadius: "15px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.04)",
        overflow: "hidden"
    },

    tableScroll: {
        overflowX: "auto"
    },

    table: {
        width: "100%",
        minWidth: "1250px",
        borderCollapse: "collapse",
        fontSize: "14px"
    },

    th: {
        background: "#172033",
        color: "#fff",
        padding: "15px 12px",
        textAlign: "left",
        whiteSpace: "nowrap",
        fontWeight: "700"
    },

    td: {
        padding: "15px 12px",
        borderBottom: "1px solid #eeeeee",
        color: "#333",
        whiteSpace: "nowrap",
        verticalAlign: "middle"
    },

    tr: {
        background: "#fff"
    },

    orderId: {
        color: "#172033",
        fontSize: "15px"
    },

    customerCell: {
        display: "flex",
        alignItems: "center",
        gap: "7px"
    },

    customerIcon: {
        fontSize: "16px"
    },

    quantity: {
        display: "inline-flex",
        minWidth: "28px",
        height: "28px",
        alignItems: "center",
        justifyContent: "center",
        background: "#f1f3f5",
        borderRadius: "6px",
        fontWeight: "700"
    },

    amount: {
        color: "#ff5722",
        fontSize: "15px"
    },

    payment: {
        display: "inline-block",
        background: "#f1f3f5",
        border: "1px solid #ddd",
        borderRadius: "7px",
        padding: "5px 9px",
        fontWeight: "600"
    },

    status: {
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap"
    }
};

export default Orders;