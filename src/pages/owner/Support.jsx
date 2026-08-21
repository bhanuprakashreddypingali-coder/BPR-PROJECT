import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supportApi } from "../../services/ApiService";
import "./Support.css";

function Support() {

    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const [loading, setLoading] = useState(true);
    const [ticketLoading, setTicketLoading] = useState(false);

    const [creating, setCreating] = useState(false);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [newTicket, setNewTicket] = useState({
        subject: "",
        description: "",
        category: "ORDER",
        priority: "MEDIUM"
    });

    const [reply, setReply] = useState("");

    // =========================================================
    // GET ROLE
    // =========================================================

    const savedRole =
        localStorage.getItem("role") || "CUSTOMER";

    const role = savedRole
        .replace("ROLE_", "")
        .toUpperCase();

    const isOwner = role === "RESTAURANT_OWNER";

    // =========================================================
    // LOAD TICKETS
    // =========================================================

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await supportApi.getMyTickets();

            const data = response.data;

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

            setError(
                err.response?.data?.message ||
                "Unable to load your support tickets."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // LOAD SINGLE TICKET
    // =========================================================

    const openTicket = async (ticketId) => {

        try {

            setTicketLoading(true);
            setError("");
            setSuccess("");

            const response =
                await supportApi.getMyTicket(ticketId);

            setSelectedTicket(response.data);

        } catch (err) {

            console.error(
                "Failed to load ticket:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load this ticket."
            );

        } finally {

            setTicketLoading(false);
        }
    };

    // =========================================================
    // CREATE TICKET
    // =========================================================

    const handleCreateTicket = async (event) => {

        event.preventDefault();

        if (!newTicket.subject.trim()) {
            setError("Please enter a subject.");
            return;
        }

        if (!newTicket.description.trim()) {
            setError("Please describe your problem.");
            return;
        }

        try {

            setCreating(true);
            setError("");
            setSuccess("");

            const response =
                await supportApi.createTicket({
                    subject:
                        newTicket.subject.trim(),

                    description:
                        newTicket.description.trim(),

                    category:
                        newTicket.category,

                    priority:
                        newTicket.priority
                });

            setSuccess(
                "Support ticket created successfully."
            );

            setNewTicket({
                subject: "",
                description: "",
                category: "ORDER",
                priority: "MEDIUM"
            });

            setShowCreateForm(false);

            await loadTickets();

            if (response.data?.id) {
                setSelectedTicket(
                    response.data
                );
            }

        } catch (err) {

            console.error(
                "Failed to create ticket:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to create your support ticket."
            );

        } finally {

            setCreating(false);
        }
    };

    // =========================================================
    // REPLY
    // =========================================================

    const handleReply = async (event) => {

        event.preventDefault();

        if (!selectedTicket) {
            return;
        }

        if (!reply.trim()) {
            return;
        }

        if (
            selectedTicket.status === "CLOSED"
        ) {
            setError(
                "This ticket is closed and cannot receive replies."
            );
            return;
        }

        try {

            setSending(true);
            setError("");
            setSuccess("");

            await supportApi.addUserMessage(
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
                "Failed to send reply:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to send your reply."
            );

        } finally {

            setSending(false);
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
                return "status-open";

            case "IN_PROGRESS":
                return "status-progress";

            case "RESOLVED":
                return "status-resolved";

            case "CLOSED":
                return "status-closed";

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
                return "priority-low";

            case "MEDIUM":
                return "priority-medium";

            case "HIGH":
                return "priority-high";

            case "URGENT":
                return "priority-urgent";

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

        try {

            return new Date(value)
                .toLocaleString(
                    "en-IN",
                    {
                        dateStyle: "medium",
                        timeStyle: "short"
                    }
                );

        } catch {
            return value;
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="support-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="support-hero">

                <div className="support-hero-icon">
                    🛟
                </div>

                <div>
                    <span className="support-eyebrow">
                        BPR FLAVORS HUB
                    </span>

                    <h1>
                        24/7 Help & Support
                    </h1>

                    <p>
                        {isOwner
                            ? "We're here to help restaurant owners with orders, payments, restaurant management and technical problems."
                            : "We're here to help with orders, payments, refunds, restaurants, accounts and technical problems."
                        }
                    </p>
                </div>

                <button
                    className="support-new-ticket-btn"
                    onClick={() =>
                        setShowCreateForm(true)
                    }
                >
                    + Create Ticket
                </button>

            </section>

            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (
                <div className="support-alert support-alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="support-alert support-alert-success">
                    {success}
                </div>
            )}

            {/* =================================================
                CREATE TICKET FORM
            ================================================= */}

            {showCreateForm && (

                <section className="support-card support-create-card">

                    <div className="support-section-heading">

                        <div>
                            <span>
                                NEW REQUEST
                            </span>

                            <h2>
                                Tell us what happened
                            </h2>
                        </div>

                        <button
                            className="support-close-btn"
                            onClick={() =>
                                setShowCreateForm(false)
                            }
                        >
                            ×
                        </button>

                    </div>

                    <form
                        className="support-form"
                        onSubmit={handleCreateTicket}
                    >

                        <div className="support-form-group">

                            <label>
                                Subject
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Payment deducted but order not created"
                                value={newTicket.subject}
                                onChange={(event) =>
                                    setNewTicket({
                                        ...newTicket,
                                        subject:
                                            event.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="support-form-row">

                            <div className="support-form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    value={
                                        newTicket.category
                                    }
                                    onChange={(event) =>
                                        setNewTicket({
                                            ...newTicket,
                                            category:
                                                event.target.value
                                        })
                                    }
                                >

                                    <option value="ORDER">
                                        Order Problem
                                    </option>

                                    <option value="PAYMENT">
                                        Payment Problem
                                    </option>

                                    <option value="REFUND">
                                        Refund
                                    </option>

                                    <option value="RESTAURANT">
                                        Restaurant Problem
                                    </option>

                                    <option value="FOOD">
                                        Food Problem
                                    </option>

                                    <option value="ACCOUNT">
                                        Account / Login
                                    </option>

                                    <option value="DELIVERY">
                                        Delivery Problem
                                    </option>

                                    <option value="TECHNICAL">
                                        Technical Problem
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>

                            <div className="support-form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    value={
                                        newTicket.priority
                                    }
                                    onChange={(event) =>
                                        setNewTicket({
                                            ...newTicket,
                                            priority:
                                                event.target.value
                                        })
                                    }
                                >

                                    <option value="LOW">
                                        Low
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                    <option value="URGENT">
                                        Urgent
                                    </option>

                                </select>

                            </div>

                        </div>

                        <div className="support-form-group">

                            <label>
                                Describe your problem
                            </label>

                            <textarea
                                rows="6"
                                placeholder="Explain your problem clearly..."
                                value={
                                    newTicket.description
                                }
                                onChange={(event) =>
                                    setNewTicket({
                                        ...newTicket,
                                        description:
                                            event.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="support-form-actions">

                            <button
                                type="button"
                                className="support-secondary-btn"
                                onClick={() =>
                                    setShowCreateForm(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="support-primary-btn"
                                disabled={creating}
                            >
                                {creating
                                    ? "Creating..."
                                    : "Create Support Ticket"
                                }
                            </button>

                        </div>

                    </form>

                </section>
            )}

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="support-content">

                {/* =================================================
                    TICKETS LIST
                ================================================= */}

                <section className="support-card support-tickets-card">

                    <div className="support-section-heading">

                        <div>
                            <span>
                                YOUR SUPPORT REQUESTS
                            </span>

                            <h2>
                                My Tickets
                            </h2>
                        </div>

                        <div className="support-ticket-count">
                            {tickets.length}
                        </div>

                    </div>

                    {loading ? (

                        <div className="support-empty-state">
                            <div className="support-spinner"></div>

                            <p>
                                Loading your tickets...
                            </p>
                        </div>

                    ) : tickets.length === 0 ? (

                        <div className="support-empty-state">

                            <div className="support-empty-icon">
                                🎫
                            </div>

                            <h3>
                                No support tickets yet
                            </h3>

                            <p>
                                Need help? Create a ticket
                                and our team will assist you.
                            </p>

                            <button
                                className="support-primary-btn"
                                onClick={() =>
                                    setShowCreateForm(true)
                                }
                            >
                                Create Your First Ticket
                            </button>

                        </div>

                    ) : (

                        <div className="support-ticket-list">

                            {tickets.map((ticket) => (

                                <button
                                    key={ticket.id}
                                    className={`support-ticket-item ${
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

                                    <div className="support-ticket-main">

                                        <div className="support-ticket-number">
                                            #{ticket.id}
                                        </div>

                                        <div>
                                            <h3>
                                                {ticket.subject}
                                            </h3>

                                            <p>
                                                {ticket.category}
                                                {" · "}
                                                {formatDate(
                                                    ticket.createdAt
                                                )}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="support-ticket-meta">

                                        <span
                                            className={`support-badge ${getPriorityClass(
                                                ticket.priority
                                            )}`}
                                        >
                                            {
                                                ticket.priority
                                            }
                                        </span>

                                        <span
                                            className={`support-badge ${getStatusClass(
                                                ticket.status
                                            )}`}
                                        >
                                            {ticket.status
                                                ?.replace(
                                                    "_",
                                                    " "
                                                )}
                                        </span>

                                    </div>

                                </button>

                            ))}

                        </div>
                    )}

                </section>

                {/* =================================================
                    CONVERSATION
                ================================================= */}

                <section className="support-card support-conversation-card">

                    {ticketLoading ? (

                        <div className="support-empty-state">
                            <div className="support-spinner"></div>
                            <p>
                                Loading conversation...
                            </p>
                        </div>

                    ) : !selectedTicket ? (

                        <div className="support-empty-state">

                            <div className="support-empty-icon">
                                💬
                            </div>

                            <h3>
                                Select a ticket
                            </h3>

                            <p>
                                Choose a support ticket to
                                view its conversation.
                            </p>

                        </div>

                    ) : (

                        <>

                            {/* Conversation header */}

                            <div className="support-conversation-header">

                                <div>

                                    <span>
                                        TICKET #
                                        {selectedTicket.id}
                                    </span>

                                    <h2>
                                        {
                                            selectedTicket.subject
                                        }
                                    </h2>

                                </div>

                                <div className="support-conversation-status">

                                    <span
                                        className={`support-badge ${getStatusClass(
                                            selectedTicket.status
                                        )}`}
                                    >
                                        {selectedTicket.status
                                            ?.replace(
                                                "_",
                                                " "
                                            )}
                                    </span>

                                </div>

                            </div>

                            {/* Ticket information */}

                            <div className="support-ticket-info">

                                <div>
                                    <span>
                                        Category
                                    </span>
                                    <strong>
                                        {
                                            selectedTicket.category
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Priority
                                    </span>

                                    <strong
                                        className={
                                            getPriorityClass(
                                                selectedTicket.priority
                                            )
                                        }
                                    >
                                        {
                                            selectedTicket.priority
                                        }
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedTicket.createdAt
                                        )}
                                    </strong>
                                </div>

                            </div>

                            {/* Description */}

                            <div className="support-original-problem">

                                <span>
                                    ORIGINAL PROBLEM
                                </span>

                                <p>
                                    {
                                        selectedTicket.description
                                    }
                                </p>

                            </div>

                            {/* Messages */}

                            <div className="support-messages">

                                {selectedTicket.messages?.map(
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
                                                className={`support-message-row ${
                                                    isAdmin
                                                        ? "admin"
                                                        : "user"
                                                }`}
                                            >

                                                <div className="support-message-bubble">

                                                    <div className="support-message-author">

                                                        <strong>
                                                            {message.senderName}
                                                        </strong>

                                                        <span>
                                                            {
                                                                isAdmin
                                                                    ? "ADMIN"
                                                                    : "YOU"
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

                            {/* Resolution */}

                            {selectedTicket.resolution && (

                                <div className="support-resolution">

                                    <div className="support-resolution-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <span>
                                            RESOLUTION
                                        </span>

                                        <p>
                                            {
                                                selectedTicket.resolution
                                            }
                                        </p>
                                    </div>

                                </div>
                            )}

                            {/* Reply */}

                            {selectedTicket.status !==
                                "CLOSED" ? (

                                <form
                                    className="support-reply-form"
                                    onSubmit={handleReply}
                                >

                                    <textarea
                                        rows="3"
                                        placeholder="Write a reply to support..."
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
                                        className="support-primary-btn"
                                        disabled={
                                            sending ||
                                            !reply.trim()
                                        }
                                    >
                                        {sending
                                            ? "Sending..."
                                            : "Send Reply →"
                                        }
                                    </button>

                                </form>

                            ) : (

                                <div className="support-closed-message">
                                    🔒 This ticket is closed.
                                    You can create a new ticket
                                    for another problem.
                                </div>

                            )}

                        </>

                    )}

                </section>

            </div>

        </div>
    );
}

export default Support;