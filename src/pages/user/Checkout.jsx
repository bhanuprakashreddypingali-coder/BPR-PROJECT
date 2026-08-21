import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerService from "../../services/CustomerService";
import "./Checkout.css";

function Checkout() {
    const navigate = useNavigate();

    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(true);

    const DELIVERY_FEE = 30;

    // =========================================================
    // LOAD CART
    // =========================================================

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setCartLoading(true);

            const response = await CustomerService.getCart();

            const items = Array.isArray(response.data)
                ? response.data
                : [];

            setCartItems(items);

        } catch (error) {
            console.error("Failed to load cart:", error);

            if (error.response?.status === 401 ||
                error.response?.status === 403) {

                alert("Your session has expired. Please login again.");

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                navigate("/login");
            }

        } finally {
            setCartLoading(false);
        }
    };

    // =========================================================
    // CALCULATIONS
    // =========================================================

    const totalItems = cartItems.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + Number(item.total || 0),
        0
    );

    const deliveryFee =
        cartItems.length > 0 ? DELIVERY_FEE : 0;

    const grandTotal =
        subtotal + deliveryFee;

    // =========================================================
    // CHECKOUT
    // =========================================================

    const placeOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items before checkout.");
            navigate("/cart");
            return;
        }

        if (!deliveryAddress.trim()) {
            alert("Please enter your delivery address.");
            return;
        }

        try {
            setLoading(true);

            const response =
                await CustomerService.checkout({
                    deliveryAddress:
                        deliveryAddress.trim(),

                    paymentMethod:
                        paymentMethod
                });

            const data = response.data;

            if (
                !data.orderIds ||
                data.orderIds.length === 0
            ) {
                throw new Error(
                    "No orders were created."
                );
            }

            navigate("/payment", {
                state: {
                    orderIds: data.orderIds,
                    totalItems: data.totalItems,
                    totalAmount: data.totalAmount,
                    paymentMethod: paymentMethod
                }
            });

        } catch (error) {
            console.error(
                "Checkout error:",
                error
            );

            let message =
                "Checkout failed.";

            if (error.response?.status === 403) {
                message =
                    error.response?.data ||
                    "Checkout failed. Please make sure your cart contains items.";
            } else if (error.response?.data) {
                message =
                    typeof error.response.data === "string"
                        ? error.response.data
                        : error.response.data.message ||
                          "Checkout failed.";
            } else if (error.message) {
                message = error.message;
            }

            alert(message);

        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // EMPTY CART
    // =========================================================

    if (!cartLoading && cartItems.length === 0) {
        return (
            <div className="checkout-page">

                <div className="empty-checkout">

                    <div className="empty-checkout-icon">
                        🛒
                    </div>

                    <h1>Your Cart Is Empty</h1>

                    <p>
                        Add some delicious food to your cart
                        before proceeding to checkout.
                    </p>

                    <button
                        className="back-to-menu-btn"
                        onClick={() => navigate("/cart")}
                    >
                        ← Back to Cart
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="checkout-page">

            <div className="checkout-container">

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="checkout-header">

                    <div>
                        <h1>Checkout</h1>

                        <p>
                            Complete your order securely
                        </p>
                    </div>

                    <div className="checkout-step">

                        <div className="step-wrapper">

                            <span className="step-active">
                                1
                            </span>

                            <span className="step-line"></span>

                            <span className="step">
                                2
                            </span>

                        </div>

                        <div className="step-labels">
                            <span>Checkout</span>
                            <span>Payment</span>
                        </div>

                    </div>

                </div>

                {/* =====================================================
                    MAIN CONTENT
                ====================================================== */}

                <div className="checkout-content">

                    {/* =================================================
                        LEFT SIDE
                    ================================================== */}

                    <div className="checkout-form-card">

                        <form onSubmit={placeOrder}>

                            {/* =========================================
                                DELIVERY ADDRESS
                            ========================================== */}

                            <div className="checkout-section">

                                <div className="section-title">

                                    <div className="section-icon">
                                        📍
                                    </div>

                                    <div>
                                        <h2>
                                            Delivery Address
                                        </h2>

                                        <p>
                                            Where should we deliver
                                            your food?
                                        </p>
                                    </div>

                                </div>

                                <label
                                    htmlFor="deliveryAddress"
                                    className="checkout-label"
                                >
                                    Full Delivery Address
                                </label>

                                <textarea
                                    id="deliveryAddress"
                                    className="checkout-textarea"
                                    rows="5"
                                    placeholder="Enter your complete delivery address..."
                                    value={deliveryAddress}
                                    onChange={(e) =>
                                        setDeliveryAddress(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <div className="input-help">
                                    📍 Include house number,
                                    street, city and landmark
                                    for easier delivery.
                                </div>

                            </div>

                            {/* =========================================
                                PAYMENT
                            ========================================== */}

                            <div className="checkout-section">

                                <div className="section-title">

                                    <div className="section-icon">
                                        💳
                                    </div>

                                    <div>
                                        <h2>
                                            Payment Method
                                        </h2>

                                        <p>
                                            Select how you want
                                            to pay.
                                        </p>
                                    </div>

                                </div>

                                <div className="payment-options">

                                    {/* UPI */}

                                    <label
                                        className={`payment-option ${
                                            paymentMethod === "UPI"
                                                ? "selected"
                                                : ""
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="UPI"
                                            checked={
                                                paymentMethod === "UPI"
                                            }
                                            onChange={(e) =>
                                                setPaymentMethod(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div className="payment-icon">
                                            📱
                                        </div>

                                        <div className="payment-info">

                                            <strong>
                                                UPI
                                            </strong>

                                            <span>
                                                Google Pay, PhonePe,
                                                Paytm and more
                                            </span>

                                        </div>

                                        <div className="radio-check">
                                            {paymentMethod === "UPI"
                                                ? "✓"
                                                : ""}
                                        </div>

                                    </label>

                                    {/* CREDIT CARD */}

                                    <label
                                        className={`payment-option ${
                                            paymentMethod ===
                                            "Credit Card"
                                                ? "selected"
                                                : ""
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Credit Card"
                                            checked={
                                                paymentMethod ===
                                                "Credit Card"
                                            }
                                            onChange={(e) =>
                                                setPaymentMethod(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div className="payment-icon">
                                            💳
                                        </div>

                                        <div className="payment-info">

                                            <strong>
                                                Credit Card
                                            </strong>

                                            <span>
                                                Pay securely with
                                                credit card
                                            </span>

                                        </div>

                                        <div className="radio-check">
                                            {paymentMethod ===
                                            "Credit Card"
                                                ? "✓"
                                                : ""}
                                        </div>

                                    </label>

                                    {/* DEBIT CARD */}

                                    <label
                                        className={`payment-option ${
                                            paymentMethod ===
                                            "Debit Card"
                                                ? "selected"
                                                : ""
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Debit Card"
                                            checked={
                                                paymentMethod ===
                                                "Debit Card"
                                            }
                                            onChange={(e) =>
                                                setPaymentMethod(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div className="payment-icon">
                                            💳
                                        </div>

                                        <div className="payment-info">

                                            <strong>
                                                Debit Card
                                            </strong>

                                            <span>
                                                Pay securely with
                                                debit card
                                            </span>

                                        </div>

                                        <div className="radio-check">
                                            {paymentMethod ===
                                            "Debit Card"
                                                ? "✓"
                                                : ""}
                                        </div>

                                    </label>

                                    {/* CASH ON DELIVERY */}

                                    <label
                                        className={`payment-option ${
                                            paymentMethod ===
                                            "Cash On Delivery"
                                                ? "selected"
                                                : ""
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Cash On Delivery"
                                            checked={
                                                paymentMethod ===
                                                "Cash On Delivery"
                                            }
                                            onChange={(e) =>
                                                setPaymentMethod(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div className="payment-icon">
                                            💵
                                        </div>

                                        <div className="payment-info">

                                            <strong>
                                                Cash On Delivery
                                            </strong>

                                            <span>
                                                Pay when your food
                                                arrives
                                            </span>

                                        </div>

                                        <div className="radio-check">
                                            {paymentMethod ===
                                            "Cash On Delivery"
                                                ? "✓"
                                                : ""}
                                        </div>

                                    </label>

                                </div>

                            </div>

                            {/* =========================================
                                CONTINUE BUTTON
                            ========================================== */}

                            <button
                                type="submit"
                                className="continue-payment-btn"
                                disabled={
                                    loading ||
                                    cartItems.length === 0
                                }
                            >

                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Creating Order...
                                    </>
                                ) : (
                                    <>
                                        Continue To Payment
                                        <span className="arrow">
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>

                    </div>

                    {/* =================================================
                        RIGHT SIDE - ORDER SUMMARY
                    ================================================== */}

                    <div className="checkout-summary">

                        <div className="summary-card">

                            <div className="summary-title">

                                <div className="summary-title-left">

                                    <span>
                                        🛒
                                    </span>

                                    <h2>
                                        Order Summary
                                    </h2>

                                </div>

                                <span className="item-count">
                                    {totalItems}{" "}
                                    {totalItems === 1
                                        ? "item"
                                        : "items"}
                                </span>

                            </div>

                            {/* CART ITEMS */}

                            <div className="summary-items">

                                {cartItems.map((item) => (

                                    <div
                                        className="summary-item"
                                        key={item.id}
                                    >

                                        <div className="summary-item-icon">
                                            🍽️
                                        </div>

                                        <div className="summary-item-details">

                                            <h3>
                                                {item.foodName}
                                            </h3>

                                            <div className="summary-item-meta">

                                                <span>
                                                    Qty:{" "}
                                                    {item.quantity}
                                                </span>

                                                <span>
                                                    ₹
                                                    {Number(
                                                        item.price || 0
                                                    ).toFixed(2)}
                                                    {" "}each
                                                </span>

                                            </div>

                                        </div>

                                        <div className="summary-item-price">
                                            ₹
                                            {Number(
                                                item.total || 0
                                            ).toFixed(2)}
                                        </div>

                                    </div>

                                ))}

                            </div>

                            {/* TOTALS */}

                            <div className="summary-totals">

                                <div className="summary-row">

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ₹
                                        {subtotal.toFixed(2)}
                                    </strong>

                                </div>

                                <div className="summary-row">

                                    <span>
                                        Delivery Fee
                                    </span>

                                    <strong>
                                        ₹
                                        {deliveryFee.toFixed(2)}
                                    </strong>

                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total-row">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹
                                        {grandTotal.toFixed(2)}
                                    </strong>

                                </div>

                            </div>

                            {/* SECURE CHECKOUT */}

                            <div className="secure-payment">

                                <span className="secure-icon">
                                    🔒
                                </span>

                                <div>

                                    <strong>
                                        Secure Checkout
                                    </strong>

                                    <p>
                                        Your order information
                                        is securely processed.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* BACK TO CART */}

                        <button
                            type="button"
                            className="back-cart-btn"
                            onClick={() =>
                                navigate("/cart")
                            }
                        >
                            ← Back to Cart
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;