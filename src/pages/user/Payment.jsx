import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PaymentService from "../../services/PaymentService";
import "./Payment.css";

function Payment() {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = useParams();

    const state = location.state || {};

    const orderIdsFromState = Array.isArray(state.orderIds)
        ? state.orderIds
        : [];

    const orderIds =
        orderIdsFromState.length > 0
            ? orderIdsFromState
            : orderId
                ? [Number(orderId)]
                : [];

    const [paymentMethod, setPaymentMethod] = useState(
        state.paymentMethod || "UPI"
    );

    const [loading, setLoading] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(0);

    const payNow = async () => {
        if (orderIds.length === 0) {
            alert("No order found for payment.");
            navigate("/orders");
            return;
        }

        try {
            setLoading(true);

            const payments = [];

            for (let i = 0; i < orderIds.length; i++) {
                setCurrentOrder(i + 1);

                console.log(
                    "Processing payment for Order ID:",
                    orderIds[i]
                );

                const response = await PaymentService.makePayment({
                    orderId: Number(orderIds[i]),
                    paymentMethod: paymentMethod
                });

                console.log("Payment response:", response.data);

                payments.push(response.data);
            }

            console.log("All payments successful:", payments);

            navigate("/payment-success", {
                state: {
                    payments: payments,
                    totalOrders: payments.length,
                    totalItems: state.totalItems || 0,
                    totalAmount: state.totalAmount || 0
                }
            });

        } catch (error) {
            console.error("Payment error:", error);

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Payment failed.";

            navigate("/payment-failed", {
                state: {
                    message: message,
                    orderIds: orderIds
                }
            });

        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate("/checkout");
    };

    return (
        <div className="payment-page">

            <div className="payment-container">

                <div className="payment-card">

                    {/* HEADER */}
                    <div className="payment-header">
                        <div className="payment-header-icon">
                            💳
                        </div>

                        <h1>Payment</h1>

                        <p>
                            Complete your payment securely
                        </p>
                    </div>

                    {/* CONTENT */}
                    <div className="payment-content">

                        {/* ORDER SUMMARY */}
                        <div className="payment-section">

                            <div className="payment-section-title">
                                <span>📦</span>
                                <h2>Order Summary</h2>
                            </div>

                            <div className="payment-order-info">

                                <div className="payment-info-box">
                                    <span className="payment-info-label">
                                        Number of Orders
                                    </span>

                                    <span className="payment-info-value">
                                        {orderIds.length}
                                    </span>
                                </div>

                                <div className="payment-info-box">
                                    <span className="payment-info-label">
                                        Order ID
                                    </span>

                                    <span className="payment-info-value">
                                        {orderIds.join(", ")}
                                    </span>
                                </div>

                                <div className="payment-info-box">
                                    <span className="payment-info-label">
                                        Total Items
                                    </span>

                                    <span className="payment-info-value">
                                        {state.totalItems || 0}
                                    </span>
                                </div>

                                <div className="payment-info-box">
                                    <span className="payment-info-label">
                                        Total Amount
                                    </span>

                                    <span className="payment-info-value payment-amount">
                                        ₹
                                        {Number(
                                            state.totalAmount || 0
                                        ).toFixed(2)}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* PAYMENT METHOD */}
                        <div className="payment-section">

                            <div className="payment-section-title">
                                <span>💳</span>
                                <h2>Payment Method</h2>
                            </div>

                            <label
                                className="payment-method-label"
                                htmlFor="paymentMethod"
                            >
                                Select your preferred payment method
                            </label>

                            <select
                                id="paymentMethod"
                                className="payment-select"
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                disabled={loading}
                            >
                                <option value="UPI">
                                    UPI
                                </option>

                                <option value="Credit Card">
                                    Credit Card
                                </option>

                                <option value="Debit Card">
                                    Debit Card
                                </option>

                                <option value="Cash On Delivery">
                                    Cash On Delivery
                                </option>
                            </select>

                            {/* PAYMENT METHOD INFO */}
                            <div className="selected-payment-info">

                                {paymentMethod === "UPI" && (
                                    <>
                                        <span>📱</span>
                                        <div>
                                            <strong>UPI Payment</strong>
                                            <p>
                                                Pay using Google Pay,
                                                PhonePe, Paytm or another
                                                UPI application.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {paymentMethod === "Credit Card" && (
                                    <>
                                        <span>💳</span>
                                        <div>
                                            <strong>Credit Card</strong>
                                            <p>
                                                Pay securely using your
                                                credit card.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {paymentMethod === "Debit Card" && (
                                    <>
                                        <span>💳</span>
                                        <div>
                                            <strong>Debit Card</strong>
                                            <p>
                                                Pay securely using your
                                                debit card.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {paymentMethod === "Cash On Delivery" && (
                                    <>
                                        <span>💵</span>
                                        <div>
                                            <strong>Cash On Delivery</strong>
                                            <p>
                                                Pay when your food is
                                                delivered.
                                            </p>
                                        </div>
                                    </>
                                )}

                            </div>

                        </div>

                        {/* PROCESSING */}
                        {loading && (
                            <div className="payment-processing">

                                <span className="payment-spinner"></span>

                                <div>
                                    <strong>
                                        Processing Payment...
                                    </strong>

                                    <p>
                                        Processing order{" "}
                                        {currentOrder} of{" "}
                                        {orderIds.length}
                                    </p>
                                </div>

                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="payment-actions">

                            <button
                                type="button"
                                className="back-checkout-btn"
                                onClick={goBack}
                                disabled={loading}
                            >
                                ← Back to Checkout
                            </button>

                            <button
                                type="button"
                                className="pay-now-btn"
                                onClick={payNow}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="payment-spinner"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        🔒 Pay ₹
                                        {Number(
                                            state.totalAmount || 0
                                        ).toFixed(2)}
                                    </>
                                )}
                            </button>

                        </div>

                        {/* SECURITY */}
                        <div className="payment-security">

                            <span>🔒</span>

                            <div>
                                <strong>Secure Payment</strong>

                                <p>
                                    Your payment information is
                                    securely processed.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Payment;