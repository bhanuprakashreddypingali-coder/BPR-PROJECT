import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/ApiService";

function Dashboard() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalRestaurants: 0,
        totalFoods: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });

    const [pendingOwners, setPendingOwners] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [processingOwner, setProcessingOwner] = useState(null);

    // =========================================================
    // GET ARRAY FROM API RESPONSE
    // =========================================================

    const getArray = (response) => {
        const data = response?.data;

        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.content)) {
            return data.content;
        }

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        if (Array.isArray(data?.items)) {
            return data.items;
        }

        if (Array.isArray(data?.users)) {
            return data.users;
        }

        if (Array.isArray(data?.restaurants)) {
            return data.restaurants;
        }

        if (Array.isArray(data?.foods)) {
            return data.foods;
        }

        if (Array.isArray(data?.orders)) {
            return data.orders;
        }

        return [];
    };

    // =========================================================
    // NUMBER HELPER
    // =========================================================

    const toNumber = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return 0;
        }

        if (typeof value === "number") {
            return Number.isFinite(value) ? value : 0;
        }

        const parsed = Number(
            String(value).replace(/[₹,\s]/g, "")
        );

        return Number.isFinite(parsed)
            ? parsed
            : 0;
    };

    // =========================================================
    // NORMALIZE STATUS
    // =========================================================

    const normalizeStatus = (value) => {
        return String(value ?? "")
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_");
    };

    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    const loadDashboard = useCallback(
        async (showLoader = true) => {
            try {
                if (showLoader) {
                    setLoading(true);
                }

                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login", {
                        replace: true,
                    });

                    return;
                }

                console.log(
                    "======================================"
                );

                console.log("ADMIN DASHBOARD");

                console.log("Loading dashboard data...");

                console.log(
                    "======================================"
                );

                // =================================================
                // DATA ARRAYS
                // =================================================

                let users = [];
                let restaurants = [];
                let foods = [];
                let orders = [];

                // =================================================
                // USERS
                // =================================================

                try {
                    const response = await API.get(
                        "/admin/users"
                    );

                    users = getArray(response);

                    console.log("USERS:", users);
                    console.log(
                        "TOTAL USERS:",
                        users.length
                    );
                } catch (err) {
                    console.error(
                        "USERS API ERROR:",
                        err.response?.status,
                        err.response?.data
                    );
                }

                // =================================================
                // RESTAURANTS
                // =================================================

                try {
                    const response = await API.get(
                        "/restaurants"
                    );

                    restaurants = getArray(response);

                    console.log(
                        "RESTAURANTS:",
                        restaurants
                    );

                    console.log(
                        "TOTAL RESTAURANTS:",
                        restaurants.length
                    );
                } catch (err) {
                    console.error(
                        "RESTAURANTS API ERROR:",
                        err.response?.status,
                        err.response?.data
                    );
                }

                // =================================================
                // FOODS
                // =================================================

                try {
                    const response = await API.get(
                        "/foods"
                    );

                    foods = getArray(response);

                    console.log("FOODS:", foods);

                    console.log(
                        "TOTAL FOODS:",
                        foods.length
                    );
                } catch (err) {
                    console.error(
                        "FOODS API ERROR:",
                        err.response?.status,
                        err.response?.data
                    );
                }

                // =================================================
                // ORDERS
                //
                // IMPORTANT:
                //
                // Backend controller:
                //
                // @RequestMapping("/api/orders")
                // @GetMapping
                //
                // Therefore frontend endpoint is:
                //
                // /orders
                //
                // NOT:
                //
                // /admin/orders
                // =================================================

                try {
                    const response = await API.get(
                        "/orders"
                    );

                    orders = getArray(response);

                    console.log(
                        "ORDERS:",
                        orders
                    );

                    console.log(
                        "TOTAL ORDERS:",
                        orders.length
                    );
                } catch (err) {
                    console.error(
                        "ORDERS API ERROR:",
                        err.response?.status,
                        err.response?.data
                    );

                    // =================================================
                    // ONLY LOGOUT ON 401
                    // =================================================

                    if (
                        err.response?.status === 401
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

                        navigate("/login", {
                            replace: true,
                        });

                        return;
                    }
                }

                // =================================================
                // TOTAL USERS
                // =================================================

                const totalUsers =
                    users.length;

                // =================================================
                // TOTAL RESTAURANTS
                // =================================================

                const totalRestaurants =
                    restaurants.length;

                // =================================================
                // TOTAL FOODS
                // =================================================

                const totalFoods =
                    foods.length;

                // =================================================
                // TOTAL ORDERS
                // =================================================

                const totalOrders =
                    orders.length;

                // =================================================
                // PENDING ORDERS
                // =================================================

                const pendingOrders =
                    orders.filter((order) => {
                        const status =
                            normalizeStatus(
                                order?.status ??
                                order?.orderStatus
                            );

                        return status === "PENDING";
                    }).length;

                // =================================================
                // TOTAL REVENUE
                //
                // Count PAID + DELIVERED orders.
                //
                // Your database currently contains:
                //
                // PAID
                // DELIVERED
                //
                // CANCELLED orders are NOT counted.
                //
                // PENDING / PREPARING /
                // OUT_FOR_DELIVERY are NOT counted
                // as completed revenue.
                // =================================================

                let totalRevenue = 0;

                orders.forEach((order) => {
                    const status =
                        normalizeStatus(
                            order?.status ??
                            order?.orderStatus
                        );

                    const amount =
                        toNumber(
                            order?.totalAmount
                        ) ||
                        toNumber(
                            order?.amount
                        ) ||
                        toNumber(
                            order?.total
                        );

                    if (
                        status === "PAID" ||
                        status === "DELIVERED"
                    ) {
                        totalRevenue += amount;
                    }
                });

                // =================================================
                // FINAL DASHBOARD DATA
                // =================================================

                const dashboardData = {
                    totalUsers,
                    totalRestaurants,
                    totalFoods,
                    totalOrders,
                    totalRevenue,
                    pendingOrders,
                };

                console.log(
                    "======================================"
                );

                console.log(
                    "FINAL DASHBOARD DATA"
                );

                console.log(
                    dashboardData
                );

                console.log(
                    "======================================"
                );

                setDashboard(
                    dashboardData
                );

                // =================================================
                // PENDING RESTAURANT OWNERS
                // =================================================

                const pending =
                    users.filter((user) => {
                        const role =
                            String(
                                user?.role ??
                                user?.roles ??
                                ""
                            )
                                .replace(
                                    /^ROLE_/i,
                                    ""
                                )
                                .toUpperCase();

                        return (
                            role ===
                                "RESTAURANT_OWNER" &&
                            user?.approved === false
                        );
                    });

                setPendingOwners(
                    pending
                );

                console.log(
                    "PENDING OWNERS:",
                    pending
                );
            } catch (err) {
                console.error(
                    "DASHBOARD ERROR:",
                    err
                );

                if (
                    err.response?.status ===
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

                    navigate("/login", {
                        replace: true,
                    });

                    return;
                }

                setError(
                    "Unable to load dashboard."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [navigate]
    );

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadDashboard(true);
    }, [loadDashboard]);

    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = async () => {
        setRefreshing(true);

        await loadDashboard(false);
    };

    // =========================================================
    // APPROVE OWNER
    // =========================================================

    const approveOwner = async (owner) => {
        if (!owner?.id) {
            return;
        }

        const name =
            owner.fullName ||
            owner.name ||
            "this restaurant owner";

        if (
            !window.confirm(
                `Approve ${name}?`
            )
        ) {
            return;
        }

        try {
            setProcessingOwner(
                owner.id
            );

            await API.put(
                `/admin/users/${owner.id}/approve`
            );

            alert(
                "Restaurant owner approved successfully."
            );

            await loadDashboard(false);
        } catch (err) {
            console.error(
                "Approve owner error:",
                err
            );

            alert(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to approve owner."
            );
        } finally {
            setProcessingOwner(null);
        }
    };

    // =========================================================
    // REJECT OWNER
    // =========================================================

    const rejectOwner = async (owner) => {
        if (!owner?.id) {
            return;
        }

        const name =
            owner.fullName ||
            owner.name ||
            "this restaurant owner";

        if (
            !window.confirm(
                `Reject ${name}?`
            )
        ) {
            return;
        }

        try {
            setProcessingOwner(
                owner.id
            );

            await API.put(
                `/admin/users/${owner.id}/reject`
            );

            alert(
                "Restaurant owner rejected successfully."
            );

            await loadDashboard(false);
        } catch (err) {
            console.error(
                "Reject owner error:",
                err
            );

            alert(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to reject owner."
            );
        } finally {
            setProcessingOwner(null);
        }
    };

    // =========================================================
    // FORMAT MONEY
    // =========================================================

    const formatMoney = (value) => {
        return toNumber(value).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div style={styles.loadingPage}>
                <div style={styles.loadingIcon}>
                    ⏳
                </div>

                <h2>
                    Loading Admin Dashboard...
                </h2>

                <p>
                    Fetching platform data...
                </p>
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <div style={styles.page}>
                <div style={styles.errorBox}>
                    <div style={styles.errorIcon}>
                        ⚠️
                    </div>

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        style={styles.retryButton}
                        onClick={() =>
                            loadDashboard(true)
                        }
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // =========================================================
    // DASHBOARD UI
    // =========================================================

    return (
        <div style={styles.page}>

            {/* HEADER */}

            <div style={styles.header}>
                <div>
                    <div style={styles.brand}>
                        BPR FLAVORS HUB
                    </div>

                    <h1 style={styles.heading}>
                        Admin Dashboard
                    </h1>

                    <p style={styles.subtitle}>
                        Manage your food ordering
                        platform.
                    </p>
                </div>

                <button
                    type="button"
                    style={{
                        ...styles.refreshButton,
                        opacity:
                            refreshing
                                ? 0.7
                                : 1,
                    }}
                    disabled={refreshing}
                    onClick={handleRefresh}
                >
                    {refreshing
                        ? "⏳ Loading..."
                        : "🔄 Refresh"}
                </button>
            </div>

            {/* STAT CARDS */}

            <div style={styles.cards}>

                <StatCard
                    icon="👥"
                    title="Total Users"
                    value={
                        dashboard.totalUsers
                    }
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                />

                <StatCard
                    icon="🏪"
                    title="Total Restaurants"
                    value={
                        dashboard.totalRestaurants
                    }
                    onClick={() =>
                        navigate(
                            "/admin/restaurants"
                        )
                    }
                />

                <StatCard
                    icon="🍔"
                    title="Total Foods"
                    value={
                        dashboard.totalFoods
                    }
                    onClick={() =>
                        navigate(
                            "/admin/foods"
                        )
                    }
                />

                <StatCard
                    icon="📦"
                    title="Total Orders"
                    value={
                        dashboard.totalOrders
                    }
                    onClick={() =>
                        navigate(
                            "/admin/orders"
                        )
                    }
                />

                <StatCard
                    icon="💰"
                    title="Total Revenue"
                    value={`₹ ${formatMoney(
                        dashboard.totalRevenue
                    )}`}
                    onClick={() =>
                        navigate(
                            "/admin/reports"
                        )
                    }
                />

                <StatCard
                    icon="⏳"
                    title="Pending Orders"
                    value={
                        dashboard.pendingOrders
                    }
                    onClick={() =>
                        navigate(
                            "/admin/orders"
                        )
                    }
                />

            </div>

            {/* QUICK ACTIONS */}

            <div style={styles.section}>

                <h2 style={styles.sectionTitle}>
                    Quick Actions
                </h2>

                <div style={styles.quickGrid}>

                    <QuickButton
                        icon="👥"
                        text="Manage Users"
                        onClick={() =>
                            navigate(
                                "/admin/users"
                            )
                        }
                    />

                    <QuickButton
                        icon="🏪"
                        text="Manage Restaurants"
                        onClick={() =>
                            navigate(
                                "/admin/restaurants"
                            )
                        }
                    />

                    <QuickButton
                        icon="🍔"
                        text="Manage Foods"
                        onClick={() =>
                            navigate(
                                "/admin/foods"
                            )
                        }
                    />

                    <QuickButton
                        icon="📦"
                        text="Manage Orders"
                        onClick={() =>
                            navigate(
                                "/admin/orders"
                            )
                        }
                    />

                    <QuickButton
                        icon="📊"
                        text="Reports"
                        onClick={() =>
                            navigate(
                                "/admin/reports"
                            )
                        }
                    />

                </div>
            </div>

            {/* OWNER APPROVAL */}

            <div style={styles.section}>

                <div style={styles.sectionHeader}>

                    <div>
                        <h2
                            style={
                                styles.sectionTitle
                            }
                        >
                            Restaurant Owner
                            Approvals
                        </h2>

                        <p
                            style={
                                styles.sectionSubtitle
                            }
                        >
                            Owners waiting for
                            admin approval.
                        </p>
                    </div>

                    <div
                        style={
                            styles.pendingBadge
                        }
                    >
                        {
                            pendingOwners.length
                        }
                    </div>

                </div>

                {pendingOwners.length ===
                0 ? (
                    <div
                        style={
                            styles.emptyBox
                        }
                    >
                        <div
                            style={
                                styles.emptyIcon
                            }
                        >
                            ✅
                        </div>

                        <h3>
                            No Pending Owners
                        </h3>

                        <p>
                            All restaurant owners
                            are processed.
                        </p>
                    </div>
                ) : (
                    <div
                        style={
                            styles.ownerList
                        }
                    >
                        {pendingOwners.map(
                            (owner) => {

                                const name =
                                    owner.fullName ||
                                    owner.name ||
                                    "Unknown Owner";

                                const initial =
                                    name
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase() ||
                                    "U";

                                const processing =
                                    processingOwner ===
                                    owner.id;

                                return (
                                    <div
                                        key={
                                            owner.id
                                        }
                                        style={
                                            styles.ownerCard
                                        }
                                    >

                                        <div
                                            style={
                                                styles.ownerAvatar
                                            }
                                        >
                                            {
                                                initial
                                            }
                                        </div>

                                        <div
                                            style={
                                                styles.ownerInfo
                                            }
                                        >
                                            <strong>
                                                {name}
                                            </strong>

                                            <span>
                                                {owner.phone ||
                                                    "No phone"}
                                            </span>

                                            <span>
                                                {owner.email ||
                                                    "No email"}
                                            </span>
                                        </div>

                                        <div
                                            style={
                                                styles.ownerActions
                                            }
                                        >
                                            <button
                                                type="button"
                                                disabled={
                                                    processing
                                                }
                                                style={
                                                    styles.approveButton
                                                }
                                                onClick={() =>
                                                    approveOwner(
                                                        owner
                                                    )
                                                }
                                            >
                                                {processing
                                                    ? "Processing..."
                                                    : "Approve"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    processing
                                                }
                                                style={
                                                    styles.rejectButton
                                                }
                                                onClick={() =>
                                                    rejectOwner(
                                                        owner
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>
                                        </div>

                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

            </div>

        </div>
    );
}

// =============================================================
// STAT CARD
// =============================================================

function StatCard({
    icon,
    title,
    value,
    onClick,
}) {
    return (
        <button
            type="button"
            style={styles.statCard}
            onClick={onClick}
        >
            <div style={styles.cardTop}>

                <div style={styles.cardIcon}>
                    {icon}
                </div>

                <span style={styles.arrow}>
                    →
                </span>

            </div>

            <div style={styles.cardValue}>
                {value}
            </div>

            <div style={styles.cardTitle}>
                {title}
            </div>

            <div style={styles.viewText}>
                View details
            </div>

        </button>
    );
}

// =============================================================
// QUICK BUTTON
// =============================================================

function QuickButton({
    icon,
    text,
    onClick,
}) {
    return (
        <button
            type="button"
            style={styles.quickButton}
            onClick={onClick}
        >
            <span style={styles.quickIcon}>
                {icon}
            </span>

            <span>
                {text}
            </span>

            <span style={styles.quickArrow}>
                →
            </span>
        </button>
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
        boxSizing: "border-box",
    },

    loadingPage: {
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f8fb",
        color: "#172033",
    },

    loadingIcon: {
        fontSize: "45px",
        marginBottom: "15px",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        gap: "20px",
    },

    brand: {
        color: "#ff5722",
        fontWeight: "800",
        fontSize: "14px",
        letterSpacing: "3px",
        marginBottom: "7px",
    },

    heading: {
        margin: 0,
        fontSize: "42px",
        color: "#172033",
    },

    subtitle: {
        margin: "8px 0 0",
        color: "#718096",
        fontSize: "17px",
    },

    refreshButton: {
        border: "none",
        background: "#ff5722",
        color: "#fff",
        padding: "13px 22px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "14px",
    },

    cards: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
    },

    statCard: {
        border: "1px solid #e8ebef",
        background: "#fff",
        borderRadius: "16px",
        padding: "25px",
        minHeight: "220px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.05)",
        transition:
            "transform 0.2s ease, box-shadow 0.2s ease",
    },

    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    cardIcon: {
        width: "52px",
        height: "52px",
        borderRadius: "13px",
        background: "#fff3ee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
    },

    arrow: {
        color: "#999",
        fontSize: "22px",
    },

    cardValue: {
        marginTop: "25px",
        fontSize: "34px",
        fontWeight: "800",
        color: "#172033",
    },

    cardTitle: {
        marginTop: "5px",
        fontSize: "17px",
        fontWeight: "700",
        color: "#333",
    },

    viewText: {
        marginTop: "13px",
        fontSize: "14px",
        color: "#ff5722",
        fontWeight: "700",
    },

    section: {
        marginTop: "35px",
        background: "#fff",
        borderRadius: "16px",
        padding: "25px",
        border: "1px solid #e8ebef",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.04)",
    },

    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    sectionTitle: {
        margin: 0,
        fontSize: "22px",
        color: "#172033",
    },

    sectionSubtitle: {
        margin: "6px 0 0",
        color: "#718096",
    },

    pendingBadge: {
        minWidth: "40px",
        height: "40px",
        padding: "0 10px",
        borderRadius: "50%",
        background: "#fff3cd",
        color: "#856404",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        boxSizing: "border-box",
    },

    quickGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "14px",
        marginTop: "20px",
    },

    quickButton: {
        border: "1px solid #eeeeee",
        background: "#fff",
        padding: "18px",
        borderRadius: "12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontWeight: "700",
        color: "#333",
        fontSize: "14px",
        textAlign: "left",
    },

    quickIcon: {
        fontSize: "23px",
    },

    quickArrow: {
        marginLeft: "auto",
        color: "#999",
        fontSize: "18px",
    },

    ownerList: {
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    ownerCard: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "15px",
        border: "1px solid #eeeeee",
        borderRadius: "12px",
    },

    ownerAvatar: {
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "#ff5722",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "19px",
        flexShrink: 0,
    },

    ownerInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        flex: 1,
    },

    ownerActions: {
        display: "flex",
        gap: "8px",
    },

    approveButton: {
        border: "none",
        background: "#198754",
        color: "#fff",
        padding: "9px 15px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "700",
    },

    rejectButton: {
        border: "none",
        background: "#dc3545",
        color: "#fff",
        padding: "9px 15px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "700",
    },

    emptyBox: {
        textAlign: "center",
        padding: "45px 20px",
        color: "#777",
    },

    emptyIcon: {
        fontSize: "40px",
        marginBottom: "10px",
    },

    errorBox: {
        maxWidth: "600px",
        margin: "70px auto",
        background: "#fff",
        border: "1px solid #ffd0d0",
        borderRadius: "16px",
        padding: "35px",
        textAlign: "center",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.05)",
    },

    errorIcon: {
        fontSize: "45px",
    },

    retryButton: {
        border: "none",
        background: "#ff5722",
        color: "#fff",
        padding: "11px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "700",
    },
};

export default Dashboard;