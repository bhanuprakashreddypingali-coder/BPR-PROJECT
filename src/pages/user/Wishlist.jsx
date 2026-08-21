import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import API from "../../services/ApiService";

function Wishlist() {
    const navigate = useNavigate();

    const [wishlist, setWishlist] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =========================================================
    // LOAD MY WISHLIST
    // Backend endpoint:
    // GET /api/wishlist
    // =========================================================

    const loadWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login to view your wishlist."
                );

                return;
            }

            console.log(
                "🤍 Loading my wishlist..."
            );

            /*
             * IMPORTANT:
             *
             * Do NOT use:
             *
             * /wishlist/user/{userId}
             *
             * The backend controller provides:
             *
             * GET /api/wishlist
             *
             * The backend gets the logged-in user
             * from Authentication.
             */

            const response =
                await API.get(
                    "/wishlist"
                );

            console.log(
                "🤍 Wishlist response:",
                response.data
            );

            setWishlist(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {
            console.error(
                "❌ Wishlist loading error:",
                err
            );

            const status =
                err.response?.status;

            /*
             * 401 = no/invalid authentication
             */

            if (status === 401) {
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "role"
                );

                setError(
                    "Your session has expired. Please login again."
                );

                return;
            }

            /*
             * 403 = backend/security rejected request.
             *
             * Do not incorrectly say that the user ID
             * is missing because this endpoint does not
             * require a user ID from the frontend.
             */

            if (status === 403) {
                setError(
                    "You do not have permission to view your wishlist."
                );

                return;
            }

            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to load wishlist."
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // LOAD ON PAGE OPEN
    // =========================================================

    useEffect(() => {
        loadWishlist();
    }, []);

    // =========================================================
    // REMOVE WISHLIST ITEM
    //
    // Backend:
    // DELETE /api/wishlist?foodId={foodId}
    // =========================================================

    const removeWishlist = async (item) => {
        try {
            const foodId =
                item.foodId ||
                item.food?.id ||
                item.food?.foodId;

            if (!foodId) {
                alert(
                    "Food information is not available."
                );

                return;
            }

            await API.delete(
                `/wishlist?foodId=${foodId}`
            );

            /*
             * Remove from UI immediately.
             */

            setWishlist(
                (previous) =>
                    previous.filter(
                        (wishlistItem) => {

                            const wishlistFoodId =
                                wishlistItem.foodId ||
                                wishlistItem.food?.id ||
                                wishlistItem.food?.foodId;

                            return (
                                String(
                                    wishlistFoodId
                                ) !==
                                String(foodId)
                            );
                        }
                    )
            );

        } catch (err) {
            console.error(
                "❌ Remove wishlist error:",
                err
            );

            const status =
                err.response?.status;

            if (status === 401) {
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "role"
                );

                alert(
                    "Your session has expired. Please login again."
                );

                navigate(
                    "/login",
                    {
                        state: {
                            from: "/wishlist"
                        }
                    }
                );

                return;
            }

            alert(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to remove item from wishlist."
            );
        }
    };

    // =========================================================
    // FOOD NAME
    // =========================================================

    const getFoodName = (item) =>
        item.foodName ||
        item.food?.foodName ||
        item.name ||
        item.food?.name ||
        "Food Item";

    // =========================================================
    // PRICE
    // =========================================================

    const getPrice = (item) =>
        item.price ??
        item.food?.price ??
        0;

    // =========================================================
    // IMAGE
    // =========================================================

    const getImage = (item) =>
        item.image ||
        item.food?.image ||
        "https://via.placeholder.com/400x250?text=Food";

    // =========================================================
    // FOOD ID
    // =========================================================

    const getFoodId = (item) =>
        item.foodId ||
        item.food?.id ||
        item.food?.foodId;

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div style={styles.center}>
                <h3>
                    🤍 Loading my wishlist...
                </h3>
            </div>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div style={styles.page}>

            <div style={styles.container}>

                {/* =================================================
                    HEADER
                ================================================= */}

                <div style={styles.header}>

                    <div>

                        <h1 style={styles.title}>
                            🤍 My Wishlist
                        </h1>

                        <p style={styles.subtitle}>
                            Save food items you want
                            to order later
                        </p>

                    </div>

                    <button
                        style={
                            styles.continueButton
                        }
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        ← Continue Shopping
                    </button>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div style={styles.error}>

                        <div>
                            {error}
                        </div>

                        {(
                            error
                                .toLowerCase()
                                .includes("login")
                        ) && (

                            <button
                                style={
                                    styles.loginButton
                                }
                                onClick={() =>
                                    navigate(
                                        "/login",
                                        {
                                            state: {
                                                from: "/wishlist"
                                            }
                                        }
                                    )
                                }
                            >
                                Login Again
                            </button>

                        )}

                    </div>
                )}

                {/* =================================================
                    EMPTY WISHLIST
                ================================================= */}

                {!error &&
                    wishlist.length === 0 && (

                        <div style={styles.empty}>

                            <div
                                style={
                                    styles.emptyIcon
                                }
                            >
                                🤍
                            </div>

                            <h2>
                                Your Wishlist is Empty
                            </h2>

                            <p>
                                Save your favorite food
                                items here for later.
                            </p>

                            <button
                                style={
                                    styles.primaryButton
                                }
                                onClick={() =>
                                    navigate("/")
                                }
                            >
                                Explore Foods
                            </button>

                        </div>

                    )}

                {/* =================================================
                    WISHLIST GRID
                ================================================= */}

                {!error &&
                    wishlist.length > 0 && (

                        <div style={styles.grid}>

                            {wishlist.map(
                                (item) => {

                                    const foodId =
                                        getFoodId(
                                            item
                                        );

                                    return (

                                        <div
                                            key={
                                                item.id ||
                                                foodId
                                            }
                                            style={
                                                styles.card
                                            }
                                        >

                                            {/* IMAGE */}

                                            <img
                                                src={
                                                    getImage(
                                                        item
                                                    )
                                                }
                                                alt={
                                                    getFoodName(
                                                        item
                                                    )
                                                }
                                                style={
                                                    styles.image
                                                }
                                                onError={(
                                                    event
                                                ) => {

                                                    event
                                                        .currentTarget
                                                        .onerror =
                                                        null;

                                                    event
                                                        .currentTarget
                                                        .src =
                                                        "https://via.placeholder.com/400x250?text=Food";
                                                }}
                                            />

                                            {/* CONTENT */}

                                            <div
                                                style={
                                                    styles.cardBody
                                                }
                                            >

                                                <h3
                                                    style={
                                                        styles.foodName
                                                    }
                                                >
                                                    {
                                                        getFoodName(
                                                            item
                                                        )
                                                    }
                                                </h3>

                                                <p
                                                    style={
                                                        styles.price
                                                    }
                                                >
                                                    ₹
                                                    {Number(
                                                        getPrice(
                                                            item
                                                        )
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </p>

                                                {/* ACTIONS */}

                                                <div
                                                    style={
                                                        styles.actions
                                                    }
                                                >

                                                    <button
                                                        style={
                                                            styles.viewButton
                                                        }
                                                        onClick={() => {

                                                            if (
                                                                foodId
                                                            ) {

                                                                navigate(
                                                                    `/food/${foodId}`
                                                                );

                                                            } else {

                                                                alert(
                                                                    "Food details are not available."
                                                                );

                                                            }

                                                        }}
                                                    >
                                                        View Food
                                                    </button>

                                                    <button
                                                        style={
                                                            styles.removeButton
                                                        }
                                                        onClick={() =>
                                                            removeWishlist(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

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
// STYLES
// =============================================================

const styles = {

    page: {
        minHeight:
            "calc(100vh - 70px)",
        background:
            "#f7f8fa",
        padding:
            "40px 20px"
    },

    container: {
        maxWidth:
            "1200px",
        margin:
            "0 auto"
    },

    header: {
        display:
            "flex",
        justifyContent:
            "space-between",
        alignItems:
            "center",
        gap:
            "20px",
        marginBottom:
            "30px",
        flexWrap:
            "wrap"
    },

    title: {
        margin:
            0,
        fontSize:
            "32px"
    },

    subtitle: {
        color:
            "#777",
        marginTop:
            "8px"
    },

    continueButton: {
        border:
            "none",
        background:
            "#222",
        color:
            "#fff",
        padding:
            "12px 20px",
        borderRadius:
            "8px",
        cursor:
            "pointer"
    },

    grid: {
        display:
            "grid",
        gridTemplateColumns:
            "repeat(auto-fill, minmax(250px, 1fr))",
        gap:
            "25px"
    },

    card: {
        background:
            "#fff",
        borderRadius:
            "15px",
        overflow:
            "hidden",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)"
    },

    image: {
        width:
            "100%",
        height:
            "190px",
        objectFit:
            "cover"
    },

    cardBody: {
        padding:
            "18px"
    },

    foodName: {
        margin:
            "0 0 10px"
    },

    price: {
        fontSize:
            "20px",
        fontWeight:
            "700",
        color:
            "#ff5722",
        marginBottom:
            "18px"
    },

    actions: {
        display:
            "flex",
        gap:
            "10px"
    },

    viewButton: {
        flex:
            1,
        border:
            "none",
        background:
            "#ff5722",
        color:
            "#fff",
        padding:
            "10px",
        borderRadius:
            "7px",
        cursor:
            "pointer"
    },

    removeButton: {
        flex:
            1,
        border:
            "1px solid #ddd",
        background:
            "#fff",
        color:
            "#d32f2f",
        padding:
            "10px",
        borderRadius:
            "7px",
        cursor:
            "pointer"
    },

    empty: {
        background:
            "#fff",
        padding:
            "70px 20px",
        textAlign:
            "center",
        borderRadius:
            "15px"
    },

    emptyIcon: {
        fontSize:
            "70px",
        color:
            "#ff5722"
    },

    primaryButton: {
        marginTop:
            "15px",
        border:
            "none",
        background:
            "#ff5722",
        color:
            "#fff",
        padding:
            "12px 25px",
        borderRadius:
            "8px",
        cursor:
            "pointer"
    },

    error: {
        background:
            "#ffe6e6",
        color:
            "#c62828",
        padding:
            "15px",
        borderRadius:
            "8px",
        marginBottom:
            "20px"
    },

    loginButton: {
        marginTop:
            "12px",
        padding:
            "10px 18px",
        border:
            "none",
        borderRadius:
            "7px",
        background:
            "#ff5722",
        color:
            "#fff",
        cursor:
            "pointer"
    },

    center: {
        minHeight:
            "70vh",
        display:
            "flex",
        justifyContent:
            "center",
        alignItems:
            "center"
    }
};

export default Wishlist;
