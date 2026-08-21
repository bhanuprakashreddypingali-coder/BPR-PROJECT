import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD USERS
    // =====================================================

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            const data = response.data;

            if (Array.isArray(data)) {
                setUsers(data);
            } else if (Array.isArray(data?.content)) {
                setUsers(data.content);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error("Failed to load users:", err);

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : "Failed to load users.")
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadUsers();
    }, []);

    // =====================================================
    // APPROVE RESTAURANT OWNER
    // =====================================================

    const approveOwner = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            await api.put(`/admin/owners/${id}/approve`);

            alert("Restaurant owner approved successfully.");

            await loadUsers();
        } catch (err) {
            console.error("Approval failed:", err);

            alert(
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : "Failed to approve restaurant owner.")
            );
        } finally {
            setActionLoading(null);
        }
    };

    // =====================================================
    // REJECT RESTAURANT OWNER
    // =====================================================

    const rejectOwner = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to reject this restaurant owner?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(id);
            setError("");

            await api.put(`/admin/owners/${id}/reject`);

            alert("Restaurant owner rejected successfully.");

            await loadUsers();
        } catch (err) {
            console.error("Rejection failed:", err);

            alert(
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : "Failed to reject restaurant owner.")
            );
        } finally {
            setActionLoading(null);
        }
    };

    // =====================================================
    // DELETE USER
    // =====================================================

    const deleteUser = async (id, user) => {
        const role = getNormalizedRole(user.role);

        let message =
            "Are you sure you want to delete this user?\n\n" +
            "This action cannot be undone.";

        if (role === "RESTAURANT_OWNER") {
            message =
                "Are you sure you want to delete this restaurant owner?\n\n" +
                "The owner will be permanently removed from the system.\n\n" +
                "This action cannot be undone.";
        }

        const confirmed = window.confirm(message);

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(id);
            setError("");

            await api.delete(`/admin/users/${id}`);

            alert(
                role === "RESTAURANT_OWNER"
                    ? "Restaurant owner deleted successfully."
                    : "User deleted successfully."
            );

            await loadUsers();
        } catch (err) {
            console.error("Delete failed:", err);

            alert(
                err.response?.data?.message ||
                err.response?.data?.error ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : "Failed to delete user.")
            );
        } finally {
            setActionLoading(null);
        }
    };

    // =====================================================
    // ROLE HELPERS
    // =====================================================

    const getNormalizedRole = (role) => {
        if (!role) {
            return "";
        }

        return role
            .toString()
            .replace("ROLE_", "")
            .toUpperCase();
    };

    const getRoleLabel = (role) => {
        const normalizedRole = getNormalizedRole(role);

        if (!normalizedRole) {
            return "UNKNOWN";
        }

        return normalizedRole
            .replaceAll("_", " ");
    };

    const isRestaurantOwner = (user) => {
        return (
            getNormalizedRole(user?.role) ===
            "RESTAURANT_OWNER"
        );
    };

    const isAdmin = (user) => {
        return (
            getNormalizedRole(user?.role) ===
            "ADMIN"
        );
    };

    const isApproved = (user) => {
        return user?.approved === true;
    };

    // =====================================================
    // ROLE STYLE
    // =====================================================

    const getRoleStyle = (role) => {
        const normalizedRole = getNormalizedRole(role);

        if (normalizedRole === "ADMIN") {
            return {
                ...styles.role,
                background: "#673ab7",
            };
        }

        if (normalizedRole === "RESTAURANT_OWNER") {
            return {
                ...styles.role,
                background: "#ff9800",
            };
        }

        return {
            ...styles.role,
            background: "#2196f3",
        };
    };

    // =====================================================
    // SUMMARY
    // =====================================================

    const totalUsers = users.length;

    const restaurantOwners = users.filter(
        (user) => isRestaurantOwner(user)
    ).length;

    const pendingOwners = users.filter(
        (user) =>
            isRestaurantOwner(user) &&
            !isApproved(user)
    ).length;

    const approvedOwners = users.filter(
        (user) =>
            isRestaurantOwner(user) &&
            isApproved(user)
    ).length;

    const customers = users.filter(
        (user) =>
            getNormalizedRole(user?.role) ===
            "CUSTOMER"
    ).length;

    const admins = users.filter(
        (user) => isAdmin(user)
    ).length;

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingCard}>

                    <div style={styles.spinner}></div>

                    <h2 style={styles.loadingTitle}>
                        Loading Users
                    </h2>

                    <p style={styles.loadingText}>
                        Please wait while we fetch the users...
                    </p>

                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div style={styles.container}>

            {/* =================================================
                HEADER
            ================================================= */}

            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        User Management
                    </h1>

                    <p style={styles.subtitle}>
                        View users and manage restaurant owner approvals.
                    </p>
                </div>

                <button
                    style={styles.refreshButton}
                    onClick={loadUsers}
                    disabled={loading}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div style={styles.error}>

                    <span style={styles.errorIcon}>
                        ⚠
                    </span>

                    <span>
                        {error}
                    </span>

                    <button
                        style={styles.closeError}
                        onClick={() => setError("")}
                    >
                        ✕
                    </button>

                </div>
            )}

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div style={styles.summary}>

                {/* TOTAL USERS */}

                <div style={styles.summaryCard}>

                    <div style={styles.summaryIcon}>
                        👥
                    </div>

                    <div>

                        <div style={styles.summaryNumber}>
                            {totalUsers}
                        </div>

                        <div style={styles.summaryLabel}>
                            Total Users
                        </div>

                    </div>

                </div>

                {/* RESTAURANT OWNERS */}

                <div style={styles.summaryCard}>

                    <div style={styles.summaryIcon}>
                        🍽️
                    </div>

                    <div>

                        <div style={styles.summaryNumber}>
                            {restaurantOwners}
                        </div>

                        <div style={styles.summaryLabel}>
                            Restaurant Owners
                        </div>

                    </div>

                </div>

                {/* PENDING */}

                <div style={styles.summaryCard}>

                    <div style={styles.summaryIcon}>
                        ⏳
                    </div>

                    <div>

                        <div style={styles.summaryNumber}>
                            {pendingOwners}
                        </div>

                        <div style={styles.summaryLabel}>
                            Pending Owners
                        </div>

                    </div>

                </div>

                {/* APPROVED */}

                <div style={styles.summaryCard}>

                    <div style={styles.summaryIcon}>
                        ✓
                    </div>

                    <div>

                        <div style={styles.summaryNumber}>
                            {approvedOwners}
                        </div>

                        <div style={styles.summaryLabel}>
                            Approved Owners
                        </div>

                    </div>

                </div>

                {/* CUSTOMERS */}

                <div style={styles.summaryCard}>

                    <div style={styles.summaryIcon}>
                        🛒
                    </div>

                    <div>

                        <div style={styles.summaryNumber}>
                            {customers}
                        </div>

                        <div style={styles.summaryLabel}>
                            Customers
                        </div>

                    </div>

                </div>

                {/* ADMINS */}

                <div style={styles.summaryCard}>

                    <div style={styles.summaryIcon}>
                        🛡️
                    </div>

                    <div>

                        <div style={styles.summaryNumber}>
                            {admins}
                        </div>

                        <div style={styles.summaryLabel}>
                            Admins
                        </div>

                    </div>

                </div>

            </div>

            {/* =================================================
                USERS TABLE
            ================================================= */}

            <div style={styles.tableCard}>

                <div style={styles.tableHeader}>

                    <div>

                        <h2 style={styles.tableTitle}>
                            All Users
                        </h2>

                        <p style={styles.tableSubtitle}>
                            {users.length} user
                            {users.length !== 1 ? "s" : ""} registered
                        </p>

                    </div>

                </div>

                {/* NO USERS */}

                {users.length === 0 ? (

                    <div style={styles.empty}>

                        <div style={styles.emptyIcon}>
                            👤
                        </div>

                        <h3 style={styles.emptyTitle}>
                            No Users Found
                        </h3>

                        <p style={styles.emptyText}>
                            There are currently no registered users.
                        </p>

                    </div>

                ) : (

                    <div style={styles.tableWrapper}>

                        <table style={styles.table}>

                            <thead>

                                <tr>

                                    <th style={styles.th}>
                                        ID
                                    </th>

                                    <th style={styles.th}>
                                        Name
                                    </th>

                                    <th style={styles.th}>
                                        Email
                                    </th>

                                    <th style={styles.th}>
                                        Phone
                                    </th>

                                    <th style={styles.th}>
                                        Role
                                    </th>

                                    <th style={styles.th}>
                                        Approval
                                    </th>

                                    <th style={styles.th}>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {users.map((user) => {

                                    const owner =
                                        isRestaurantOwner(user);

                                    const admin =
                                        isAdmin(user);

                                    const approved =
                                        isApproved(user);

                                    const processing =
                                        actionLoading === user.id;

                                    return (

                                        <tr
                                            key={user.id}
                                            style={styles.tr}
                                        >

                                            {/* ID */}

                                            <td style={styles.td}>

                                                <span style={styles.id}>
                                                    #{user.id}
                                                </span>

                                            </td>

                                            {/* NAME */}

                                            <td style={styles.td}>

                                                <div style={styles.userName}>
                                                    {user.fullName || "-"}
                                                </div>

                                            </td>

                                            {/* EMAIL */}

                                            <td style={styles.td}>

                                                <span style={styles.email}>
                                                    {user.email || "-"}
                                                </span>

                                            </td>

                                            {/* PHONE */}

                                            <td style={styles.td}>

                                                <span style={styles.phone}>
                                                    {user.phone || "-"}
                                                </span>

                                            </td>

                                            {/* ROLE */}

                                            <td style={styles.td}>

                                                <span
                                                    style={getRoleStyle(
                                                        user.role
                                                    )}
                                                >
                                                    {getRoleLabel(
                                                        user.role
                                                    )}
                                                </span>

                                            </td>

                                            {/* APPROVAL */}

                                            <td style={styles.td}>

                                                {!owner ? (

                                                    <span
                                                        style={
                                                            styles.notApplicable
                                                        }
                                                    >
                                                        N/A
                                                    </span>

                                                ) : approved ? (

                                                    <span
                                                        style={
                                                            styles.approved
                                                        }
                                                    >
                                                        ✓ Approved
                                                    </span>

                                                ) : (

                                                    <span
                                                        style={
                                                            styles.pending
                                                        }
                                                    >
                                                        ⏳ Pending
                                                    </span>

                                                )}

                                            </td>

                                            {/* ACTION */}

                                            <td style={styles.td}>

                                                {admin ? (

                                                    // ADMIN
                                                    <span
                                                        style={
                                                            styles.adminText
                                                        }
                                                    >
                                                        🛡️ Administrator
                                                    </span>

                                                ) : (

                                                    <div style={styles.actions}>

                                                        {/* APPROVE */}

                                                        {owner &&
                                                            !approved && (
                                                                <button
                                                                    style={
                                                                        styles.approveButton
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    onClick={() =>
                                                                        approveOwner(
                                                                            user.id
                                                                        )
                                                                    }
                                                                >
                                                                    {processing
                                                                        ? "Processing..."
                                                                        : "✓ Approve"}
                                                                </button>
                                                            )}

                                                        {/* REJECT */}

                                                        {owner &&
                                                            !approved && (
                                                                <button
                                                                    style={
                                                                        styles.rejectButton
                                                                    }
                                                                    disabled={
                                                                        processing
                                                                    }
                                                                    onClick={() =>
                                                                        rejectOwner(
                                                                            user.id
                                                                        )
                                                                    }
                                                                >
                                                                    {processing
                                                                        ? "Please wait..."
                                                                        : "✕ Reject"}
                                                                </button>
                                                            )}

                                                        {/* APPROVED OWNER */}

                                                        {owner &&
                                                            approved && (
                                                                <span
                                                                    style={
                                                                        styles.alreadyApproved
                                                                    }
                                                                >
                                                                    ✓ Approved
                                                                </span>
                                                            )}

                                                        {/* DELETE */}

                                                        <button
                                                            style={
                                                                styles.deleteButton
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user.id,
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            {processing
                                                                ? "Deleting..."
                                                                : "🗑 Delete"}
                                                        </button>

                                                    </div>

                                                )}

                                            </td>

                                        </tr>

                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
};

// =====================================================
// STYLES
// =====================================================

const styles = {

    container: {
        padding: "35px",
        background: "#f5f7fb",
        minHeight: "calc(100vh - 65px)",
        boxSizing: "border-box",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        gap: "20px",
    },

    title: {
        fontSize: "36px",
        margin: 0,
        color: "#202124",
        fontWeight: "700",
    },

    subtitle: {
        marginTop: "8px",
        marginBottom: 0,
        color: "#6b7280",
        fontSize: "16px",
    },

    refreshButton: {
        border: "none",
        background: "#ff5722",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer",
        minWidth: "110px",
    },

    error: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#ffe5e5",
        color: "#c62828",
        padding: "14px 16px",
        borderRadius: "8px",
        marginBottom: "20px",
        border: "1px solid #ffcaca",
    },

    errorIcon: {
        fontSize: "18px",
    },

    closeError: {
        marginLeft: "auto",
        border: "none",
        background: "transparent",
        color: "#c62828",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "700",
    },

    loadingCard: {
        background: "#fff",
        padding: "60px 30px",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
    },

    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #eee",
        borderTop: "4px solid #ff5722",
        borderRadius: "50%",
        margin: "0 auto 20px",
        animation: "spin 1s linear infinite",
    },

    loadingTitle: {
        margin: "0 0 8px",
        color: "#202124",
    },

    loadingText: {
        margin: 0,
        color: "#777",
    },

    summary: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "18px",
        marginBottom: "25px",
    },

    summaryCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.07)",
        color: "#555",
    },

    summaryIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        background: "#fff1eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        flexShrink: 0,
    },

    summaryNumber: {
        fontSize: "27px",
        fontWeight: "700",
        color: "#ff5722",
        lineHeight: "1",
        marginBottom: "6px",
    },

    summaryLabel: {
        color: "#666",
        fontSize: "14px",
        fontWeight: "500",
    },

    tableCard: {
        background: "#fff",
        borderRadius: "12px",
        padding: "25px",
        boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
    },

    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },

    tableTitle: {
        margin: 0,
        fontSize: "24px",
        color: "#202124",
    },

    tableSubtitle: {
        margin: "5px 0 0",
        color: "#777",
        fontSize: "14px",
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "1100px",
    },

    th: {
        background: "#f3f4f6",
        padding: "14px",
        textAlign: "left",
        borderBottom: "2px solid #ddd",
        whiteSpace: "nowrap",
        color: "#444",
        fontSize: "14px",
        fontWeight: "700",
    },

    td: {
        padding: "14px",
        borderBottom: "1px solid #eee",
        verticalAlign: "middle",
        color: "#333",
        fontSize: "14px",
    },

    tr: {
        transition: "background 0.2s ease",
    },

    id: {
        fontWeight: "600",
        color: "#777",
    },

    userName: {
        fontWeight: "600",
        color: "#202124",
        whiteSpace: "nowrap",
    },

    email: {
        color: "#555",
    },

    phone: {
        color: "#555",
        whiteSpace: "nowrap",
    },

    role: {
        display: "inline-block",
        color: "#fff",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },

    approved: {
        display: "inline-block",
        color: "#198754",
        background: "#e8f5e9",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },

    pending: {
        display: "inline-block",
        color: "#f57c00",
        background: "#fff3e0",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },

    notApplicable: {
        color: "#999",
        fontSize: "13px",
    },

    actions: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
    },

    approveButton: {
        border: "none",
        background: "#198754",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "12px",
    },

    rejectButton: {
        border: "none",
        background: "#dc3545",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "12px",
    },

    deleteButton: {
        border: "none",
        background: "#b71c1c",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "12px",
    },

    alreadyApproved: {
        color: "#198754",
        fontWeight: "600",
        fontSize: "13px",
        whiteSpace: "nowrap",
    },

    adminText: {
        color: "#673ab7",
        fontSize: "13px",
        fontWeight: "600",
        whiteSpace: "nowrap",
    },

    empty: {
        textAlign: "center",
        padding: "60px 30px",
        color: "#777",
    },

    emptyIcon: {
        fontSize: "45px",
        marginBottom: "10px",
    },

    emptyTitle: {
        margin: "0 0 8px",
        color: "#333",
    },

    emptyText: {
        margin: 0,
        color: "#888",
    },
};

export default Users;