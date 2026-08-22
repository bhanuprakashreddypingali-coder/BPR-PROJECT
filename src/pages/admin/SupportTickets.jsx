import React, { useEffect, useState } from "react";
import { supportApi } from "../../services/ApiService";
import "./SupportTickets.css";

function SupportTickets() {

    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const [statusFilter, setStatusFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [ticketLoading, setTicketLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [reply, setReply] = useState("");

    const [updateData, setUpdateData] = useState({
        status: "",
        priority: "",
        resolution: ""
    });

    // =========================================================
    // LOAD TICKETS
    // =========================================================

    useEffect(() => {
        loadTickets();
    }, [statusFilter]);

    const loadTickets = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await supportApi.getAllTickets(
                    statusFilter
                );

            const data = response?.data;

            setTickets(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load support tickets:",
                err
            );

            if (err.response?.status === 401) {

                setError(
                    "Your admin session has expired. Please login again."
                );

            } else if (err.response?.status === 403) {

                setError(
                    "Access denied. Admin permission is required."
                );

            } else if (err.response?.status === 404) {

                setError(
                    "Support API endpoint was not found. Check the backend deployment."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Unable to load support tickets."
                );
            }

            setTickets([]);

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // OPEN TICKET
    // =========================================================

    const openTicket = async (ticketId) => {

        try {

            setTicketLoading(true);
            setError("");
            setSuccess("");

            const response =
                await supportApi.getAdminTicket(
                    ticketId
                );

            const ticket = response?.data;

            if (!ticket) {

                throw new Error(
                    "Ticket data was not returned."
                );
            }

            setSelectedTicket(ticket);

            setUpdateData({
                status: ticket.status || "OPEN",
                priority: ticket.priority || "MEDIUM",
                resolution: ticket.resolution || ""
            });

            setReply("");

        } catch (err) {

            console.error(
                "Failed to load ticket:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load ticket."
            );

        } finally {

            setTicketLoading(false);
        }
    };

    // =========================================================
    // ADMIN REPLY
    // =========================================================

    const handleReply = async (event) => {

        event.preventDefault();

        if (!selectedTicket) {
            return;
        }

        if (!reply.trim()) {
            setError("Please enter a reply.");
            return;
        }

        if (
            selectedTicket.status?.toUpperCase() ===
            "CLOSED"
        ) {

            setError(
                "This ticket is already closed."
            );

            return;
        }

        try {

            setSending(true);
            setError("");
            setSuccess("");

            await supportApi.addAdminMessage(
                selectedTicket.id,
                {
                    message: reply.trim()
                }
            );

            setReply("");

            setSuccess(
                "Reply sent successfully."
            );

            await openTicket(
                selectedTicket.id
            );

            await loadTickets();

        } catch (err) {

            console.error(
                "Failed to send admin reply:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to send reply."
            );

        } finally {

            setSending(false);
        }
    };

    // =========================================================
    // UPDATE TICKET
    // =========================================================

    const handleUpdate = async () => {

        if (!selectedTicket) {
            return;
        }

        try {

            setUpdating(true);
            setError("");
            setSuccess("");

            await supportApi.updateTicket(
                selectedTicket.id,
                {
                    status: updateData.status,
                    priority: updateData.priority,
                    resolution:
                        updateData.resolution
                }
            );

            setSuccess(
                "Ticket updated successfully."
            );

            await openTicket(
                selectedTicket.id
            );

            await loadTickets();

        } catch (err) {

            console.error(
                "Failed to update ticket:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to update ticket."
            );

        } finally {

            setUpdating(false);
        }
    };

    // =========================================================
    // CLOSE TICKET
    // =========================================================

    const handleClose = async () => {

        if (!selectedTicket) {
            return;
        }

        try {

            setUpdating(true);
            setError("");
            setSuccess("");

            await supportApi.closeTicket(
                selectedTicket.id
            );

            setSuccess(
                "Ticket closed successfully."
            );

            await openTicket(
                selectedTicket.id
            );

            await loadTickets();

        } catch (err) {

            console.error(
                "Failed to close ticket:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to close ticket."
            );

        } finally {

            setUpdating(false);
        }
    };

    // =========================================================
    // REOPEN TICKET
    // =========================================================

    const handleReopen = async () => {

        if (!selectedTicket) {
            return;
        }

        try {

            setUpdating(true);
            setError("");
            setSuccess("");

            await supportApi.reopenTicket(
                selectedTicket.id
            );

            setSuccess(
                "Ticket reopened successfully."
            );

            await openTicket(
                selectedTicket.id
            );

            await loadTickets();

        } catch (err) {

            console.error(
                "Failed to reopen ticket:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to reopen ticket."
            );

        } finally {

            setUpdating(false);
        }
    };

    // =========================================================
    // DELETE TICKET
    // =========================================================

    const handleDelete = async () => {

        if (!selectedTicket) {
            return;
        }

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ticket #${selectedTicket.id}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeleting(true);
            setError("");
            setSuccess("");

            await supportApi.deleteTicket(
                selectedTicket.id
            );

            setSelectedTicket(null);

            setUpdateData({
                status: "",
                priority: "",
                resolution: ""
            });

            setReply("");

            setSuccess(
                "Support ticket deleted successfully."
            );

            await loadTickets();

        } catch (err) {

            console.error(
                "Failed to delete ticket:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to delete ticket."
            );

        } finally {

            setDeleting(false);
        }
    };

    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {

        switch (
            status?.toUpperCase()
        ) {

            case "OPEN":
                return "admin-support-open";

            case "IN_PROGRESS":
                return "admin-support-progress";

            case "RESOLVED":
                return "admin-support-resolved";

            case "CLOSED":
                return "admin-support-closed";

            default:
                return "";
        }
    };

    // =========================================================
    // PRIORITY CLASS
    // =========================================================

    const getPriorityClass = (priority) => {

        switch (
            priority?.toUpperCase()
        ) {

            case "LOW":
                return "admin-priority-low";

            case "MEDIUM":
                return "admin-priority-medium";

            case "HIGH":
                return "admin-priority-high";

            case "URGENT":
                return "admin-priority-urgent";

            default:
                return "";
        }
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (value) => {

        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };

    // =========================================================
    // CLEAR SELECTED TICKET
    // =========================================================

    const clearSelectedTicket = () => {

        setSelectedTicket(null);

        setReply("");

        setUpdateData({
            status: "",
            priority: "",
            resolution: ""
        });

        setError("");
        setSuccess("");
    };

    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="admin-support-page">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="admin-support-header">

                <div>

                    <span>
                        BPR FLAVORS HUB
                    </span>

                    <h1>
                        Support Center
                    </h1>

                    <p>
                        Manage customer and restaurant
                        owner problems from one place.
                    </p>

                </div>

                <div className="admin-support-icon">
                    🛟
                </div>

            </div>

            {/* =====================================================
                ALERTS
            ===================================================== */}

            {error && (

                <div className="admin-support-alert error">

                    <span>
                        ⚠️
                    </span>

                    <span>
                        {error}
                    </span>

                </div>

            )}

            {success && (

                <div className="admin-support-alert success">

                    <span>
                        ✅
                    </span>

                    <span>
                        {success}
                    </span>

                </div>

            )}

            {/* =====================================================
                FILTERS
            ===================================================== */}

            <div className="admin-support-filters">

                {[
                    ["", "All"],
                    ["OPEN", "Open"],
                    ["IN_PROGRESS", "In Progress"],
                    ["RESOLVED", "Resolved"],
                    ["CLOSED", "Closed"]
                ].map(
                    ([value, label]) => (

                        <button
                            key={value}
                            type="button"
                            className={
                                statusFilter === value
                                    ? "active"
                                    : ""
                            }
                            onClick={() => {

                                setStatusFilter(value);

                                setSelectedTicket(null);

                                setError("");
                                setSuccess("");

                            }}
                        >
                            {label}
                        </button>

                    )
                )}

            </div>

            {/* =====================================================
                MAIN LAYOUT
            ===================================================== */}

            <div className="admin-support-layout">

                {/* =================================================
                    TICKET LIST
                ================================================= */}

                <section className="admin-support-panel">

                    <div className="admin-support-panel-header">

                        <div>

                            <span>
                                SUPPORT REQUESTS
                            </span>

                            <h2>
                                Tickets
                            </h2>

                        </div>

                        <strong>
                            {tickets.length}
                        </strong>

                    </div>

                    {loading ? (

                        <div className="admin-support-empty">

                            <div>
                                ⏳
                            </div>

                            <p>
                                Loading tickets...
                            </p>

                        </div>

                    ) : tickets.length === 0 ? (

                        <div className="admin-support-empty">

                            <div>
                                🎫
                            </div>

                            <h3>
                                No tickets found
                            </h3>

                            <p>
                                There are no support tickets
                                for this filter.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-support-list">

                            {tickets.map(
                                (ticket) => (

                                    <button
                                        key={ticket.id}
                                        type="button"
                                        className={`admin-support-ticket ${
                                            selectedTicket?.id ===
                                            ticket.id
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            openTicket(
                                                ticket.id
                                            )
                                        }
                                    >

                                        <div className="admin-ticket-top">

                                            <strong>
                                                #{ticket.id}
                                            </strong>

                                            <span
                                                className={`admin-support-badge ${getStatusClass(
                                                    ticket.status
                                                )}`}
                                            >
                                                {ticket.status
                                                    ?.replace(
                                                        /_/g,
                                                        " "
                                                    )}
                                            </span>

                                        </div>

                                        <h3>
                                            {
                                                ticket.subject ||
                                                "No subject"
                                            }
                                        </h3>

                                        <p>

                                            {
                                                ticket.userName ||
                                                "Unknown user"
                                            }

                                            {" · "}

                                            {
                                                ticket.userRole ||
                                                "USER"
                                            }

                                        </p>

                                        <div className="admin-ticket-bottom">

                                            <span>
                                                {
                                                    ticket.category ||
                                                    "GENERAL"
                                                }
                                            </span>

                                            <span
                                                className={getPriorityClass(
                                                    ticket.priority
                                                )}
                                            >
                                                {
                                                    ticket.priority ||
                                                    "MEDIUM"
                                                }
                                            </span>

                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </section>

                {/* =================================================
                    TICKET DETAIL
                ================================================= */}

                <section className="admin-support-panel admin-support-detail">

                    {ticketLoading ? (

                        <div className="admin-support-empty">

                            <div>
                                ⏳
                            </div>

                            <p>
                                Loading ticket...
                            </p>

                        </div>

                    ) : !selectedTicket ? (

                        <div className="admin-support-empty">

                            <div>
                                💬
                            </div>

                            <h3>
                                Select a ticket
                            </h3>

                            <p>
                                Choose a ticket to manage
                                the conversation and resolution.
                            </p>

                        </div>

                    ) : (

                        <>

                            {/* =================================================
                                DETAIL HEADER
                            ================================================= */}

                            <div className="admin-detail-header">

                                <div>

                                    <span>
                                        TICKET #
                                        {selectedTicket.id}
                                    </span>

                                    <h2>
                                        {
                                            selectedTicket.subject ||
                                            "Support Ticket"
                                        }
                                    </h2>

                                </div>

                                <div className="admin-detail-header-actions">

                                    <span
                                        className={`admin-support-badge ${getStatusClass(
                                            selectedTicket.status
                                        )}`}
                                    >
                                        {
                                            selectedTicket.status
                                                ?.replace(
                                                    /_/g,
                                                    " "
                                                )
                                        }
                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            clearSelectedTicket
                                        }
                                    >
                                        ✕
                                    </button>

                                </div>

                            </div>

                            {/* =================================================
                                CUSTOMER INFO
                            ================================================= */}

                            <div className="admin-customer-info">

                                <div>

                                    <span>
                                        USER
                                    </span>

                                    <strong>
                                        {
                                            selectedTicket.userName ||
                                            "Unknown"
                                        }
                                    </strong>

                                    <small>
                                        {
                                            selectedTicket.userRole ||
                                            "USER"
                                        }
                                    </small>

                                </div>

                                <div>

                                    <span>
                                        EMAIL
                                    </span>

                                    <strong>
                                        {
                                            selectedTicket.userEmail ||
                                            "Not provided"
                                        }
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        CATEGORY
                                    </span>

                                    <strong>
                                        {
                                            selectedTicket.category ||
                                            "GENERAL"
                                        }
                                    </strong>

                                </div>

                            </div>

                            {/* =================================================
                                TICKET DESCRIPTION
                            ================================================= */}

                            <div className="admin-ticket-description">

                                <span>
                                    ORIGINAL REQUEST
                                </span>

                                <p>
                                    {
                                        selectedTicket.description ||
                                        "No description provided."
                                    }
                                </p>

                            </div>

                            {/* =================================================
                                CONVERSATION
                            ================================================= */}

                            <div className="admin-conversation">

                                {selectedTicket.messages &&
                                selectedTicket.messages.length > 0 ? (

                                    selectedTicket.messages.map(
                                        (message) => {

                                            const isAdmin =
                                                message.senderRole
                                                    ?.toUpperCase() ===
                                                "ADMIN";

                                            return (

                                                <div
                                                    key={
                                                        message.id
                                                    }
                                                    className={`admin-message ${
                                                        isAdmin
                                                            ? "admin"
                                                            : "user"
                                                    }`}
                                                >

                                                    <div className="admin-message-box">

                                                        <div className="admin-message-name">

                                                            <strong>
                                                                {
                                                                    message.senderName ||
                                                                    "User"
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    message.senderRole ||
                                                                    "USER"
                                                                }
                                                            </span>

                                                        </div>

                                                        <p>
                                                            {
                                                                message.message
                                                            }
                                                        </p>

                                                        <small>
                                                            {formatDate(
                                                                message.createdAt
                                                            )}
                                                        </small>

                                                    </div>

                                                </div>

                                            );
                                        }
                                    )

                                ) : (

                                    <div className="admin-support-empty">

                                        <div>
                                            💬
                                        </div>

                                        <p>
                                            No messages yet.
                                        </p>

                                    </div>

                                )}

                            </div>

                            {/* =================================================
                                ADMIN REPLY
                            ================================================= */}

                            {selectedTicket.status?.toUpperCase() !==
                                "CLOSED" && (

                                <form
                                    className="admin-reply-form"
                                    onSubmit={
                                        handleReply
                                    }
                                >

                                    <textarea
                                        rows="3"
                                        placeholder="Reply to customer or restaurant owner..."
                                        value={reply}
                                        onChange={(event) =>
                                            setReply(
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            sending
                                        }
                                    />

                                    <button
                                        type="submit"
                                        disabled={
                                            sending ||
                                            !reply.trim()
                                        }
                                    >

                                        {sending
                                            ? "Sending..."
                                            : "Send Reply"
                                        }

                                    </button>

                                </form>

                            )}

                            {/* =================================================
                                ADMIN ACTIONS
                            ================================================= */}

                            <div className="admin-ticket-actions">

                                <div>

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        value={
                                            updateData.status
                                        }
                                        onChange={(event) =>
                                            setUpdateData({
                                                ...updateData,
                                                status:
                                                    event.target.value
                                            })
                                        }
                                    >

                                        <option value="OPEN">
                                            OPEN
                                        </option>

                                        <option value="IN_PROGRESS">
                                            IN PROGRESS
                                        </option>

                                        <option value="RESOLVED">
                                            RESOLVED
                                        </option>

                                        <option value="CLOSED">
                                            CLOSED
                                        </option>

                                    </select>

                                </div>

                                <div>

                                    <label>
                                        Priority
                                    </label>

                                    <select
                                        value={
                                            updateData.priority
                                        }
                                        onChange={(event) =>
                                            setUpdateData({
                                                ...updateData,
                                                priority:
                                                    event.target.value
                                            })
                                        }
                                    >

                                        <option value="LOW">
                                            LOW
                                        </option>

                                        <option value="MEDIUM">
                                            MEDIUM
                                        </option>

                                        <option value="HIGH">
                                            HIGH
                                        </option>

                                        <option value="URGENT">
                                            URGENT
                                        </option>

                                    </select>

                                </div>

                                <div className="admin-resolution-field">

                                    <label>
                                        Resolution
                                    </label>

                                    <textarea
                                        rows="3"
                                        placeholder="Enter the resolution..."
                                        value={
                                            updateData.resolution
                                        }
                                        onChange={(event) =>
                                            setUpdateData({
                                                ...updateData,
                                                resolution:
                                                    event.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="admin-ticket-action-buttons">

                                    <button
                                        type="button"
                                        className="admin-update-btn"
                                        onClick={
                                            handleUpdate
                                        }
                                        disabled={
                                            updating
                                        }
                                    >

                                        {updating
                                            ? "Saving..."
                                            : "Save Ticket Update"
                                        }

                                    </button>

                                    {selectedTicket.status?.toUpperCase() !==
                                        "CLOSED" ? (

                                        <button
                                            type="button"
                                            className="admin-close-btn"
                                            onClick={
                                                handleClose
                                            }
                                            disabled={
                                                updating
                                            }
                                        >
                                            Close Ticket
                                        </button>

                                    ) : (

                                        <button
                                            type="button"
                                            className="admin-reopen-btn"
                                            onClick={
                                                handleReopen
                                            }
                                            disabled={
                                                updating
                                            }
                                        >
                                            Reopen Ticket
                                        </button>

                                    )}

                                    <button
                                        type="button"
                                        className="admin-delete-btn"
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={
                                            deleting
                                        }
                                    >

                                        {deleting
                                            ? "Deleting..."
                                            : "Delete Ticket"
                                        }

                                    </button>

                                </div>

                            </div>

                        </>

                    )}

                </section>

            </div>

        </div>
    );
}

export default SupportTickets;