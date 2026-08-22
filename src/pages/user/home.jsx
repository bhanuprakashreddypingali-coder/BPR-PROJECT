import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import "./home.css";

// =========================================================
// PRODUCTION BACKEND
// =========================================================

const API_URL =
    "https://bpr-backend-production-3381.up.railway.app";

// =========================================================
// HOME
// =========================================================

function Home() {

    const navigate = useNavigate();

    const [restaurants, setRestaurants] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =========================================================
    // LOAD RESTAURANTS
    // =========================================================

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/restaurants`
                );

            if (!response.ok) {

                throw new Error(
                    `Failed to load restaurants (${response.status})`
                );
            }

            const data =
                await response.json();

            if (Array.isArray(data)) {

                setRestaurants(data);

            } else if (
                Array.isArray(data?.content)
            ) {

                setRestaurants(
                    data.content
                );

            } else {

                setRestaurants([]);
            }

        } catch (err) {

            console.error(
                "Restaurant loading error:",
                err
            );

            setError(
                "Unable to load restaurants."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // RESTAURANT IMAGE
    // =========================================================

    const getRestaurantImage = (
        restaurant
    ) => {

        const defaultImage =
            "https://images.unsplash.com/" +
            "photo-1517248135467-4c7edcad34c4" +
            "?auto=format&fit=crop&w=900&q=80";

        if (!restaurant?.image) {
            return defaultImage;
        }

        if (
            restaurant.image.startsWith("http://") ||
            restaurant.image.startsWith("https://")
        ) {
            return restaurant.image;
        }

        if (
            restaurant.image.startsWith("/")
        ) {
            return `${API_URL}${restaurant.image}`;
        }

        return `${API_URL}/${restaurant.image}`;
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredRestaurants =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return restaurants;
            }

            return restaurants.filter(
                (restaurant) => {

                    const name =
                        restaurant.restaurantName ||
                        "";

                    const address =
                        restaurant.address ||
                        "";

                    const description =
                        restaurant.description ||
                        "";

                    return (
                        name
                            .toLowerCase()
                            .includes(keyword) ||

                        address
                            .toLowerCase()
                            .includes(keyword) ||

                        description
                            .toLowerCase()
                            .includes(keyword)
                    );
                }
            );

        }, [
            restaurants,
            search
        ]);

    // =========================================================
    // TIME TO MINUTES
    // =========================================================

    const convertTimeToMinutes = (
        time
    ) => {

        if (!time) {
            return null;
        }

        const value =
            String(time).trim();

        const parts =
            value.split(":");

        if (parts.length < 2) {
            return null;
        }

        const hours =
            Number(parts[0]);

        const minutes =
            Number(parts[1]);

        if (
            Number.isNaN(hours) ||
            Number.isNaN(minutes)
        ) {
            return null;
        }

        return (
            hours * 60 +
            minutes
        );
    };

    // =========================================================
    // RESTAURANT OPEN STATUS
    // =========================================================

    const isRestaurantOpen = (
        restaurant
    ) => {

        const opening =
            convertTimeToMinutes(
                restaurant?.openingTime
            );

        const closing =
            convertTimeToMinutes(
                restaurant?.closingTime
            );

        if (
            opening === null ||
            closing === null
        ) {
            return true;
        }

        const now =
            new Date();

        const currentMinutes =
            now.getHours() * 60 +
            now.getMinutes();

        if (opening < closing) {

            return (
                currentMinutes >= opening &&
                currentMinutes < closing
            );
        }

        if (opening > closing) {

            return (
                currentMinutes >= opening ||
                currentMinutes < closing
            );
        }

        return true;
    };

    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (
        time
    ) => {

        if (!time) {
            return "Not available";
        }

        const value =
            String(time);

        const parts =
            value.split(":");

        if (parts.length < 2) {
            return value;
        }

        let hour =
            Number(parts[0]);

        const minute =
            parts[1];

        if (
            Number.isNaN(hour)
        ) {
            return value;
        }

        const suffix =
            hour >= 12
                ? "PM"
                : "AM";

        hour =
            hour % 12;

        if (hour === 0) {
            hour = 12;
        }

        return `${hour}:${minute} ${suffix}`;
    };

    // =========================================================
    // RATING
    // =========================================================

    const getRating = (
        restaurant
    ) => {

        const rating =
            Number(
                restaurant?.rating
            );

        if (
            Number.isNaN(rating)
        ) {
            return "0.0";
        }

        return rating.toFixed(1);
    };

    // =========================================================
    // GET RESTAURANT ID
    // =========================================================

    const getRestaurantId = (
        restaurant
    ) => {

        return (
            restaurant?.id ||
            restaurant?.restaurantId
        );
    };

    // =========================================================
    // VIEW DETAILS
    // =========================================================

    const handleViewDetails = (
        restaurant
    ) => {

        const restaurantId =
            getRestaurantId(
                restaurant
            );

        if (!restaurantId) {

            console.error(
                "Restaurant ID missing:",
                restaurant
            );

            alert(
                "Restaurant details are unavailable."
            );

            return;
        }

        navigate(
            `/restaurant/${restaurantId}`
        );
    };

    // =========================================================
    // VIEW MENU
    // CUSTOMER ONLY
    // =========================================================

    const handleViewMenu = (
        restaurant
    ) => {

        const restaurantId =
            getRestaurantId(
                restaurant
            );

        if (!restaurantId) {

            console.error(
                "Restaurant ID missing:",
                restaurant
            );

            alert(
                "Restaurant menu is unavailable."
            );

            return;
        }

        // IMPORTANT:
        // Customer View Menu uses the dedicated
        // customer menu route.

        navigate(
            `/customer/menu/${restaurantId}`
        );
    };

    // =========================================================
    // RETRY
    // =========================================================

    const handleRetry = () => {
        fetchRestaurants();
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="home-page">

                <div className="home-loading">

                    <div className="home-spinner"></div>

                    <p>
                        Loading restaurants...
                    </p>

                </div>

            </div>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="home-page">

            {/* HERO */}

            <section className="home-hero">

                <div className="hero-content">

                    <span className="hero-small-title">
                        BPR FLAVORS HUB
                    </span>

                    <h1>
                        Delicious food,
                        <br />
                        <span>
                            delivered to you.
                        </span>
                    </h1>

                    <p>
                        Discover the best restaurants
                        and order your favorite food.
                    </p>

                    {/* SEARCH */}

                    <div className="restaurant-search">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search restaurants or cuisines..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                        {search && (

                            <button
                                type="button"
                                className="clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>

                        )}

                    </div>

                </div>

            </section>

            {/* RESTAURANTS */}

            <section className="restaurants-section">

                <div className="restaurants-heading">

                    <div>

                        <h2>
                            Restaurants Near You
                        </h2>

                        <p>
                            Discover delicious food
                            from the best restaurants
                            around you.
                        </p>

                    </div>

                    <div className="restaurant-count">

                        {filteredRestaurants.length}{" "}

                        {
                            filteredRestaurants.length === 1
                                ? "restaurant"
                                : "restaurants"
                        }

                    </div>

                </div>

                {/* ERROR */}

                {error && (

                    <div className="home-error">

                        <div className="error-icon">
                            ⚠️
                        </div>

                        <h3>
                            Unable to load restaurants
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={handleRetry}
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* NO RESTAURANTS */}

                {!error &&
                    filteredRestaurants.length === 0 && (

                        <div className="no-restaurants">

                            <div className="no-restaurant-icon">
                                🍽️
                            </div>

                            <h3>
                                No restaurants found
                            </h3>

                            <p>
                                Try searching with
                                a different restaurant
                                name.
                            </p>

                            {search && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    Clear Search
                                </button>

                            )}

                        </div>
                    )}

                {/* RESTAURANT GRID */}

                {!error &&
                    filteredRestaurants.length > 0 && (

                        <div className="restaurant-grid">

                            {filteredRestaurants.map(
                                (restaurant) => {

                                    const isOpen =
                                        isRestaurantOpen(
                                            restaurant
                                        );

                                    return (

                                        <article
                                            className="restaurant-card"
                                            key={
                                                getRestaurantId(
                                                    restaurant
                                                )
                                            }
                                        >

                                            {/* IMAGE */}

                                            <div className="restaurant-image-wrapper">

                                                <img
                                                    src={
                                                        getRestaurantImage(
                                                            restaurant
                                                        )
                                                    }
                                                    alt={
                                                        restaurant.restaurantName ||
                                                        "Restaurant"
                                                    }
                                                    className={
                                                        isOpen
                                                            ? "restaurant-image"
                                                            : "restaurant-image closed-image"
                                                    }
                                                    onError={(event) => {

                                                        event.currentTarget.src =
                                                            "https://images.unsplash.com/" +
                                                            "photo-1517248135467-4c7edcad34c4" +
                                                            "?auto=format&fit=crop&w=900&q=80";

                                                    }}
                                                />

                                                <div
                                                    className={
                                                        isOpen
                                                            ? "restaurant-status open-status"
                                                            : "restaurant-status closed-status"
                                                    }
                                                >

                                                    <span className="status-circle" />

                                                    {
                                                        isOpen
                                                            ? "OPEN"
                                                            : "CLOSED"
                                                    }

                                                </div>

                                            </div>

                                            {/* CARD BODY */}

                                            <div className="restaurant-card-body">

                                                <div className="restaurant-name-row">

                                                    <h3>
                                                        {
                                                            restaurant.restaurantName ||
                                                            "Restaurant"
                                                        }
                                                    </h3>

                                                    <div className="rating">
                                                        ★{" "}
                                                        {
                                                            getRating(
                                                                restaurant
                                                            )
                                                        }
                                                    </div>

                                                </div>

                                                <p className="restaurant-description">

                                                    {
                                                        restaurant.description ||
                                                        "Delicious food and great service."
                                                    }

                                                </p>

                                                <div className="restaurant-address">

                                                    📍{" "}

                                                    {
                                                        restaurant.address ||
                                                        "Address not available"
                                                    }

                                                </div>

                                                <div className="restaurant-time-row">

                                                    <span>

                                                        🕐{" "}

                                                        {
                                                            formatTime(
                                                                restaurant.openingTime
                                                            )
                                                        }

                                                        {" - "}

                                                        {
                                                            formatTime(
                                                                restaurant.closingTime
                                                            )
                                                        }

                                                    </span>

                                                    <span
                                                        className={
                                                            isOpen
                                                                ? "open-text"
                                                                : "closed-text"
                                                        }
                                                    >

                                                        {
                                                            isOpen
                                                                ? "Open now"
                                                                : "Closed now"
                                                        }

                                                    </span>

                                                </div>

                                                {/* ACTION BUTTONS */}

                                                <div className="restaurant-buttons">

                                                    <button
                                                        type="button"
                                                        className="view-details-button"
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                restaurant
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="view-menu-button"
                                                        onClick={() =>
                                                            handleViewMenu(
                                                                restaurant
                                                            )
                                                        }
                                                    >
                                                        View Menu
                                                    </button>

                                                </div>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

            </section>

        </div>
    );
}

export default Home;