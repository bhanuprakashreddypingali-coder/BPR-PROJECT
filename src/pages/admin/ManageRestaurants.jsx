import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

const ManageRestaurants = () => {

    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await ApiService.getRestaurants();

            setRestaurants(data || []);

        } catch (err) {

            console.error(
                "Failed to load restaurants:",
                err
            );

            setError(
                "Unable to load restaurants."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        Manage Restaurants
                    </h1>

                    <p style={styles.subtitle}>
                        View and manage all registered restaurants
                    </p>
                </div>

                <button
                    onClick={loadRestaurants}
                    style={styles.refreshButton}
                >
                    🔄 Refresh
                </button>

            </div>

            {loading && (
                <div style={styles.message}>
                    Loading restaurants...
                </div>
            )}

            {error && (
                <div style={styles.error}>
                    ⚠️ {error}
                </div>
            )}

            {!loading && !error && restaurants.length === 0 && (
                <div style={styles.message}>
                    No restaurants found.
                </div>
            )}

            {!loading && restaurants.length > 0 && (

                <div style={styles.grid}>

                    {restaurants.map((restaurant) => (

                        <div
                            key={restaurant.id}
                            style={styles.card}
                        >

                            {restaurant.image ? (

                                <img
                                    src={restaurant.image}
                                    alt={restaurant.restaurantName}
                                    style={styles.image}
                                />

                            ) : (

                                <div style={styles.noImage}>
                                    🍽️
                                </div>
                            )}

                            <div style={styles.cardBody}>

                                <h2 style={styles.restaurantName}>
                                    {restaurant.restaurantName}
                                </h2>

                                <p>
                                    👤 <strong>Owner:</strong>{" "}
                                    {restaurant.ownerName || "N/A"}
                                </p>

                                <p>
                                    📞 <strong>Phone:</strong>{" "}
                                    {restaurant.phone || "N/A"}
                                </p>

                                <p>
                                    📍 <strong>Address:</strong>{" "}
                                    {restaurant.address || "N/A"}
                                </p>

                                <div style={styles.timeRow}>

                                    <span>
                                        🕐{" "}
                                        <strong>Open:</strong>{" "}
                                        {restaurant.openingTime || "N/A"}
                                    </span>

                                    <span>
                                        🕐{" "}
                                        <strong>Close:</strong>{" "}
                                        {restaurant.closingTime || "N/A"}
                                    </span>

                                </div>

                                <p>
                                    ⭐ <strong>Rating:</strong>{" "}
                                    {restaurant.rating ?? "N/A"}
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admin/restaurants/${restaurant.id}`
                                        )
                                    }
                                    style={styles.detailsButton}
                                >
                                    View Full Details →
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
};

const styles = {

    page: {
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
    },

    title: {
        fontSize: "36px",
        margin: 0
    },

    subtitle: {
        color: "#666",
        fontSize: "17px"
    },

    refreshButton: {
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fill, minmax(330px, 1fr))",
        gap: "25px"
    },

    card: {
        background: "white",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
    },

    image: {
        width: "100%",
        height: "200px",
        objectFit: "cover"
    },

    noImage: {
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "60px",
        background: "#eee"
    },

    cardBody: {
        padding: "20px"
    },

    restaurantName: {
        marginTop: 0,
        fontSize: "24px"
    },

    timeRow: {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
        margin: "15px 0"
    },

    detailsButton: {
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px"
    },

    message: {
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        textAlign: "center"
    },

    error: {
        padding: "15px",
        marginBottom: "20px",
        borderRadius: "8px",
        background: "#ffe5e5",
        color: "#c00"
    }
};

export default ManageRestaurants;