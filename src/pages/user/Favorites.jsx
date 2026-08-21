import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/ApiService";

function Favorites() {
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login to view your favorites."
                );
                return;
            }

            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const userId =
                user.id ||
                user.userId ||
                user.user?.id;

            if (!userId) {
                setError(
                    "User information is missing. Please login again."
                );
                return;
            }

            console.log(
                "❤️ Loading favorites for user:",
                userId
            );

            const response =
                await API.get(
                    `/favorites/user/${userId}`
                );

            setFavorites(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {
            console.error(
                "❌ Unable to load favorites:",
                err
            );

            if (
                err.response?.status === 401
            ) {
                setError(
                    "Your session has expired. Please login again."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    err.response?.data ||
                    "Unable to load favorites."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFavorites();
    }, []);

    const removeFavorite = async (id) => {
        try {
            await API.delete(
                `/favorites/${id}`
            );

            setFavorites(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.id !== id
                    )
            );

        } catch (err) {
            console.error(
                "Remove favorite error:",
                err
            );

            alert(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to remove favorite."
            );
        }
    };

    const getFoodId = (item) =>
        item.foodId ||
        item.food?.id;

    const getFoodName = (item) =>
        item.foodName ||
        item.food?.foodName ||
        item.name ||
        item.food?.name ||
        "Food Item";

    const getPrice = (item) =>
        item.price ??
        item.food?.price ??
        0;

    const getImage = (item) =>
        item.image ||
        item.food?.image ||
        "https://via.placeholder.com/400x250?text=Food";

    if (loading) {
        return (
            <div style={styles.center}>
                <h3>Loading favorites...</h3>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>
                            ❤️ My Favorites
                        </h1>

                        <p style={styles.subtitle}>
                            Your favorite food items
                        </p>
                    </div>

                    <button
                        style={styles.backButton}
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        ← Continue Shopping
                    </button>
                </div>

                {error && (
                    <div style={styles.error}>
                        <div>
                            {error}
                        </div>

                        {error.includes("login") && (
                            <button
                                style={styles.loginButton}
                                onClick={() =>
                                    navigate(
                                        "/login",
                                        {
                                            state: {
                                                from: "/favorites"
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

                {!error &&
                    favorites.length === 0 && (
                        <div style={styles.empty}>
                            <div
                                style={
                                    styles.emptyIcon
                                }
                            >
                                ❤️
                            </div>

                            <h2>
                                No Favorites Yet
                            </h2>

                            <p>
                                Add your favorite
                                foods and find them
                                here.
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

                {!error &&
                    favorites.length > 0 && (
                        <div style={styles.grid}>
                            {favorites.map(
                                (item) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        style={
                                            styles.card
                                        }
                                    >
                                        <img
                                            src={getImage(
                                                item
                                            )}
                                            alt={getFoodName(
                                                item
                                            )}
                                            style={
                                                styles.image
                                            }
                                        />

                                        <div
                                            style={
                                                styles.cardBody
                                            }
                                        >
                                            <h3>
                                                {getFoodName(
                                                    item
                                                )}
                                            </h3>

                                            <div
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
                                            </div>

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
                                                        const foodId =
                                                            getFoodId(
                                                                item
                                                            );

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
                                                    View
                                                </button>

                                                <button
                                                    style={
                                                        styles.removeButton
                                                    }
                                                    onClick={() =>
                                                        removeFavorite(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "calc(100vh - 70px)",
        background: "#f7f8fa",
        padding: "35px 20px"
    },

    container: {
        maxWidth: "1200px",
        margin: "auto"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        gap: "20px",
        flexWrap: "wrap"
    },

    title: {
        margin: 0
    },

    subtitle: {
        color: "#777"
    },

    backButton: {
        border: "none",
        padding: "12px 18px",
        borderRadius: "8px",
        background: "#222",
        color: "#fff",
        cursor: "pointer"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fill,minmax(250px,1fr))",
        gap: "25px"
    },

    card: {
        background: "#fff",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)"
    },

    image: {
        width: "100%",
        height: "190px",
        objectFit: "cover"
    },

    cardBody: {
        padding: "18px"
    },

    price: {
        fontSize: "20px",
        fontWeight: "700",
        color: "#ff5722",
        margin: "10px 0 15px"
    },

    actions: {
        display: "flex",
        gap: "10px"
    },

    viewButton: {
        flex: 1,
        padding: "10px",
        border: "none",
        borderRadius: "7px",
        background: "#ff5722",
        color: "#fff",
        cursor: "pointer"
    },

    removeButton: {
        flex: 1,
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "7px",
        background: "#fff",
        color: "#d32f2f",
        cursor: "pointer"
    },

    empty: {
        background: "#fff",
        padding: "70px 20px",
        textAlign: "center",
        borderRadius: "15px"
    },

    emptyIcon: {
        fontSize: "60px"
    },

    primaryButton: {
        marginTop: "15px",
        padding: "12px 25px",
        border: "none",
        borderRadius: "8px",
        background: "#ff5722",
        color: "#fff",
        cursor: "pointer"
    },

    error: {
        background: "#ffe6e6",
        color: "#c62828",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px"
    },

    loginButton: {
        marginTop: "12px",
        padding: "10px 18px",
        border: "none",
        borderRadius: "7px",
        background: "#ff5722",
        color: "#fff",
        cursor: "pointer"
    },

    center: {
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }
};

export default Favorites;

