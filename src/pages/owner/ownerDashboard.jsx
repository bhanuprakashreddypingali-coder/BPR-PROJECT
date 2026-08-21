import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/ApiService";
import "./OwnerDashboard.css";

function OwnerDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");

    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    useEffect(() => {
        loadDashboard();
    }, []);

    // =========================================================
    // LOAD OWNER DATA
    // =========================================================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                dashboardResponse,
                restaurantResponse,
                ordersResponse
            ] = await Promise.allSettled([

                API.get("/owner/dashboard"),

                API.get("/owner/restaurant"),

                API.get("/owner/orders")
            ]);

            // -------------------------------------------------
            // DASHBOARD
            // -------------------------------------------------

            if (dashboardResponse.status === "fulfilled") {

                setDashboard(
                    dashboardResponse.value.data
                );

            } else {

                console.error(
                    "OWNER DASHBOARD ERROR:",
                    dashboardResponse.reason
                );

                setDashboard(null);
            }

            // -------------------------------------------------
            // RESTAURANT
            // -------------------------------------------------

            let restaurantData = null;

            if (restaurantResponse.status === "fulfilled") {

                restaurantData =
                    restaurantResponse.value.data;

                setRestaurant(restaurantData);

            } else {

                console.error(
                    "OWNER RESTAURANT ERROR:",
                    restaurantResponse.reason
                );

                setRestaurant(null);
            }

            // -------------------------------------------------
            // ORDERS
            // -------------------------------------------------

            if (ordersResponse.status === "fulfilled") {

                const orderData =
                    Array.isArray(
                        ordersResponse.value.data
                    )
                        ? ordersResponse.value.data
                        : [];

                setOrders(orderData);

            } else {

                console.error(
                    "OWNER ORDERS ERROR:",
                    ordersResponse.reason
                );

                setOrders([]);
            }

            // -------------------------------------------------
            // LOAD REVIEWS
            // -------------------------------------------------

            if (restaurantData?.id) {

                loadReviews(
                    restaurantData.id
                );

            } else {

                setReviews([]);
            }

        } catch (err) {

            console.error(
                "OWNER DASHBOARD ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load dashboard."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // LOAD RESTAURANT REVIEWS
    // =========================================================

    const loadReviews = async (restaurantId) => {

        try {

            setReviewsLoading(true);
            setReviewError("");

            const response =
                await API.get(
                    `/reviews/restaurant/${restaurantId}`
                );

            const reviewData =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            setReviews(reviewData);

        } catch (err) {

            console.error(
                "RESTAURANT REVIEWS ERROR:",
                err
            );

            setReviews([]);

            setReviewError(
                err?.response?.data?.message ||
                "Unable to load customer reviews."
            );

        } finally {

            setReviewsLoading(false);
        }
    };

    // =========================================================
    // RESTAURANT IMAGE
    // =========================================================

    const getRestaurantImage = () => {

        if (!restaurant?.image) {

            return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";
        }

        if (
            restaurant.image.startsWith("http")
        ) {

            return restaurant.image;
        }

        return `http://localhost:8080${restaurant.image}`;
    };

    // =========================================================
    // NUMBER FORMAT
    // =========================================================

    const formatNumber = (value) => {

        const number =
            Number(value || 0);

        return number.toLocaleString("en-IN");
    };

    // =========================================================
    // CURRENCY FORMAT
    // =========================================================

    const formatCurrency = (value) => {

        const number =
            Number(value || 0);

        return `₹${number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };

    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        if (!status) {
            return "pending";
        }

        return status
            .toLowerCase()
            .replaceAll("_", "-");
    };

    // =========================================================
    // REVIEW HELPERS
    // =========================================================

    const getReviewCustomerName = (review) => {

        return (
            review.customerName ||
            review.userName ||
            review.fullName ||
            review.customer?.fullName ||
            review.customer?.name ||
            review.user?.fullName ||
            review.user?.name ||
            "Customer"
        );
    };

    const getReviewCustomerPhone = (review) => {

        return (
            review.customerPhone ||
            review.phone ||
            review.customer?.phone ||
            review.user?.phone ||
            "Phone not available"
        );
    };

    const getReviewRating = (review) => {

        return Number(
            review.rating ||
            review.stars ||
            0
        );
    };

    const getReviewComment = (review) => {

        return (
            review.comment ||
            review.review ||
            review.reviewText ||
            review.message ||
            "No review comment."
        );
    };

    const getReviewFoodName = (review) => {

        return (
            review.foodName ||
            review.food?.name ||
            review.food?.foodName ||
            review.itemName ||
            "Restaurant Review"
        );
    };

    const getReviewDate = (review) => {

        const date =
            review.createdAt ||
            review.reviewDate ||
            review.date;

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    // =========================================================
    // REVIEW STARS
    // =========================================================

    const renderStars = (rating) => {

        const stars = [];

        for (let i = 1; i <= 5; i++) {

            stars.push(
                <span
                    key={i}
                    className={
                        i <= rating
                            ? "review-star active"
                            : "review-star"
                    }
                >
                    ★
                </span>
            );
        }

        return stars;
    };

    // =========================================================
    // RECENT REVIEWS
    // =========================================================

    const recentReviews =
        [...reviews]
            .sort((a, b) => {

                const dateA =
                    new Date(
                        a.createdAt ||
                        a.reviewDate ||
                        a.date ||
                        0
                    ).getTime();

                const dateB =
                    new Date(
                        b.createdAt ||
                        b.reviewDate ||
                        b.date ||
                        0
                    ).getTime();

                return dateB - dateA;
            })
            .slice(0, 5);

    // =========================================================
    // RECENT ORDERS
    // =========================================================

    const recentOrders =
        [...orders]
            .sort((a, b) => {

                const dateA =
                    new Date(
                        a.createdAt || 0
                    ).getTime();

                const dateB =
                    new Date(
                        b.createdAt || 0
                    ).getTime();

                return dateB - dateA;
            })
            .slice(0, 5);

    // =========================================================
    // DASHBOARD VALUES
    // =========================================================

    const totalOrders =
        dashboard?.totalOrders ??
        orders.length ??
        0;

    const pendingOrders =
        dashboard?.pendingOrders ??
        orders.filter(
            order =>
                String(order.status)
                    .toUpperCase() === "PENDING"
        ).length;

    const completedOrders =
        dashboard?.completedOrders ??
        orders.filter(
            order =>
                String(order.status)
                    .toUpperCase() === "DELIVERED"
        ).length;

    const totalRevenue =
        dashboard?.totalRevenue ??
        orders
            .filter(
                order =>
                    String(order.status)
                        .toUpperCase() !== "CANCELLED"
            )
            .reduce(
                (sum, order) =>
                    sum +
                    Number(
                        order.totalAmount || 0
                    ),
                0
            );

    const restaurantRating =
        restaurant?.rating ??
        dashboard?.rating ??
        0;

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="owner-dashboard-loading">

                <div className="loading-spinner"></div>

                <p>
                    Loading owner dashboard...
                </p>

            </div>
        );
    }

    // =========================================================
    // MAIN DASHBOARD
    // =========================================================

    return (
        <div className="owner-dashboard-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="owner-dashboard-header">

                <div>

                    <h1>
                        Owner Dashboard
                    </h1>

                    <p>
                        Manage your restaurant,
                        orders and business.
                    </p>

                </div>

                <button
                    className="refresh-button"
                    onClick={loadDashboard}
                >
                    ↻ Refresh
                </button>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="dashboard-error">

                    <strong>
                        Dashboard warning:
                    </strong>

                    <span>
                        {error}
                    </span>

                </div>
            )}

            {/* =================================================
                RESTAURANT CARD
            ================================================= */}

            {restaurant && (

                <section className="owner-restaurant-card">

                    <div className="owner-restaurant-image">

                        <img
                            src={getRestaurantImage()}
                            alt={
                                restaurant.restaurantName ||
                                "Restaurant"
                            }
                            onError={(e) => {

                                e.target.src =
                                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";

                            }}
                        />

                    </div>

                    <div className="owner-restaurant-info">

                        <div className="owner-restaurant-title">

                            <div>

                                <h2>
                                    {restaurant.restaurantName ||
                                        "My Restaurant"}
                                </h2>

                                <p>
                                    {restaurant.address ||
                                        "Address not available"}
                                </p>

                            </div>

                            <div className="owner-rating">

                                <span>
                                    ★
                                </span>

                                <strong>
                                    {Number(
                                        restaurantRating || 0
                                    ).toFixed(1)}
                                </strong>

                            </div>

                        </div>

                        <div className="owner-restaurant-details">

                            {restaurant.phone && (
                                <span>
                                    📞 {restaurant.phone}
                                </span>
                            )}

                            {restaurant.openingTime && (
                                <span>
                                    🕐{" "}
                                    {restaurant.openingTime}
                                    {" - "}
                                    {restaurant.closingTime ||
                                        "--:--"}
                                </span>
                            )}

                        </div>

                        <button
                            className="manage-restaurant-button"
                            onClick={() =>
                                navigate(
                                    "/owner/my-restaurant"
                                )
                            }
                        >
                            Manage Restaurant
                        </button>

                    </div>

                </section>
            )}

            {/* =================================================
                STATISTICS
            ================================================= */}

            <section className="owner-stats-grid">

                <div className="owner-stat-card">

                    <div className="stat-icon">
                        🛍️
                    </div>

                    <div className="stat-info">

                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {formatNumber(totalOrders)}
                        </strong>

                    </div>

                </div>

                <div className="owner-stat-card">

                    <div className="stat-icon">
                        ⏳
                    </div>

                    <div className="stat-info">

                        <span>
                            Pending Orders
                        </span>

                        <strong>
                            {formatNumber(pendingOrders)}
                        </strong>

                    </div>

                </div>

                <div className="owner-stat-card">

                    <div className="stat-icon">
                        ✅
                    </div>

                    <div className="stat-info">

                        <span>
                            Completed Orders
                        </span>

                        <strong>
                            {formatNumber(completedOrders)}
                        </strong>

                    </div>

                </div>

                <div className="owner-stat-card">

                    <div className="stat-icon">
                        💰
                    </div>

                    <div className="stat-info">

                        <span>
                            Total Revenue
                        </span>

                        <strong>
                            {formatCurrency(totalRevenue)}
                        </strong>

                    </div>

                </div>

                <div className="owner-stat-card">

                    <div className="stat-icon">
                        ⭐
                    </div>

                    <div className="stat-info">

                        <span>
                            Restaurant Rating
                        </span>

                        <strong>
                            {Number(
                                restaurantRating || 0
                            ).toFixed(1)}
                        </strong>

                    </div>

                </div>

            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="quick-actions-section">

                <div className="section-title">

                    <h2>
                        Quick Actions
                    </h2>

                </div>

                <div className="quick-actions-grid">

                    <button
                        onClick={() =>
                            navigate("/owner/orders")
                        }
                        className="quick-action-card"
                    >

                        <span className="quick-action-icon">
                            📦
                        </span>

                        <div>

                            <strong>
                                Manage Orders
                            </strong>

                            <small>
                                View and update customer orders
                            </small>

                        </div>

                    </button>

                    <button
                        onClick={() =>
                            navigate("/owner/foods")
                        }
                        className="quick-action-card"
                    >

                        <span className="quick-action-icon">
                            🍽️
                        </span>

                        <div>

                            <strong>
                                Manage Foods
                            </strong>

                            <small>
                                Add and edit menu items
                            </small>

                        </div>

                    </button>

                    <button
                        onClick={() =>
                            navigate("/owner/my-restaurant")
                        }
                        className="quick-action-card"
                    >

                        <span className="quick-action-icon">
                            🏪
                        </span>

                        <div>

                            <strong>
                                My Restaurant
                            </strong>

                            <small>
                                Update restaurant information
                            </small>

                        </div>

                    </button>

                    <button
                        onClick={() =>
                            navigate("/owner/reports")
                        }
                        className="quick-action-card"
                    >

                        <span className="quick-action-icon">
                            📊
                        </span>

                        <div>

                            <strong>
                                Reports
                            </strong>

                            <small>
                                View business performance
                            </small>

                        </div>

                    </button>

                </div>

            </section>

            {/* =================================================
                CUSTOMER REVIEWS
            ================================================= */}

            <section className="customer-reviews-section">

                <div className="section-header-row">

                    <div>

                        <h2>
                            Customer Reviews
                        </h2>

                        <p>
                            See what your customers are saying
                            about your restaurant.
                        </p>

                    </div>

                    <button
                        className="view-all-button"
                        onClick={() =>
                            navigate("/owner/reviews")
                        }
                    >
                        View All Reviews
                    </button>

                </div>

                {reviewError && (

                    <div className="dashboard-error">

                        <strong>
                            Reviews warning:
                        </strong>

                        <span>
                            {reviewError}
                        </span>

                    </div>

                )}

                {reviewsLoading ? (

                    <div className="reviews-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading customer reviews...
                        </p>

                    </div>

                ) : recentReviews.length === 0 ? (

                    <div className="no-reviews">

                        <div className="no-reviews-icon">
                            ⭐
                        </div>

                        <h3>
                            No customer reviews yet
                        </h3>

                        <p>
                            Customer reviews will appear
                            here when customers review
                            your restaurant.
                        </p>

                    </div>

                ) : (

                    <div className="reviews-grid">

                        {recentReviews.map(
                            (review, index) => {

                                const customerName =
                                    getReviewCustomerName(
                                        review
                                    );

                                const customerPhone =
                                    getReviewCustomerPhone(
                                        review
                                    );

                                const rating =
                                    getReviewRating(
                                        review
                                    );

                                return (

                                    <div
                                        className="owner-review-card"
                                        key={
                                            review.id ||
                                            `review-${index}`
                                        }
                                    >

                                        {/* REVIEW HEADER */}

                                        <div className="owner-review-header">

                                            <div className="review-customer">

                                                <div className="review-customer-avatar">

                                                    {customerName
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>

                                                <div>

                                                    <strong>
                                                        {customerName}
                                                    </strong>

                                                    <span>
                                                        📞{" "}
                                                        {customerPhone}
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="review-date">

                                                {getReviewDate(
                                                    review
                                                )}

                                            </div>

                                        </div>

                                        {/* RATING */}

                                        <div className="review-rating">

                                            <div className="review-stars">

                                                {renderStars(
                                                    rating
                                                )}

                                            </div>

                                            <strong>
                                                {rating.toFixed(1)}
                                            </strong>

                                        </div>

                                        {/* FOOD */}

                                        <div className="review-food">

                                            🍽️{" "}
                                            <span>
                                                {getReviewFoodName(
                                                    review
                                                )}
                                            </span>

                                        </div>

                                        {/* COMMENT */}

                                        <div className="review-comment">

                                            <span className="review-quote">
                                                “
                                            </span>

                                            <p>
                                                {getReviewComment(
                                                    review
                                                )}
                                            </p>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </section>

            {/* =================================================
                RECENT ORDERS
            ================================================= */}

            <section className="recent-orders-section">

                <div className="section-header-row">

                    <div>

                        <h2>
                            Recent Orders
                        </h2>

                        <p>
                            Latest orders received
                        </p>

                    </div>

                    <button
                        className="view-all-button"
                        onClick={() =>
                            navigate("/owner/orders")
                        }
                    >
                        View All
                    </button>

                </div>

                {recentOrders.length === 0 ? (

                    <div className="no-orders">

                        <div className="no-orders-icon">
                            📦
                        </div>

                        <h3>
                            No orders yet
                        </h3>

                        <p>
                            Customer orders will appear
                            here.
                        </p>

                    </div>

                ) : (

                    <div className="orders-table-wrapper">

                        <table className="orders-table">

                            <thead>

                                <tr>

                                    <th>
                                        Order ID
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Food
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {recentOrders.map(order => (

                                    <tr key={order.id}>

                                        <td>
                                            <strong>
                                                #{order.id}
                                            </strong>
                                        </td>

                                        <td>

                                            <div className="customer-cell">

                                                <div className="customer-avatar">

                                                    {(
                                                        order.customerName ||
                                                        "C"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>

                                                <div>

                                                    <strong>
                                                        {order.customerName ||
                                                            "Customer"}
                                                    </strong>

                                                    <small>
                                                        {order.customerPhone ||
                                                            ""}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>

                                        <td>
                                            {order.foodName ||
                                                "Food"}
                                        </td>

                                        <td>
                                            {order.quantity ||
                                                0}
                                        </td>

                                        <td>

                                            <strong>
                                                {formatCurrency(
                                                    order.totalAmount
                                                )}
                                            </strong>

                                        </td>

                                        <td>

                                            <span
                                                className={`order-status ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status ||
                                                    "PENDING"}
                                            </span>

                                        </td>

                                        <td>

                                            {order.createdAt
                                                ? new Date(
                                                    order.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                                : "-"}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    );
}

export default OwnerDashboard;