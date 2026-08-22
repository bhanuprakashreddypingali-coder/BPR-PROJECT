import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import API, {
    reviewApi
} from "../../services/ApiService";

import "./RestaurantDetails.css";

// =========================================================
// PRODUCTION BACKEND
// =========================================================

const BACKEND_URL =
    "https://bpr-backend-production-3381.up.railway.app";


function RestaurantDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] =
        useState(null);

    const [foods, setFoods] =
        useState([]);

    const [reviews, setReviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [foodLoading, setFoodLoading] =
        useState(true);

    const [reviewLoading, setReviewLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");

    const [searchFood, setSearchFood] =
        useState("");

    const [rating, setRating] =
        useState(5);

    const [comment, setComment] =
        useState("");

    const [reviewSubmitting, setReviewSubmitting] =
        useState(false);

    const [reviewMessage, setReviewMessage] =
        useState("");


    // =========================================================
    // LOAD
    // =========================================================

    useEffect(() => {

        if (!id) {
            return;
        }

        loadRestaurant();
        loadFoods();
        loadReviews();

    }, [id]);


    // =========================================================
    // RESTAURANT
    // =========================================================

    const loadRestaurant = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await API.get(
                    `/restaurants/${id}`
                );

            setRestaurant(
                response.data
            );

        } catch (err) {

            console.error(
                "RESTAURANT ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Failed to load restaurant."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // FOODS
    // =========================================================

    const loadFoods = async () => {

        try {

            setFoodLoading(true);

            const response =
                await API.get(
                    `/foods/restaurant/${id}`
                );

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            setFoods(data);

        } catch (err) {

            console.error(
                "FOODS ERROR:",
                err
            );

            setFoods([]);

        } finally {

            setFoodLoading(false);
        }
    };


    // =========================================================
    // REVIEWS
    // =========================================================

    const loadReviews = async () => {

        try {

            setReviewLoading(true);

            const response =
                await reviewApi.getRestaurantReviews(
                    id
                );

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            setReviews(data);

        } catch (err) {

            console.error(
                "REVIEWS ERROR:",
                err
            );

            setReviews([]);

        } finally {

            setReviewLoading(false);
        }
    };


    // =========================================================
    // OPEN STATUS
    // =========================================================

    const isRestaurantOpen = () => {

        if (!restaurant) {
            return false;
        }

        if (
            !restaurant.openingTime ||
            !restaurant.closingTime
        ) {
            return true;
        }

        try {

            const now = new Date();

            const currentMinutes =
                now.getHours() * 60 +
                now.getMinutes();

            const openingParts =
                restaurant.openingTime
                    .split(":")
                    .map(Number);

            const closingParts =
                restaurant.closingTime
                    .split(":")
                    .map(Number);

            const openingMinutes =
                openingParts[0] * 60 +
                openingParts[1];

            const closingMinutes =
                closingParts[0] * 60 +
                closingParts[1];

            if (
                openingMinutes <=
                closingMinutes
            ) {

                return (
                    currentMinutes >= openingMinutes &&
                    currentMinutes < closingMinutes
                );
            }

            return (
                currentMinutes >= openingMinutes ||
                currentMinutes < closingMinutes
            );

        } catch (err) {

            console.error(
                "OPEN STATUS ERROR:",
                err
            );

            return true;
        }
    };


    // =========================================================
    // CATEGORIES
    // =========================================================

    const categories = [
        "ALL",
        ...new Set(
            foods
                .map(
                    food =>
                        food.category
                )
                .filter(Boolean)
        )
    ];


    // =========================================================
    // FILTER
    // =========================================================

    const filteredFoods =
        foods.filter((food) => {

            const matchesCategory =
                selectedCategory === "ALL" ||
                food.category ===
                    selectedCategory;

            const foodName =
                food.foodName ||
                food.name ||
                "";

            const matchesSearch =
                foodName
                    .toLowerCase()
                    .includes(
                        searchFood
                            .toLowerCase()
                    );

            return (
                matchesCategory &&
                matchesSearch
            );
        });


    // =========================================================
    // FOOD IMAGE
    // =========================================================

    const getFoodImage = (food) => {

        const defaultImage =
            "https://images.unsplash.com/" +
            "photo-1546069901-ba9599a7e63c";

        const image =
            food?.image;

        if (!image) {
            return defaultImage;
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        if (image.startsWith("/")) {
            return `${BACKEND_URL}${image}`;
        }

        return `${BACKEND_URL}/${image}`;
    };


    // =========================================================
    // RESTAURANT IMAGE
    // =========================================================

    const getRestaurantImage = () => {

        const defaultImage =
            "https://images.unsplash.com/" +
            "photo-1517248135467-4c7edcad34c4";

        if (!restaurant?.image) {
            return defaultImage;
        }

        if (
            restaurant.image.startsWith("http://") ||
            restaurant.image.startsWith("https://")
        ) {
            return restaurant.image;
        }

        if (restaurant.image.startsWith("/")) {
            return `${BACKEND_URL}${restaurant.image}`;
        }

        return `${BACKEND_URL}/${restaurant.image}`;
    };


    // =========================================================
    // ADD CART
    // =========================================================

    const addToCart = async (food) => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert(
                "Please login to add food to cart."
            );

            navigate("/login");

            return;
        }

        try {

            await API.post(
                "/cart",
                {
                    foodId: food.id,
                    restaurantId:
                        restaurant.id,
                    quantity: 1
                }
            );

            alert(
                "Food added to cart successfully."
            );

        } catch (err) {

            console.error(
                "ADD CART ERROR:",
                err
            );

            alert(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Failed to add food to cart."
            );
        }
    };


    // =========================================================
    // SUBMIT REVIEW
    // =========================================================

    const submitReview = async (event) => {

        event.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert(
                "Please login to submit a review."
            );

            navigate("/login");

            return;
        }

        if (
            !rating ||
            rating < 1 ||
            rating > 5
        ) {

            setReviewMessage(
                "Please select a rating between 1 and 5."
            );

            return;
        }

        if (!comment.trim()) {

            setReviewMessage(
                "Please write a review."
            );

            return;
        }

        try {

            setReviewSubmitting(true);
            setReviewMessage("");

            await reviewApi.addReview({

                restaurantId:
                    Number(id),

                rating:
                    Number(rating),

                comment:
                    comment.trim()

            });

            setComment("");
            setRating(5);

            setReviewMessage(
                "Review submitted successfully!"
            );

            await loadReviews();
            await loadRestaurant();

        } catch (err) {

            console.error(
                "REVIEW ERROR:",
                err
            );

            const backendMessage =
                err?.response?.data?.message ||
                err?.response?.data;

            setReviewMessage(
                typeof backendMessage === "string"
                    ? backendMessage
                    : "Failed to submit review."
            );

        } finally {

            setReviewSubmitting(false);
        }
    };


    // =========================================================
    // STARS
    // =========================================================

    const renderStars = (value) => {

        const numericValue =
            Number(value || 0);

        const rounded =
            Math.round(numericValue);

        return (

            <div className="rating-stars">

                {[1, 2, 3, 4, 5].map(
                    star => (

                        <span
                            key={star}
                            className={
                                star <= rounded
                                    ? "star active"
                                    : "star"
                            }
                        >
                            ★
                        </span>
                    )
                )}

            </div>
        );
    };


    // =========================================================
    // REVIEW NAME
    // =========================================================

    const getReviewUserName =
        (review) => {

            return (
                review?.customerName ||
                review?.userName ||
                review?.fullName ||
                review?.name ||
                review?.user?.fullName ||
                review?.user?.name ||
                "Customer"
            );
        };


    // =========================================================
    // REVIEW DATE
    // =========================================================

    const getReviewDate =
        (review) => {

            if (!review?.createdAt) {
                return "";
            }

            try {

                return new Date(
                    review.createdAt
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

            } catch {
                return "";
            }
        };


    // =========================================================
    // REVIEW COMMENT
    // =========================================================

    const getReviewComment =
        (review) => {

            return (
                review?.comment ||
                review?.review ||
                review?.message ||
                ""
            );
        };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="restaurant-details-loading">

                <div className="loading-spinner" />

                <p>
                    Loading restaurant...
                </p>

            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (
        error ||
        !restaurant
    ) {

        return (

            <div className="restaurant-details-error">

                <h2>
                    Restaurant Not Found
                </h2>

                <p>
                    {error ||
                        "Restaurant does not exist."}
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    Go Home
                </button>

            </div>
        );
    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="restaurant-details-page">

            <div className="restaurant-top-bar">

                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Back
                </button>

            </div>


            {/* RESTAURANT HERO */}

            <section className="restaurant-hero">

                <div className="restaurant-image-wrapper">

                    <img
                        src={getRestaurantImage()}
                        alt={
                            restaurant.restaurantName ||
                            "Restaurant"
                        }
                        className="restaurant-main-image"
                        onError={(event) => {

                            event.currentTarget.src =
                                "https://images.unsplash.com/" +
                                "photo-1517248135467-4c7edcad34c4";

                        }}
                    />

                    <div
                        className={
                            isRestaurantOpen()
                                ? "restaurant-status open"
                                : "restaurant-status closed"
                        }
                    >
                        {
                            isRestaurantOpen()
                                ? "OPEN"
                                : "CLOSED"
                        }
                    </div>

                </div>


                <div className="restaurant-hero-info">

                    <h1>
                        {
                            restaurant.restaurantName ||
                            "Restaurant"
                        }
                    </h1>


                    <div className="restaurant-rating-row">

                        {renderStars(
                            restaurant.rating
                        )}

                        <strong>
                            {Number(
                                restaurant.rating || 0
                            ).toFixed(1)}
                        </strong>

                        <span>
                            (
                            {reviews.length}{" "}
                            {
                                reviews.length === 1
                                    ? "review"
                                    : "reviews"
                            }
                            )
                        </span>

                    </div>


                    {restaurant.description && (

                        <p className="restaurant-description">
                            {
                                restaurant.description
                            }
                        </p>

                    )}


                    <div className="restaurant-info-list">

                        {restaurant.address && (

                            <div className="restaurant-info-item">

                                <span>📍</span>

                                <span>
                                    {restaurant.address}
                                </span>

                            </div>
                        )}


                        {restaurant.phone && (

                            <div className="restaurant-info-item">

                                <span>📞</span>

                                <span>
                                    {restaurant.phone}
                                </span>

                            </div>
                        )}


                        {(
                            restaurant.openingTime ||
                            restaurant.closingTime
                        ) && (

                            <div className="restaurant-info-item">

                                <span>🕐</span>

                                <span>

                                    {
                                        restaurant.openingTime ||
                                        "--:--"
                                    }

                                    {" - "}

                                    {
                                        restaurant.closingTime ||
                                        "--:--"
                                    }

                                </span>

                            </div>
                        )}

                    </div>

                </div>

            </section>


            {/* MENU */}

            <section className="restaurant-menu-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Our Menu
                        </h2>

                        <p>
                            Choose your favorite food
                        </p>

                    </div>

                    <input
                        type="text"
                        placeholder="Search food..."
                        value={searchFood}
                        onChange={(event) =>
                            setSearchFood(
                                event.target.value
                            )
                        }
                        className="food-search"
                    />

                </div>


                <div className="food-categories">

                    {categories.map(
                        category => (

                            <button
                                type="button"
                                key={category}
                                className={
                                    selectedCategory ===
                                    category
                                        ? "category-button active"
                                        : "category-button"
                                }
                                onClick={() =>
                                    setSelectedCategory(
                                        category
                                    )
                                }
                            >
                                {category}
                            </button>
                        )
                    )}

                </div>


                {foodLoading ? (

                    <div className="foods-loading">

                        <div className="loading-spinner" />

                        <p>
                            Loading menu...
                        </p>

                    </div>

                ) : filteredFoods.length === 0 ? (

                    <div className="no-reviews">

                        <div className="no-review-icon">
                            🍽️
                        </div>

                        <h3>
                            No food found
                        </h3>

                        <p>
                            Try another category
                            or search.
                        </p>

                    </div>

                ) : (

                    <div className="food-grid">

                        {filteredFoods.map(
                            food => {

                                const foodName =
                                    food.foodName ||
                                    food.name ||
                                    "Food";

                                const price =
                                    Number(
                                        food.price || 0
                                    );

                                return (

                                    <div
                                        className="food-card"
                                        key={food.id}
                                    >

                                        <div className="food-image-container">

                                            <img
                                                src={
                                                    getFoodImage(
                                                        food
                                                    )
                                                }
                                                alt={foodName}
                                                className="food-image"
                                                onError={(event) => {

                                                    event.currentTarget.src =
                                                        "https://images.unsplash.com/" +
                                                        "photo-1546069901-ba9599a7e63c";

                                                }}
                                            />

                                            {food.category && (

                                                <span className="food-category-badge">
                                                    {
                                                        food.category
                                                    }
                                                </span>

                                            )}

                                        </div>


                                        <div className="food-content">

                                            <h3>
                                                {foodName}
                                            </h3>


                                            {food.description && (

                                                <p className="food-description">
                                                    {
                                                        food.description
                                                    }
                                                </p>

                                            )}


                                            <div className="food-bottom">

                                                <strong className="food-price">
                                                    ₹
                                                    {
                                                        price.toFixed(2)
                                                    }
                                                </strong>

                                                <button
                                                    type="button"
                                                    className="add-cart-button"
                                                    onClick={() =>
                                                        addToCart(
                                                            food
                                                        )
                                                    }
                                                >
                                                    + Add
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </section>


            {/* REVIEWS */}

            <section className="reviews-section">

                <div className="section-header">

                    <div>

                        <h2>
                            Customer Reviews
                        </h2>

                        <p>
                            See what customers say
                            about this restaurant
                        </p>

                    </div>

                </div>


                {/* REVIEW FORM */}

                <div className="review-form-card">

                    <h3>
                        Rate this restaurant
                    </h3>

                    <form onSubmit={submitReview}>

                        <div className="rating-selector">

                            {[1, 2, 3, 4, 5].map(
                                star => (

                                    <button
                                        type="button"
                                        key={star}
                                        className={
                                            star <= rating
                                                ? "select-star selected"
                                                : "select-star"
                                        }
                                        onClick={() =>
                                            setRating(star)
                                        }
                                        aria-label={
                                            `${star} star rating`
                                        }
                                    >
                                        ★
                                    </button>
                                )
                            )}

                        </div>


                        <textarea
                            value={comment}
                            onChange={(event) =>
                                setComment(
                                    event.target.value
                                )
                            }
                            placeholder="Write your review..."
                            maxLength={1000}
                        />


                        <button
                            type="submit"
                            className="submit-review-button"
                            disabled={
                                reviewSubmitting
                            }
                        >
                            {
                                reviewSubmitting
                                    ? "Submitting..."
                                    : "Submit Review"
                            }
                        </button>


                        {reviewMessage && (

                            <p className="review-message">
                                {reviewMessage}
                            </p>

                        )}

                    </form>

                </div>


                {/* REVIEWS */}

                {reviewLoading ? (

                    <div className="reviews-loading">
                        Loading reviews...
                    </div>

                ) : reviews.length === 0 ? (

                    <div className="no-reviews">

                        <div className="no-review-icon">
                            ★
                        </div>

                        <h3>
                            No reviews yet
                        </h3>

                        <p>
                            Be the first customer
                            to review this restaurant.
                        </p>

                    </div>

                ) : (

                    <div className="reviews-list">

                        {reviews.map(
                            review => {

                                const userName =
                                    getReviewUserName(
                                        review
                                    );

                                const reviewComment =
                                    getReviewComment(
                                        review
                                    );

                                return (

                                    <div
                                        className="review-card"
                                        key={review.id}
                                    >

                                        <div className="review-header">

                                            <div className="review-user">

                                                <div className="review-avatar">

                                                    {
                                                        userName
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    }

                                                </div>

                                                <div>

                                                    <h4>
                                                        {userName}
                                                    </h4>

                                                    <span>
                                                        {
                                                            getReviewDate(
                                                                review
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="review-rating">

                                                {renderStars(
                                                    review.rating
                                                )}

                                                <strong>
                                                    {
                                                        Number(
                                                            review.rating ||
                                                            0
                                                        )
                                                    }
                                                    /5
                                                </strong>

                                            </div>

                                        </div>


                                        {reviewComment && (

                                            <p className="review-comment">
                                                {
                                                    reviewComment
                                                }
                                            </p>

                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

            </section>

        </div>
    );
}

export default RestaurantDetails;