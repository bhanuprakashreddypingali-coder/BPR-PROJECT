import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerService from "../../services/CustomerService";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const [clearing, setClearing] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD CART
    // =====================================================

    const loadCart = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await CustomerService.getCart();

            const items = Array.isArray(response.data)
                ? response.data
                : [];

            setCartItems(items);

        } catch (err) {
            console.error("Get cart error:", err);

            if (err.response?.status === 401 ||
                err.response?.status === 403) {

                setError(
                    "Your session has expired. Please login again."
                );

            } else {
                setError(
                    err.response?.data ||
                    "Unable to load your cart."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    // =====================================================
    // UPDATE QUANTITY
    // =====================================================

    const updateQuantity = async (item, newQuantity) => {

        if (newQuantity < 1) {
            return;
        }

        try {
            setUpdatingId(item.id);
            setError("");

            const response =
                await CustomerService.updateCartItem(
                    item.id,
                    newQuantity
                );

            const updatedItem = response.data;

            setCartItems((previousItems) =>
                previousItems.map((cartItem) =>
                    cartItem.id === item.id
                        ? updatedItem
                        : cartItem
                )
            );

        } catch (err) {
            console.error(
                "Update quantity error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to update quantity."
            );

        } finally {
            setUpdatingId(null);
        }
    };

    // =====================================================
    // REMOVE ITEM
    // =====================================================

    const removeItem = async (cartItemId) => {

        try {
            setRemovingId(cartItemId);
            setError("");

            await CustomerService.removeCartItem(
                cartItemId
            );

            setCartItems((previousItems) =>
                previousItems.filter(
                    (item) => item.id !== cartItemId
                )
            );

        } catch (err) {
            console.error(
                "Remove cart item error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to remove item."
            );

        } finally {
            setRemovingId(null);
        }
    };

    // =====================================================
    // CLEAR CART
    // =====================================================

    const clearCart = async () => {

        if (cartItems.length === 0) {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to clear your cart?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setClearing(true);
            setError("");

            await CustomerService.clearCart();

            setCartItems([]);

        } catch (err) {
            console.error(
                "Clear cart error:",
                err
            );

            setError(
                err.response?.data ||
                "Unable to clear cart."
            );

        } finally {
            setClearing(false);
        }
    };

    // =====================================================
    // PROCEED TO CHECKOUT
    // =====================================================

    const proceedToCheckout = () => {

        if (cartItems.length === 0) {
            setError(
                "Your cart is empty. Please add food items first."
            );
            return;
        }

        navigate("/checkout");
    };

    // =====================================================
    // CALCULATE TOTALS
    // =====================================================

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

    const deliveryFee = cartItems.length > 0
        ? 0
        : 0;

    const grandTotal =
        subtotal + deliveryFee;

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="cart-page">

                <div className="cart-container">

                    <div className="cart-loading">

                        <div className="cart-spinner"></div>

                        <h2>Loading your cart...</h2>

                        <p>
                            Please wait while we get your cart items.
                        </p>

                    </div>

                </div>

            </div>
        );
    }

    // =====================================================
    // EMPTY CART
    // =====================================================

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">

                <div className="cart-container">

                    <div className="cart-header">

                        <div>
                            <h1>Your Cart</h1>

                            <p>
                                Review your selected food items
                            </p>
                        </div>

                        <div className="cart-count">
                            0 Items
                        </div>

                    </div>

                    {error && (
                        <div className="cart-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="empty-cart-card">

                        <div className="empty-cart-icon">
                            🛒
                        </div>

                        <h2>Your Cart is Empty</h2>

                        <p>
                            Looks like you haven't added any
                            delicious food yet.
                        </p>

                        <button
                            className="browse-food-btn"
                            onClick={() => navigate("/foods")}
                        >
                            Browse Food
                            <span>→</span>
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // =====================================================
    // CART PAGE
    // =====================================================

    return (
        <div className="cart-page">

            <div className="cart-container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="cart-header">

                    <div>
                        <h1>Your Cart</h1>

                        <p>
                            Review your selected food items
                        </p>
                    </div>

                    <div className="cart-header-right">

                        <div className="cart-count">
                            {totalItems}{" "}
                            {totalItems === 1
                                ? "Item"
                                : "Items"}
                        </div>

                        <button
                            className="clear-cart-btn"
                            onClick={clearCart}
                            disabled={clearing}
                        >
                            {clearing
                                ? "Clearing..."
                                : "Clear Cart"}
                        </button>

                    </div>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="cart-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <div className="cart-content">

                    {/* =================================================
                        CART ITEMS
                    ================================================= */}

                    <div className="cart-items-section">

                        <div className="cart-items-card">

                            <div className="cart-items-title">

                                <div>
                                    <h2>
                                        Cart Items
                                    </h2>

                                    <span>
                                        {totalItems}{" "}
                                        {totalItems === 1
                                            ? "item"
                                            : "items"}
                                    </span>
                                </div>

                            </div>

                            <div className="cart-items-list">

                                {cartItems.map((item) => {

                                    const isUpdating =
                                        updatingId === item.id;

                                    const isRemoving =
                                        removingId === item.id;

                                    const quantity =
                                        Number(item.quantity || 1);

                                    const price =
                                        Number(item.price || 0);

                                    const itemTotal =
                                        Number(item.total || 0);

                                    return (
                                        <div
                                            className={`cart-item ${
                                                isRemoving
                                                    ? "removing"
                                                    : ""
                                            }`}
                                            key={item.id}
                                        >

                                            {/* Food Icon */}

                                            <div className="food-image">

                                                <span>
                                                    🍽️
                                                </span>

                                            </div>

                                            {/* Food Information */}

                                            <div className="food-details">

                                                <h3>
                                                    {item.foodName ||
                                                        "Food Item"}
                                                </h3>

                                                <p className="food-price">
                                                    ₹
                                                    {price.toFixed(2)}
                                                    {" "}per item
                                                </p>

                                                <p className="food-total-mobile">
                                                    Total: ₹
                                                    {itemTotal.toFixed(2)}
                                                </p>

                                            </div>

                                            {/* Quantity */}

                                            <div className="quantity-section">

                                                <span>
                                                    Quantity
                                                </span>

                                                <div className="quantity-control">

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isUpdating ||
                                                            quantity <= 1
                                                        }
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item,
                                                                quantity - 1
                                                            )
                                                        }
                                                    >
                                                        −
                                                    </button>

                                                    <div className="quantity-number">

                                                        {isUpdating ? (
                                                            <span className="small-spinner"></span>
                                                        ) : (
                                                            quantity
                                                        )}

                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            isUpdating
                                                        }
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item,
                                                                quantity + 1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                            </div>

                                            {/* Item Total */}

                                            <div className="item-total">

                                                <span>
                                                    Item Total
                                                </span>

                                                <strong>
                                                    ₹
                                                    {itemTotal.toFixed(2)}
                                                </strong>

                                            </div>

                                            {/* Remove */}

                                            <button
                                                type="button"
                                                className="remove-item-btn"
                                                disabled={isRemoving}
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                                title="Remove item"
                                            >
                                                {isRemoving
                                                    ? "..."
                                                    : "×"}
                                            </button>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        ORDER SUMMARY
                    ================================================= */}

                    <div className="cart-summary-section">

                        <div className="cart-summary-card">

                            <div className="summary-header">

                                <span className="summary-cart-icon">
                                    🛒
                                </span>

                                <h2>
                                    Order Summary
                                </h2>

                            </div>

                            <div className="summary-line">
                                <span>
                                    Items
                                </span>

                                <strong>
                                    {totalItems}
                                </strong>
                            </div>

                            <div className="summary-line">
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹{subtotal.toFixed(2)}
                                </strong>
                            </div>

                            <div className="summary-line">
                                <span>
                                    Delivery Fee
                                </span>

                                <strong className="free">
                                    FREE
                                </strong>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{grandTotal.toFixed(2)}
                                </strong>
                            </div>

                            <button
                                type="button"
                                className="checkout-btn"
                                onClick={proceedToCheckout}
                            >
                                Proceed to Checkout
                                <span>→</span>
                            </button>

                            <button
                                type="button"
                                className="continue-shopping-btn"
                                onClick={() =>
                                    navigate("/foods")
                                }
                            >
                                ← Continue Shopping
                            </button>

                            <div className="secure-cart">

                                <span>
                                    🔒
                                </span>

                                <div>
                                    <strong>
                                        Secure Checkout
                                    </strong>

                                    <p>
                                        Your order information
                                        is protected.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Cart;
