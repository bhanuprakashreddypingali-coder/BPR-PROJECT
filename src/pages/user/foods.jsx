import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerService from "../../services/CustomerService";
import API from "../../services/ApiService";
import "./Foods.css";

function Foods() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [foods, setFoods] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);

    const [favoriteIds, setFavoriteIds] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);

    const [favoriteLoading, setFavoriteLoading] = useState({});
    const [wishlistLoading, setWishlistLoading] = useState({});
    const [cartLoading, setCartLoading] = useState({});

    // =========================================================
    // CATEGORY CONFIG
    // =========================================================

    const categoryInfo = {
        BIRYANIS: {
            name: "Biryanis",
            icon: "🍗"
        },
        ROTIS: {
            name: "Rotis & Breads",
            icon: "🫓"
        },
        VEG_CURRIES: {
            name: "Veg Curries",
            icon: "🥦"
        },
        NON_VEG_CURRIES: {
            name: "Non-Veg Curries",
            icon: "🍗"
        },
        RICE: {
            name: "Rice & Meals",
            icon: "🍚"
        },
        STARTERS: {
            name: "Starters",
            icon: "🍟"
        },
        FAMILY_PACK: {
            name: "Family Packs",
            icon: "👨‍👩‍👧‍👦"
        },
        COMBOS: {
            name: "Combos",
            icon: "🎁"
        },
        DRINKS: {
            name: "Drinks",
            icon: "🥤"
        },
        WATER: {
            name: "Water",
            icon: "💧"
        },
        DESSERTS: {
            name: "Desserts",
            icon: "🍨"
        },
        SALADS: {
            name: "Salads & Sides",
            icon: "🥗"
        }
    };

    // =========================================================
    // NORMALIZE CATEGORY
    // =========================================================

    const normalizeCategory = (category) => {
        if (!category) {
            return "OTHER";
        }

        return String(category)
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_");
    };

    // =========================================================
    // LOAD FOODS
    // =========================================================

    useEffect(() => {
        loadFoods();
    }, [id]);

    const loadFoods = async () => {
        try {
            setLoading(true);

            const response =
                await CustomerService.getFoodsByRestaurant(id);

            setFoods(response.data || []);
        } catch (error) {
            console.error("Error loading foods:", error);
            setFoods([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // GET USER
    // =========================================================

    const getCurrentUser = () => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            return user;
        } catch {
            return null;
        }
    };

    // =========================================================
    // LOGIN CHECK
    // =========================================================

    const requireLogin = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login to use this feature.");

            navigate("/login", {
                state: {
                    from: `/restaurants/${id}`
                }
            });

            return false;
        }

        return true;
    };

    // =========================================================
    // LOAD FAVORITES
    // =========================================================

    useEffect(() => {
        loadFavorites();
        loadWishlist();
    }, []);

    const loadFavorites = async () => {
        /*
         * Do not call /favorites/user/{id} here.
         *
         * Favorites are maintained locally on this page.
         * This prevents the frontend from making the request
         * that was returning 403.
         */
        setFavoriteIds([]);
    };

    // =========================================================
    // LOAD WISHLIST
    // =========================================================

    const loadWishlist = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            /*
             * Wishlist state is maintained immediately after
             * add/remove from this page.
             */
        } catch (error) {
            console.error(
                "Unable to load wishlist:",
                error
            );
        }
    };

    // =========================================================
    // ADD TO CART
    // =========================================================

    const addToCart = async (food) => {
        if (!requireLogin()) {
            return;
        }

        if (!food.available) {
            alert("This food is currently unavailable.");
            return;
        }

        try {
            setCartLoading((previous) => ({
                ...previous,
                [food.id]: true
            }));

            await CustomerService.addToCart({
                foodId: food.id,
                quantity: 1
            });

            alert(
                `${food.foodName} added to cart.`
            );

            navigate("/cart");
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("role");

                alert(
                    "Your session has expired. Please login again."
                );

                navigate("/login");
                return;
            }

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to add food to cart."
            );
        } finally {
            setCartLoading((previous) => ({
                ...previous,
                [food.id]: false
            }));
        }
    };

    // =========================================================
    // ADD FAVORITE
    // =========================================================

    const toggleFavorite = async (food) => {
        if (!requireLogin()) {
            return;
        }

        const user = getCurrentUser();

        if (!user?.id) {
            alert(
                "User information not found. Please login again."
            );
            return;
        }

        const isFavorite =
            favoriteIds.includes(food.id);

        try {
            setFavoriteLoading((previous) => ({
                ...previous,
                [food.id]: true
            }));

            // -----------------------------------------------
            // REMOVE FAVORITE
            // -----------------------------------------------

            if (isFavorite) {
                /*
                 * Backend DELETE requires favorite record ID,
                 * not food ID.
                 *
                 * Keep the existing frontend behavior.
                 */
                alert(
                    "This item is already in Favorites. Remove it from the Favorites page."
                );

                return;
            }

            // -----------------------------------------------
            // ADD FAVORITE
            // -----------------------------------------------

            await API.post(
                "/favorites",
                {
                    userId: user.id,
                    foodId: food.id
                }
            );

            setFavoriteIds((previous) => [
                ...previous,
                food.id
            ]);

            alert(
                `${food.foodName} added to Favorites ❤️`
            );
        } catch (error) {
            console.error(
                "Favorite error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data;

            if (
                String(message || "")
                    .toLowerCase()
                    .includes("already")
            ) {
                setFavoriteIds((previous) =>
                    previous.includes(food.id)
                        ? previous
                        : [...previous, food.id]
                );

                alert(
                    `${food.foodName} is already in Favorites.`
                );

                return;
            }

            alert(
                message ||
                "Unable to update Favorites."
            );
        } finally {
            setFavoriteLoading((previous) => ({
                ...previous,
                [food.id]: false
            }));
        }
    };

    // =========================================================
    // ADD WISHLIST
    // =========================================================

    const toggleWishlist = async (food) => {
        if (!requireLogin()) {
            return;
        }

        const isWishlist =
            wishlistIds.includes(food.id);

        if (isWishlist) {
            alert(
                "This item is already in your Wishlist. Remove it from the Wishlist page."
            );
            return;
        }

        try {
            setWishlistLoading((previous) => ({
                ...previous,
                [food.id]: true
            }));

            /*
             * IMPORTANT:
             *
             * The backend expects foodId as a REQUEST PARAMETER,
             * not as a JSON request body.
             *
             * Therefore:
             *
             * POST /api/wishlist?foodId=123
             */
            await API.post(
                `/wishlist?foodId=${food.id}`
            );

            setWishlistIds((previous) => [
                ...previous,
                food.id
            ]);

            alert(
                `${food.foodName} added to Wishlist ♡`
            );
        } catch (error) {
            console.error(
                "Wishlist error:",
                error
            );

            const message =
                error.response?.data?.message ||
                error.response?.data;

            if (
                String(message || "")
                    .toLowerCase()
                    .includes("already exists")
            ) {
                setWishlistIds((previous) =>
                    previous.includes(food.id)
                        ? previous
                        : [...previous, food.id]
                );

                alert(
                    `${food.foodName} is already in your Wishlist.`
                );

                return;
            }

            alert(
                message ||
                "Unable to add food to Wishlist."
            );
        } finally {
            setWishlistLoading((previous) => ({
                ...previous,
                [food.id]: false
            }));
        }
    };

    // =========================================================
    // CATEGORIES
    // =========================================================

    const categories = useMemo(() => {
        const categorySet = new Set();

        foods.forEach((food) => {
            if (food.category) {
                categorySet.add(
                    normalizeCategory(food.category)
                );
            }
        });

        return Array.from(categorySet);
    }, [foods]);

    const getCategoryName = (category) => {
        if (categoryInfo[category]) {
            return categoryInfo[category].name;
        }

        return category
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const getCategoryIcon = (category) => {
        if (categoryInfo[category]) {
            return categoryInfo[category].icon;
        }

        return "🍽️";
    };

    const getCategoryCount = (category) => {
        if (category === "ALL") {
            return foods.length;
        }

        return foods.filter(
            (food) =>
                normalizeCategory(food.category) ===
                category
        ).length;
    };

    // =========================================================
    // FILTER
    // =========================================================

    const filteredFoods = useMemo(() => {
        const searchText =
            search.trim().toLowerCase();

        return foods.filter((food) => {
            const foodCategory =
                normalizeCategory(food.category);

            const matchesCategory =
                selectedCategory === "ALL" ||
                foodCategory === selectedCategory;

            const foodName =
                food.foodName?.toLowerCase() || "";

            const description =
                food.description?.toLowerCase() || "";

            const category =
                food.category?.toLowerCase() || "";

            const matchesSearch =
                !searchText ||
                foodName.includes(searchText) ||
                description.includes(searchText) ||
                category.includes(searchText);

            return (
                matchesCategory &&
                matchesSearch
            );
        });
    }, [
        foods,
        search,
        selectedCategory
    ]);

    // =========================================================
    // GROUP FOODS
    // =========================================================

    const groupedFoods = useMemo(() => {
        const groups = {};

        filteredFoods.forEach((food) => {
            const category =
                normalizeCategory(food.category);

            if (!groups[category]) {
                groups[category] = [];
            }

            groups[category].push(food);
        });

        return groups;
    }, [filteredFoods]);

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="foods-loading">
                <div className="foods-spinner"></div>

                <h3>
                    Loading restaurant menu...
                </h3>

                <p>
                    Please wait while we prepare the menu.
                </p>
            </div>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div className="foods-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="foods-hero">

                <div>
                    <span className="foods-kicker">
                        BPR FLAVORS HUB
                    </span>

                    <h1>
                        Explore Our Menu
                    </h1>

                    <p>
                        Discover delicious dishes prepared
                        fresh for you.
                    </p>
                </div>

                <button
                    className="view-cart-button"
                    onClick={() => navigate("/cart")}
                >
                    🛒 View Cart
                </button>

            </section>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="foods-search-card">

                <div className="foods-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search food, category..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>
                    )}

                </div>

            </div>

            {/* =================================================
                CATEGORY FILTER
            ================================================= */}

            <section className="category-section">

                <div className="section-heading">

                    <div>
                        <span className="small-label">
                            MENU
                        </span>

                        <h2>
                            Food Categories
                        </h2>
                    </div>

                    <span className="food-count">
                        {filteredFoods.length} foods
                    </span>

                </div>

                <div className="category-list">

                    <button
                        className={
                            selectedCategory === "ALL"
                                ? "category-button active"
                                : "category-button"
                        }
                        onClick={() =>
                            setSelectedCategory("ALL")
                        }
                    >
                        <span>🍽️</span>

                        All

                        <b>
                            {getCategoryCount("ALL")}
                        </b>
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category}
                            className={
                                selectedCategory === category
                                    ? "category-button active"
                                    : "category-button"
                            }
                            onClick={() =>
                                setSelectedCategory(category)
                            }
                        >
                            <span>
                                {getCategoryIcon(category)}
                            </span>

                            {getCategoryName(category)}

                            <b>
                                {getCategoryCount(category)}
                            </b>
                        </button>
                    ))}

                </div>

            </section>

            {/* =================================================
                FOOD LIST
            ================================================= */}

            {filteredFoods.length === 0 ? (

                <div className="empty-foods">

                    <div className="empty-icon">
                        🍽️
                    </div>

                    <h2>
                        No Foods Found
                    </h2>

                    <p>
                        Try another food name or category.
                    </p>

                    <button
                        onClick={() => {
                            setSearch("");
                            setSelectedCategory("ALL");
                        }}
                    >
                        Show All Foods
                    </button>

                </div>

            ) : (

                Object.entries(groupedFoods).map(
                    ([category, categoryFoods]) => (

                        <section
                            className="food-category-section"
                            key={category}
                        >

                            <div className="food-category-heading">

                                <div>
                                    <span className="category-icon">
                                        {getCategoryIcon(category)}
                                    </span>

                                    <h2>
                                        {getCategoryName(category)}
                                    </h2>
                                </div>

                                <span>
                                    {categoryFoods.length} items
                                </span>

                            </div>

                            <div className="food-grid">

                                {categoryFoods.map((food) => {

                                    const isFavorite =
                                        favoriteIds.includes(
                                            food.id
                                        );

                                    const isWishlist =
                                        wishlistIds.includes(
                                            food.id
                                        );

                                    return (
                                        <article
                                            className="food-card"
                                            key={food.id}
                                        >

                                            {/* IMAGE */}

                                            <div className="food-image-wrapper">

                                                <img
                                                    src={
                                                        food.image ||
                                                        "https://via.placeholder.com/600x400?text=Food"
                                                    }
                                                    alt={
                                                        food.foodName ||
                                                        "Food"
                                                    }
                                                    onError={(e) => {
                                                        e.currentTarget.onerror =
                                                            null;

                                                        e.currentTarget.src =
                                                            "https://via.placeholder.com/600x400?text=Food";
                                                    }}
                                                />

                                                <div className="food-image-overlay"></div>

                                                {/* AVAILABILITY */}

                                                <span
                                                    className={
                                                        food.available
                                                            ? "availability available"
                                                            : "availability unavailable"
                                                    }
                                                >
                                                    {food.available
                                                        ? "● Available"
                                                        : "● Unavailable"}
                                                </span>

                                                {/* FAVORITE */}

                                                <button
                                                    className={
                                                        isFavorite
                                                            ? "heart-button active"
                                                            : "heart-button"
                                                    }
                                                    onClick={() =>
                                                        toggleFavorite(
                                                            food
                                                        )
                                                    }
                                                    disabled={
                                                        favoriteLoading[
                                                            food.id
                                                        ]
                                                    }
                                                    title="Favorite"
                                                >
                                                    {isFavorite
                                                        ? "❤️"
                                                        : "🤍"}
                                                </button>

                                            </div>

                                            {/* DETAILS */}

                                            <div className="food-content">

                                                <div className="food-title-row">

                                                    <h3>
                                                        {food.foodName}
                                                    </h3>

                                                    <span className="food-price">
                                                        ₹{food.price}
                                                    </span>

                                                </div>

                                                <p className="food-description">
                                                    {food.description ||
                                                        "Delicious food prepared fresh for you."}
                                                </p>

                                                <div className="food-meta">

                                                    <span>
                                                        {getCategoryIcon(
                                                            normalizeCategory(
                                                                food.category
                                                            )
                                                        )}

                                                        {" "}

                                                        {getCategoryName(
                                                            normalizeCategory(
                                                                food.category
                                                            )
                                                        )}
                                                    </span>

                                                </div>

                                                {/* ACTIONS */}

                                                <div className="food-actions">

                                                    <button
                                                        className="add-cart-button"
                                                        disabled={
                                                            !food.available ||
                                                            cartLoading[
                                                                food.id
                                                            ]
                                                        }
                                                        onClick={() =>
                                                            addToCart(
                                                                food
                                                            )
                                                        }
                                                    >
                                                        {cartLoading[
                                                            food.id
                                                        ]
                                                            ? "Adding..."
                                                            : "🛒 Add To Cart"}
                                                    </button>

                                                    <button
                                                        className={
                                                            isWishlist
                                                                ? "wishlist-button active"
                                                                : "wishlist-button"
                                                        }
                                                        disabled={
                                                            wishlistLoading[
                                                                food.id
                                                            ]
                                                        }
                                                        onClick={() =>
                                                            toggleWishlist(
                                                                food
                                                            )
                                                        }
                                                        title="Wishlist"
                                                    >
                                                        {isWishlist
                                                            ? "♥"
                                                            : "♡"}
                                                    </button>

                                                </div>

                                            </div>

                                        </article>
                                    );
                                })}

                            </div>

                        </section>
                    )
                )

            )}

        </div>
    );
}

export default Foods;