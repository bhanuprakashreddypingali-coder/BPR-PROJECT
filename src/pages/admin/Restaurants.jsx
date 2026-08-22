import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/ApiService";

function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // ======================================================
    // LOAD RESTAURANTS
    // ======================================================

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            setLoading(true);

            const response = await API.get("/restaurants");

            setRestaurants(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {
            console.error(
                "Failed to load restaurants:",
                error
            );

            if (error.response?.status === 401) {
                alert(
                    "Your session has expired. Please login again."
                );
            } else if (error.response?.status === 403) {
                alert(
                    "You do not have permission to view restaurants."
                );
            } else {
                alert(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to load restaurants."
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
    // OPEN RESTAURANT DETAILS
    // ======================================================

    const viewRestaurant = (id) => {
        navigate(`/admin/restaurants/${id}`);
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="container mt-4">

                <h2 className="mb-4">
                    Restaurant Management
                </h2>

                <div className="alert alert-info">
                    Loading restaurants...
                </div>

            </div>
        );
    }

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="container mt-4 mb-5">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Restaurant Management
                </h2>

                <div className="d-flex gap-2">

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={loadRestaurants}
                    >
                        🔄 Refresh
                    </button>

                    <span className="badge bg-primary fs-6 d-flex align-items-center">
                        {restaurants.length} Restaurants
                    </span>

                </div>

            </div>

            {/* EMPTY */}

            {restaurants.length === 0 ? (

                <div className="alert alert-warning">
                    No restaurants found.
                </div>

            ) : (

                <div className="table-responsive">

                    <table className="table table-bordered table-striped table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>

                                <th>Image</th>

                                <th>Name</th>

                                <th>Owner</th>

                                <th>Email</th>

                                <th>Phone</th>

                                <th>Rating</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {restaurants.map((restaurant) => {

                                const imageUrl =
                                    getImageUrl(
                                        restaurant.image
                                    );

                                return (
                                    <tr
                                        key={restaurant.id}
                                    >

                                        {/* ID */}

                                        <td>
                                            {restaurant.id}
                                        </td>

                                        {/* IMAGE */}

                                        <td>

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        restaurant.restaurantName ||
                                                        "Restaurant"
                                                    }
                                                    width="80"
                                                    height="60"
                                                    style={{
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "8px",
                                                        border:
                                                            "1px solid #ddd"
                                                    }}
                                                    onError={(event) => {
                                                        event.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />

                                            ) : (

                                                <span className="text-muted">
                                                    No Image
                                                </span>

                                            )}

                                        </td>

                                        {/* NAME */}

                                        <td>

                                            <strong>
                                                {restaurant.restaurantName ||
                                                    "N/A"}
                                            </strong>

                                        </td>

                                        {/* OWNER */}

                                        <td>
                                            {restaurant.ownerName ||
                                                "N/A"}
                                        </td>

                                        {/* EMAIL */}

                                        <td>
                                            {restaurant.email ||
                                                "N/A"}
                                        </td>

                                        {/* PHONE */}

                                        <td>
                                            {restaurant.phone ||
                                                "N/A"}
                                        </td>

                                        {/* RATING */}

                                        <td>

                                            <span className="badge bg-warning text-dark">

                                                ⭐{" "}
                                                {restaurant.rating ??
                                                    "N/A"}

                                            </span>

                                        </td>

                                        {/* ACTION */}

                                        <td>

                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                onClick={() =>
                                                    viewRestaurant(
                                                        restaurant.id
                                                    )
                                                }
                                            >
                                                View Details →
                                            </button>

                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default Restaurants;