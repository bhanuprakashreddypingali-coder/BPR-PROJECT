import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getMyOrders,
    cancelMyOrder
} from "../../services/OrderService";

import {
    reviewApi
} from "../../services/ApiService";

import "./Orders.css";


function Orders() {

    const navigate =
        useNavigate();

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [cancellingId, setCancellingId] =
        useState(null);

    // =========================================================
    // REVIEW STATE
    // =========================================================

    const [myReviews, setMyReviews] =
        useState([]);

    const [reviewLoading, setReviewLoading] =
        useState(false);


    // =========================================================
    // LOAD MY ORDERS
    // =========================================================

    const loadOrders = useCallback(
        async (showLoader = true) => {

            try {

                if (showLoader) {
                    setLoading(true);
                } else {
                    setRefreshing(true);
                }

                const token =
                    localStorage.getItem(
                        "token"
                    );

                if (!token) {

                    navigate(
                        "/login",
                        {
                            state: {
                                from: "/orders"
                            }
                        }
                    );

                    return;
                }

                const response =
                    await getMyOrders();

                const data =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : [];

                // Newest first
                const sortedOrders =
                    [...data].sort(
                        (a, b) =>
                            Number(
                                b.id || 0
                            ) -
                            Number(
                                a.id || 0
                            )
                    );

                setOrders(
                    sortedOrders
                );

            } catch (error) {

                console.error(
                    "Load orders error:",
                    error
                );

                if (
                    error.response?.status ===
                    401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    localStorage.removeItem(
                        "role"
                    );

                    navigate(
                        "/login",
                        {
                            state: {
                                from: "/orders"
                            }
                        }
                    );

                    return;
                }

                alert(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to load your orders."
                );

                setOrders([]);

            } finally {

                setLoading(false);
                setRefreshing(false);
            }
        },
        [navigate]
    );


    // =========================================================
    // LOAD MY REVIEWS
    // =========================================================

    const loadMyReviews = useCallback(
        async () => {

            const token =
                localStorage.getItem(
                    "token"
                );

            if (!token) {
                return;
            }

            try {

                setReviewLoading(true);

                const response =
                    await reviewApi.getMyReviews();

                const data =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : [];

                setMyReviews(data);

            } catch (error) {

                console.error(
                    "Load my reviews error:",
                    error
                );

                // Do not block Orders page
                setMyReviews([]);

            } finally {

                setReviewLoading(false);
            }
        },
        []
    );


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadOrders(true);

        loadMyReviews();

    }, [
        loadOrders,
        loadMyReviews
    ]);


    // =========================================================
    // AUTO REFRESH
    // =========================================================

    useEffect(() => {

        const interval =
            setInterval(() => {

                loadOrders(false);

            }, 10000);

        return () => {

            clearInterval(
                interval
            );
        };

    }, [loadOrders]);


    // =========================================================
    // NORMALIZE STATUS
    // =========================================================

    const normalizeStatus = (
        status
    ) => {

        return String(
            status || "PENDING"
        )
            .trim()
            .toUpperCase()
            .replace(
                /[\s-]+/g,
                "_"
            );
    };


    // =========================================================
    // STATUS INFORMATION
    // =========================================================

    const getStatusInfo = (
        status
    ) => {

        const normalized =
            normalizeStatus(
                status
            );

        switch (normalized) {

            case "PENDING":
            case "PLACED":
            case "ORDER_PLACED":

                return {
                    key: "PLACED",
                    label: "Order Placed",
                    icon: "🧾",
                    description:
                        "Your order has been placed successfully.",
                    className:
                        "status-placed"
                };


            case "PREPARING":
            case "PREPARED":

                return {
                    key: "PREPARING",
                    label: "Preparing",
                    icon: "👨‍🍳",
                    description:
                        "The restaurant is preparing your food.",
                    className:
                        "status-preparing"
                };


            case "OUT_FOR_DELIVERY":
            case "OUTFORDELIVERY":

                return {
                    key: "OUT_FOR_DELIVERY",
                    label: "Out for Delivery",
                    icon: "🛵",
                    description:
                        "Your order is on the way.",
                    className:
                        "status-delivery"
                };


            case "DELIVERED":
            case "COMPLETED":

                return {
                    key: "DELIVERED",
                    label: "Delivered",
                    icon: "✅",
                    description:
                        "Your order has been delivered.",
                    className:
                        "status-delivered"
                };


            case "CANCELLED":
            case "CANCELED":

                return {
                    key: "CANCELLED",
                    label: "Cancelled",
                    icon: "❌",
                    description:
                        "This order has been cancelled.",
                    className:
                        "status-cancelled"
                };


            default:

                return {
                    key: normalized,
                    label:
                        normalized
                            .replace(
                                /_/g,
                                " "
                            )
                            .replace(
                                /\b\w/g,
                                (letter) =>
                                    letter.toUpperCase()
                            ),
                    icon: "📦",
                    description:
                        "Your order status is being updated.",
                    className:
                        "status-default"
                };
        }
    };


    // =========================================================
    // STATUS STEPS
    // =========================================================

    const statusSteps = [

        {
            key: "PLACED",
            label: "Order Placed",
            icon: "🧾"
        },

        {
            key: "PREPARING",
            label: "Preparing",
            icon: "👨‍🍳"
        },

        {
            key: "OUT_FOR_DELIVERY",
            label: "Out for Delivery",
            icon: "🛵"
        },

        {
            key: "DELIVERED",
            label: "Delivered",
            icon: "✅"
        }

    ];


    // =========================================================
    // STEP INDEX
    // =========================================================

    const getStepIndex = (
        status
    ) => {

        const key =
            getStatusInfo(
                status
            ).key;

        switch (key) {

            case "PLACED":
                return 0;

            case "PREPARING":
                return 1;

            case "OUT_FOR_DELIVERY":
                return 2;

            case "DELIVERED":
                return 3;

            default:
                return -1;
        }
    };


    // =========================================================
    // CAN CANCEL
    // =========================================================

    const canCancelOrder = (
        status
    ) => {

        const normalized =
            normalizeStatus(
                status
            );

        return [
            "PENDING",
            "PLACED",
            "ORDER_PLACED",
            "PREPARING"
        ].includes(
            normalized
        );
    };


    // =========================================================
    // CANCEL ORDER
    // =========================================================

    const cancelOrder = async (
        order
    ) => {

        const orderId =
            order.id;

        if (!orderId) {
            return;
        }

        if (
            !canCancelOrder(
                order.status
            )
        ) {

            alert(
                "This order can no longer be cancelled."
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to cancel Order #${orderId}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setCancellingId(
                orderId
            );

            const response =
                await cancelMyOrder(
                    orderId
                );

            const updatedOrder =
                response.data;

            setOrders(
                (previous) =>
                    previous.map(
                        (item) =>
                            item.id === orderId
                                ? {
                                      ...item,
                                      ...(updatedOrder ||
                                          {}),
                                      status:
                                          "CANCELLED"
                                  }
                                : item
                    )
            );

            alert(
                `Order #${orderId} has been cancelled successfully.`
            );

        } catch (error) {

            console.error(
                "Cancel order error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to cancel this order.";

            alert(
                typeof message ===
                    "string"
                    ? message
                    : "Unable to cancel this order."
            );

            await loadOrders(false);

        } finally {

            setCancellingId(
                null
            );
        }
    };


    // =========================================================
    // GET RESTAURANT ID FROM ORDER
    // =========================================================

    const getRestaurantId =
        (order) => {

            return (
                order?.restaurantId ||
                order?.restaurant?.id ||
                order?.food?.restaurantId ||
                order?.food?.restaurant?.id
            );
        };


    // =========================================================
    // GET RESTAURANT NAME
    // =========================================================

    const getRestaurantName =
        (order) => {

            return (
                order?.restaurantName ||
                order?.restaurant?.restaurantName ||
                order?.restaurant?.name ||
                order?.food?.restaurant?.restaurantName ||
                order?.food?.restaurant?.name ||
                "Restaurant"
            );
        };


    // =========================================================
    // GET REVIEW RESTAURANT ID
    // =========================================================

    const getReviewRestaurantId =
        (review) => {

            return (
                review?.restaurantId ||
                review?.restaurant?.id ||
                review?.restaurant?.restaurantId
            );
        };


    // =========================================================
    // CHECK WHETHER CUSTOMER ALREADY REVIEWED
    // =========================================================

    const getExistingReview =
        (order) => {

            const restaurantId =
                getRestaurantId(
                    order
                );

            if (!restaurantId) {
                return null;
            }

            return (
                myReviews.find(
                    (review) => {

                        const reviewRestaurantId =
                            getReviewRestaurantId(
                                review
                            );

                        return (
                            Number(
                                reviewRestaurantId
                            ) ===
                            Number(
                                restaurantId
                            )
                        );
                    }
                ) || null
            );
        };


    // =========================================================
    // RATE / VIEW REVIEW
    // =========================================================

    const handleReviewAction =
        (order) => {

            const restaurantId =
                getRestaurantId(
                    order
                );

            if (!restaurantId) {

                alert(
                    "Restaurant information is not available for this order."
                );

                return;
            }

            const existingReview =
                getExistingReview(
                    order
                );

            // Existing review
            if (existingReview) {

                navigate(
                    `/restaurant/${restaurantId}?review=true`
                );

                return;
            }

            // New review
            navigate(
                `/restaurant/${restaurantId}?review=true`
            );
        };


    // =========================================================
    // ACTIVE ORDERS
    // =========================================================

    const activeOrders =
        useMemo(() => {

            return orders.filter(
                (order) => {

                    const status =
                        getStatusInfo(
                            order.status
                        ).key;

                    return (
                        status !== "DELIVERED" &&
                        status !== "CANCELLED"
                    );
                }
            );

        }, [orders]);


    // =========================================================
    // DELIVERED ORDERS
    // =========================================================

    const deliveredOrders =
        useMemo(() => {

            return orders.filter(
                (order) => {

                    const status =
                        getStatusInfo(
                            order.status
                        ).key;

                    return (
                        status === "DELIVERED"
                    );
                }
            );

        }, [orders]);


    // =========================================================
    // PRICE
    // =========================================================

    const formatPrice = (
        amount
    ) => {

        return Number(
            amount || 0
        ).toFixed(2);
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="orders-page">

                <div className="orders-container">

                    <div className="orders-loading">

                        <div className="orders-spinner" />

                        <h2>
                            Loading Your Orders
                        </h2>

                        <p>
                            Please wait while we fetch
                            your orders.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="orders-page">

            <div className="orders-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="orders-header">

                    <div>

                        <span className="orders-eyebrow">
                            BPR FLAVORS HUB
                        </span>

                        <h1>
                            My Orders
                        </h1>

                        <p>
                            Track your food orders
                            in real time.
                        </p>

                    </div>


                    <button
                        type="button"
                        className=
                            "refresh-orders-button"
                        onClick={() =>
                            loadOrders(false)
                        }
                        disabled={
                            refreshing
                        }
                    >

                        {refreshing
                            ? "⏳ Refreshing..."
                            : "🔄 Refresh"}

                    </button>

                </div>


                {/* =================================================
                    LIVE TRACKING
                ================================================= */}

                <div
                    className=
                        "live-tracking-banner"
                >

                    <span className="live-dot" />

                    <div>

                        <strong>
                            Live tracking is enabled
                        </strong>

                        <span>
                            Order status refreshes
                            automatically every
                            10 seconds.
                        </span>

                    </div>

                </div>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                {orders.length > 0 && (

                    <div className="orders-stats">

                        <div className=
                            "orders-stat-card"
                        >

                            <div className=
                                "orders-stat-icon"
                            >
                                📦
                            </div>

                            <div>

                                <strong>
                                    {
                                        orders.length
                                    }
                                </strong>

                                <span>
                                    Total Orders
                                </span>

                            </div>

                        </div>


                        <div className=
                            "orders-stat-card"
                        >

                            <div className=
                                "orders-stat-icon active"
                            >
                                🛵
                            </div>

                            <div>

                                <strong>
                                    {
                                        activeOrders.length
                                    }
                                </strong>

                                <span>
                                    Active Orders
                                </span>

                            </div>

                        </div>


                        <div className=
                            "orders-stat-card"
                        >

                            <div className=
                                "orders-stat-icon delivered"
                            >
                                ✅
                            </div>

                            <div>

                                <strong>
                                    {
                                        deliveredOrders.length
                                    }
                                </strong>

                                <span>
                                    Delivered
                                </span>

                            </div>

                        </div>

                    </div>
                )}


                {/* =================================================
                    NO ORDERS
                ================================================= */}

                {orders.length === 0 ? (

                    <div
                        className=
                            "no-orders-card"
                    >

                        <div className=
                            "no-orders-icon"
                        >
                            📦
                        </div>

                        <h2>
                            No Orders Yet
                        </h2>

                        <p>
                            You haven't placed any
                            orders yet.
                        </p>

                        <button
                            type="button"
                            className=
                                "explore-button"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            🍽️ Explore Foods
                        </button>

                    </div>

                ) : (

                    <div className="orders-list">

                        {orders.map(
                            (order) => {

                                const status =
                                    getStatusInfo(
                                        order.status
                                    );

                                const stepIndex =
                                    getStepIndex(
                                        order.status
                                    );

                                const cancellable =
                                    canCancelOrder(
                                        order.status
                                    );

                                const isDelivered =
                                    status.key ===
                                    "DELIVERED";

                                const existingReview =
                                    isDelivered
                                        ? getExistingReview(
                                              order
                                          )
                                        : null;

                                const restaurantName =
                                    getRestaurantName(
                                        order
                                    );

                                return (

                                    <article
                                        className=
                                            "order-card"
                                        key={
                                            order.id
                                        }
                                    >

                                        {/* =================================================
                                            ORDER HEADER
                                        ================================================= */}

                                        <div className=
                                            "order-card-header"
                                        >

                                            <div>

                                                <span
                                                    className=
                                                        "order-number"
                                                >

                                                    ORDER #

                                                    {
                                                        order.id
                                                    }

                                                </span>

                                                <h2>
                                                    {
                                                        order.foodName ||
                                                        "Food Order"
                                                    }
                                                </h2>

                                            </div>


                                            <div
                                                className={
                                                    `order-status-badge ${status.className}`
                                                }
                                            >

                                                <span>
                                                    {
                                                        status.icon
                                                    }
                                                </span>

                                                {
                                                    status.label
                                                }

                                            </div>

                                        </div>


                                        {/* =================================================
                                            TRACKING
                                        ================================================= */}

                                        {status.key !==
                                            "CANCELLED" && (

                                            <div
                                                className=
                                                    "tracking-section"
                                            >

                                                <div className=
                                                    "tracking-line"
                                                >

                                                    {statusSteps.map(
                                                        (
                                                            step,
                                                            index
                                                        ) => {

                                                            const completed =
                                                                stepIndex >=
                                                                index;

                                                            const current =
                                                                stepIndex ===
                                                                index;

                                                            return (

                                                                <div
                                                                    className={
                                                                        `tracking-step ${
                                                                            completed
                                                                                ? "completed"
                                                                                : ""
                                                                        } ${
                                                                            current
                                                                                ? "current"
                                                                                : ""
                                                                        }`
                                                                    }
                                                                    key={
                                                                        step.key
                                                                    }
                                                                >

                                                                    <div className=
                                                                        "tracking-circle"
                                                                    >
                                                                        {
                                                                            step.icon
                                                                        }
                                                                    </div>

                                                                    <span>
                                                                        {
                                                                            step.label
                                                                        }
                                                                    </span>

                                                                </div>
                                                            );
                                                        }
                                                    )}

                                                </div>


                                                <div className=
                                                    "tracking-progress"
                                                >

                                                    <div
                                                        className=
                                                            "tracking-progress-fill"
                                                        style={{
                                                            width:
                                                                stepIndex <=
                                                                    0
                                                                    ? "0%"
                                                                    : stepIndex ===
                                                                          1
                                                                    ? "33.33%"
                                                                    : stepIndex ===
                                                                          2
                                                                    ? "66.66%"
                                                                    : "100%"
                                                        }}
                                                    />

                                                </div>

                                            </div>
                                        )}


                                        {/* =================================================
                                            STATUS
                                        ================================================= */}

                                        <div
                                            className={
                                                `order-status-message ${status.className}`
                                            }
                                        >

                                            <span>
                                                {
                                                    status.icon
                                                }
                                            </span>

                                            <div>

                                                <strong>
                                                    {
                                                        status.label
                                                    }
                                                </strong>

                                                <p>
                                                    {
                                                        status.description
                                                    }
                                                </p>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            DETAILS
                                        ================================================= */}

                                        <div className=
                                            "order-details-grid"
                                        >

                                            <div className=
                                                "order-detail"
                                            >

                                                <span>
                                                    🍽️ Food
                                                </span>

                                                <strong>
                                                    {
                                                        order.foodName ||
                                                        "Food Item"
                                                    }
                                                </strong>

                                            </div>


                                            <div className=
                                                "order-detail"
                                            >

                                                <span>
                                                    🔢 Quantity
                                                </span>

                                                <strong>
                                                    {
                                                        order.quantity ??
                                                        1
                                                    }
                                                </strong>

                                            </div>


                                            <div className=
                                                "order-detail"
                                            >

                                                <span>
                                                    💰 Total
                                                </span>

                                                <strong
                                                    className=
                                                        "order-price"
                                                >

                                                    ₹
                                                    {
                                                        formatPrice(
                                                            order.totalAmount
                                                        )
                                                    }

                                                </strong>

                                            </div>


                                            <div className=
                                                "order-detail"
                                            >

                                                <span>
                                                    💳 Payment
                                                </span>

                                                <strong>
                                                    {
                                                        order.paymentMethod ||
                                                        "N/A"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            ADDRESS
                                        ================================================= */}

                                        {order.deliveryAddress && (

                                            <div className=
                                                "delivery-address"
                                            >

                                                <span>
                                                    📍
                                                </span>

                                                <div>

                                                    <small>
                                                        Delivery Address
                                                    </small>

                                                    <strong>
                                                        {
                                                            order.deliveryAddress
                                                        }
                                                    </strong>

                                                </div>

                                            </div>
                                        )}


                                        {/* =================================================
                                            DELIVERED REVIEW AREA
                                        ================================================= */}

                                        {isDelivered && (

                                            <div
                                                className=
                                                    "delivered-review-box"
                                            >

                                                <div className=
                                                    "delivered-review-info"
                                                >

                                                    <div className=
                                                        "delivered-check-icon"
                                                    >
                                                        ✅
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            Order Delivered
                                                        </strong>

                                                        <span>
                                                            How was your
                                                            experience at{" "}
                                                            <b>
                                                                {
                                                                    restaurantName
                                                                }
                                                            </b>
                                                            ?
                                                        </span>

                                                    </div>

                                                </div>


                                                {existingReview ? (

                                                    <button
                                                        type="button"
                                                        className=
                                                            "view-review-button"
                                                        onClick={() =>
                                                            handleReviewAction(
                                                                order
                                                            )
                                                        }
                                                    >
                                                        ⭐{" "}
                                                        {Number(
                                                            existingReview.rating ||
                                                            0
                                                        ).toFixed(1)}{" "}
                                                        View Review
                                                    </button>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        className=
                                                            "rate-order-button"
                                                        onClick={() =>
                                                            handleReviewAction(
                                                                order
                                                            )
                                                        }
                                                    >
                                                        ⭐ Rate & Review
                                                    </button>

                                                )}

                                            </div>
                                        )}


                                        {/* =================================================
                                            ACTIONS
                                        ================================================= */}

                                        <div className=
                                            "order-actions"
                                        >

                                            <button
                                                type="button"
                                                className=
                                                    "view-order-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/orders/${order.id}`
                                                    )
                                                }
                                            >
                                                👁️ View Order
                                            </button>


                                            {cancellable && (

                                                <button
                                                    type="button"
                                                    className=
                                                        "cancel-order-button"
                                                    disabled={
                                                        cancellingId ===
                                                        order.id
                                                    }
                                                    onClick={() =>
                                                        cancelOrder(
                                                            order
                                                        )
                                                    }
                                                >

                                                    {cancellingId ===
                                                    order.id
                                                        ? "Cancelling..."
                                                        : "✕ Cancel Order"}

                                                </button>

                                            )}

                                        </div>

                                    </article>
                                );
                            }
                        )}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Orders;