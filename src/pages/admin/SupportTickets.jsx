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

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [reply, setReply] = useState("");

    const [updateData, setUpdateData] = useState({
        status: "",
        priority: "",
        resolution: ""
    });

    // =========================================================
    // LOAD
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

            setTickets(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load tickets:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load support tickets."
            );

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

            const ticket = response.data;

            setSelectedTicket(ticket);

            setUpdateData({
                status: ticket.status || "",
                priority: ticket.priority || "",
                resolution:
                    ticket.resolution || ""
            });

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
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

        if (!selectedTicket || !reply.trim()) {
            return;
        }

        if (selectedTicket.status === "CLOSED") {

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

            console.error(err);

            setError(
                err.response?.data?.message ||
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
                    status:
                        updateData.status,
                    priority:
                        updateData.priority,
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

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to update ticket."
            );

        } finally {

            setUpdating(false);
        }
    };

    // =========================================================
    // HELPERS
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

    const formatDate = (value) => {

        if (!value) {
            return "";
        }

        return new Date(value)
            .toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            );
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="admin-support-page">

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

            {/* ALERTS */}

            {error && (
                <div className="admin-support-alert error">
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-support-alert success">
                    {success}
                </div>
            )}

            {/* STATUS FILTER */}

            <div className="admin-support-filters">

                {[
                    ["", "All"],
                    ["OPEN", "Open"],
                    ["IN_PROGRESS", "In Progress"],
                    ["RESOLVED", "Resolved"],
                    ["CLOSED", "Closed"]
                ].map(([value, label]) => (

                    <button
                        key={value}
                        className={
                            statusFilter === value
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setStatusFilter(value)
                        }
                    >
                        {label}
                    </button>

                ))}

            </div>

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
                            Loading tickets...
                        </div>

                    ) : tickets.length === 0 ? (

                        <div className="admin-support-empty">
                            No tickets found.
                        </div>

                    ) : (

                        <div className="admin-support-list">

                            {tickets.map((ticket) => (

                                <button
                                    key={ticket.id}
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
                                            {ticket.status?.replace(
                                                "_",
                                                " "
                                            )}
                                        </span>

                                    </div>

                                    <h3>
                                        {ticket.subject}
                                    </h3>

                                    <p>
                                        {
                                            ticket.userName
                                        }
                                        {" · "}
                                        {
                                            ticket.userRole
                                        }
                                    </p>

                                    <div className="admin-ticket-bottom">

                                        <span>
                                            {
                                                ticket.category
                                            }
                                        </span>

                                        <span
                                            className={getPriorityClass(
                                                ticket.priority
                                            )}
                                        >
                                            {
                                                ticket.priority
                                            }
                                        </span>

                                    </div>

                                </button>

                            ))}

                        </div>
                    )}

                </section>

                {/* =================================================
                    DETAIL
                ================================================= */}

                <section className="admin-support-panel admin-support-detail">

                    {ticketLoading ? (

                        <div className="admin-support-empty">
                            Loading ticket...
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

                            <div className="admin-detail-header">

                                <div>

                                    <span>
                                        TICKET #
                                        {
                                            selectedTicket.id
                                        }
                                    </span>

                                    <h2>
                                        {
                                            selectedTicket.subject
                                        }
                                    </h2>

                                </div>

                                <span
                                    className={`admin-support-badge ${getStatusClass(
                                        selectedTicket.status
                                    )}`}
                                >
                                    {selectedTicket.status?.replace(
                                        "_",
                                        " "
                                    )}
                                </span>

                            </div>

                            <div className="admin-customer-info">

                                <div>
                                    <span>
                                        USER
                                    </span>

                                    <strong>
                                        {
                                            selectedTicket.userName
                                        }
                                    </strong>

                                    <small>
                                        {
                                            selectedTicket.userRole
                                        }
                                    </small>

                                </div>

                                <div>
                                    <span>
                                        EMAIL
                                    </span>

                                    <strong>
                                        {
                                            selectedTicket.userEmail
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        CATEGORY
                                    </span>

                                    <strong>
                                        {
                                            selectedTicket.category
                                        }
                                    </strong>
                                </div>

                            </div>

                            <div className="admin-conversation">

                                {selectedTicket.messages?.map(
                                    (message) => {

                                        const isAdmin =
                                            message.senderRole ===
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
                                                                message.senderName
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                message.senderRole
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
                                )}

                            </div>

                            {selectedTicket.status !==
                                "CLOSED" && (

                                <form
                                    className="admin-reply-form"
                                    onSubmit={handleReply}
                                >

                                    <textarea
                                        rows="3"
                                        placeholder="Reply to customer or restaurant owner..."
                                        value={reply}
                                        onChange={(event) =>
                                            setReply(
                                                event.target
                                                    .value
                                            )
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
                                                    event.target
                                                        .value
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
                                                    event.target
                                                        .value
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
                                                    event.target
                                                        .value
                                            })
                                        }
                                    />

                                </div>

                                <button
                                    className="admin-update-btn"
                                    onClick={
                                        handleUpdate
                                    }
                                    disabled={updating}
                                >
                                    {updating
                                        ? "Saving..."
                                        : "Save Ticket Update"
                                    }
                                </button>

                            </div>

                        </>

                    )}

                </section>

            </div>

        </div>
    );
}

export default SupportTickets;