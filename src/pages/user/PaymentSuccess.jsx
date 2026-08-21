import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

function PaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state || {};

    const payments = Array.isArray(state.payments)
        ? state.payments
        : [];

    if (payments.length === 0) {
        return (
            <div className="payment-success-page">

                <div className="payment-success-container">

                    <div className="payment-success-card">

                        <div className="payment-success-header">
                            <div className="success-icon">
                                ⚠️
                            </div>

                            <h1>
                                Payment Information Not Found
                            </h1>

                            <p>
                                No payment details are available.
                            </p>
                        </div>

                        <div className="payment-success-content">

                            <div className="success-actions">

                                <button
                                    className="my-orders-btn"
                                    onClick={() =>
                                        navigate("/orders")
                                    }
                                >
                                    📦 My Orders
                                </button>

                                <button
                                    className="home-btn"
                                    onClick={() =>
                                        navigate("/")
                                    }
                                >
                                    🏠 Home
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="payment-success-page">

            <div className="payment-success-container">

                <div className="payment-success-card">

                    {/* SUCCESS HEADER */}
                    <div className="payment-success-header">

                        <div className="success-icon">
                            ✓
                        </div>

                        <h1>
                            Payment Successful
                        </h1>

                        <p>
                            Your order payment has been
                            completed successfully.
                        </p>

                    </div>

                    {/* PAYMENT DETAILS */}
                    <div className="payment-success-content">

                        {payments.length === 1 ? (

                            <div className="success-details">

                                <div className="success-detail">
                                    <span className="success-detail-label">
                                        Payment ID
                                    </span>

                                    <span className="success-detail-value">
                                        {payments[0].paymentId ??
                                            payments[0].id ??
                                            "N/A"}
                                    </span>
                                </div>

                                <div className="success-detail">
                                    <span className="success-detail-label">
                                        Order ID
                                    </span>

                                    <span className="success-detail-value">
                                        {payments[0].orderId ??
                                            "N/A"}
                                    </span>
                                </div>

                                <div className="success-detail">
                                    <span className="success-detail-label">
                                        Amount
                                    </span>

                                    <span className="success-detail-value">
                                        ₹
                                        {Number(
                                            payments[0].amount || 0
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="success-detail">
                                    <span className="success-detail-label">
                                        Payment Method
                                    </span>

                                    <span className="success-detail-value">
                                        {payments[0].paymentMethod ??
                                            "N/A"}
                                    </span>
                                </div>

                                <div className="success-detail">
                                    <span className="success-detail-label">
                                        Status
                                    </span>

                                    <span className="success-detail-value success-status">
                                        ✓{" "}
                                        {payments[0].status ??
                                            "SUCCESS"}
                                    </span>
                                </div>

                            </div>

                        ) : (

                            <div className="payment-list">

                                {payments.map((payment, index) => (

                                    <div
                                        className="payment-list-item"
                                        key={
                                            payment.paymentId ??
                                            payment.id ??
                                            index
                                        }
                                    >

                                        <h3>
                                            Order #{payment.orderId}
                                        </h3>

                                        <p>
                                            <strong>
                                                Payment ID:
                                            </strong>{" "}
                                            {payment.paymentId ??
                                                payment.id ??
                                                "N/A"}
                                        </p>

                                        <p>
                                            <strong>
                                                Amount:
                                            </strong>{" "}
                                            ₹
                                            {Number(
                                                payment.amount || 0
                                            ).toFixed(2)}
                                        </p>

                                        <p>
                                            <strong>
                                                Method:
                                            </strong>{" "}
                                            {payment.paymentMethod ??
                                                "N/A"}
                                        </p>

                                        <p className="success-status">
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            ✓{" "}
                                            {payment.status ??
                                                "SUCCESS"}
                                        </p>

                                    </div>

                                ))}

                            </div>

                        )}

                        {/* TRANSACTION ID */}
                        {payments.length === 1 &&
                            payments[0].transactionId && (

                                <div className="transaction-section">

                                    <h3>
                                        Transaction ID
                                    </h3>

                                    <div className="transaction-id">
                                        {
                                            payments[0]
                                                .transactionId
                                        }
                                    </div>

                                </div>
                            )}

                        {/* BUTTONS */}
                        <div className="success-actions">

                            <button
                                className="my-orders-btn"
                                onClick={() =>
                                    navigate("/orders")
                                }
                            >
                                📦 My Orders
                            </button>

                            <button
                                className="home-btn"
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                🏠 Home
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PaymentSuccess;