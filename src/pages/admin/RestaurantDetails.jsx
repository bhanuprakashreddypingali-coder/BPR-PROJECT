import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/ApiService";

function RestaurantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ======================================================
    // LOAD RESTAURANT
    // ======================================================

    useEffect(() => {
        loadRestaurant();
    }, [id]);

    const loadRestaurant = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get(
                `/restaurants/${id}`
            );

            setRestaurant(response.data);

        } catch (error) {
            console.error(
                "Failed to load restaurant:",
                error
            );

            if (error.response?.status === 401) {
                setError(
                    "Your session has expired. Please login again."
                );
            } else if (error.response?.status === 403) {
                setError(
                    "You do not have permission to view this restaurant."
                );
            } else if (error.response?.status === 404) {
                setError(
                    "Restaurant not found."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to load restaurant details."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // IMAGE URL
    // ======================================================

    const getImageUrl = (image) => {
        if (!image) {
            return null;
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        const backendUrl =
            API.defaults.baseURL.replace(/\/api\/?$/, "");

        if (image.startsWith("/")) {
            return `${backendUrl}${image}`;
        }

        return `${backendUrl}/${image}`;
    };

    // ======================================================
    // VALUE HELPER
    // ======================================================

    const value = (data) => {
        if (
            data === null ||
            data === undefined ||
            data === ""
        ) {
            return "Not provided";
        }

        return data;
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="container mt-4">

                <button
                    type="button"
                    className="btn btn-secondary mb-3"
                    onClick={() =>
                        navigate("/admin/restaurants")
                    }
                >
                    ← Back
                </button>

                <div className="alert alert-info">
                    Loading restaurant details...
                </div>

            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error || !restaurant) {
        return (
            <div className="container mt-4">

                <button
                    type="button"
                    className="btn btn-secondary mb-3"
                    onClick={() =>
                        navigate("/admin/restaurants")
                    }
                >
                    ← Back
                </button>

                <div className="alert alert-danger">
                    {error ||
                        "Restaurant not found."}
                </div>

            </div>
        );
    }

    const imageUrl = getImageUrl(
        restaurant.image
    );

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="container mt-4 mb-5">

            {/* BACK BUTTON */}

            <button
                type="button"
                className="btn btn-secondary mb-4"
                onClick={() =>
                    navigate("/admin/restaurants")
                }
            >
                ← Back to Restaurants
            </button>

            {/* ==================================================
                RESTAURANT HEADER
            ================================================== */}

            <div className="card shadow mb-4">

                <div className="card-body">

                    <div className="row">

                        {/* IMAGE */}

                        <div className="col-md-4">

                            {imageUrl ? (

                                <img
                                    src={imageUrl}
                                    alt={
                                        restaurant.restaurantName ||
                                        "Restaurant"
                                    }
                                    className="img-fluid rounded"
                                    style={{
                                        width: "100%",
                                        maxHeight: "300px",
                                        objectFit: "cover"
                                    }}
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                            ) : (

                                <div className="alert alert-secondary">
                                    No restaurant image
                                </div>

                            )}

                        </div>

                        {/* BASIC DETAILS */}

                        <div className="col-md-8">

                            <h1>
                                {value(
                                    restaurant.restaurantName
                                )}
                            </h1>

                            <p>
                                <strong>
                                    Restaurant ID:
                                </strong>{" "}
                                {value(
                                    restaurant.id
                                )}
                            </p>

                            <p>
                                <strong>
                                    Rating:
                                </strong>{" "}
                                ⭐{" "}
                                {value(
                                    restaurant.rating
                                )}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                RESTAURANT INFORMATION
            ================================================== */}

            <div className="card shadow mb-4">

                <div className="card-header bg-dark text-white">

                    <h4 className="mb-0">
                        Restaurant Information
                    </h4>

                </div>

                <div className="card-body">

                    <div className="row">

                        {/* NAME */}

                        <div className="col-md-6 mb-3">

                            <strong>
                                Restaurant Name
                            </strong>

                            <div className="form-control bg-light">
                                {value(
                                    restaurant.restaurantName
                                )}
                            </div>

                        </div>

                        {/* OWNER */}

                        <div className="col-md-6 mb-3">

                            <strong>
                                Owner Name
                            </strong>

                            <div className="form-control bg-light">
                                {value(
                                    restaurant.ownerName
                                )}
                            </div>

                        </div>

                        {/* EMAIL */}

                        <div className="col-md-6 mb-3">

                            <strong>
                                Email
                            </strong>

                            <div className="form-control bg-light">
                                {value(
                                    restaurant.email
                                )}
                            </div>

                        </div>

                        {/* PHONE */}

                        <div className="col-md-6 mb-3">

                            <strong>
                                Phone
                            </strong>

                            <div className="form-control bg-light">
                                {value(
                                    restaurant.phone
                                )}
                            </div>

                        </div>

                        {/* ADDRESS */}

                        <div className="col-md-12 mb-3">

                            <strong>
                                Address
                            </strong>

                            <div className="form-control bg-light">
                                {value(
                                    restaurant.address
                                )}
                            </div>

                        </div>

                        {/* DESCRIPTION */}

                        <div className="col-md-12 mb-3">

                            <strong>
                                Description
                            </strong>

                            <div className="form-control bg-light">
                                {value(
                                    restaurant.description
                                )}
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                OPENING HOURS
            ================================================== */}

            <div className="card shadow mb-4">

                <div className="card-header bg-primary text-white">

                    <h4 className="mb-0">
                        🕐 Opening Hours
                    </h4>

                </div>

                <div className="card-body">

                    <div className="row">

                        {/* OPENING */}

                        <div className="col-md-6 mb-3">

                            <div className="card border-success h-100">

                                <div className="card-body">

                                    <h5 className="text-success">
                                        🟢 Opening Time
                                    </h5>

                                    <h3>
                                        {value(
                                            restaurant.openingTime
                                        )}
                                    </h3>

                                </div>

                            </div>

                        </div>

                        {/* CLOSING */}

                        <div className="col-md-6 mb-3">

                            <div className="card border-danger h-100">

                                <div className="card-body">

                                    <h5 className="text-danger">
                                        🔴 Closing Time
                                    </h5>

                                    <h3>
                                        {value(
                                            restaurant.closingTime
                                        )}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                BACK
            ================================================== */}

            <div className="text-center">

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate(
                            "/admin/restaurants"
                        )
                    }
                >
                    ← Back to Restaurant Management
                </button>

            </div>

        </div>
    );
}

export default RestaurantDetails;