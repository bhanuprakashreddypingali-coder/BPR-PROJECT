import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function RestaurantDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRestaurant();
    }, [id]);

    const loadRestaurant = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8080/api/restaurants/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRestaurant(response.data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data ||
                "Failed to load restaurant details."
            );

        } finally {

            setLoading(false);

        }
    };

    if (loading) {

        return (
            <div className="container mt-4">

                <button
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

    if (error || !restaurant) {

        return (
            <div className="container mt-4">

                <button
                    className="btn btn-secondary mb-3"
                    onClick={() =>
                        navigate("/admin/restaurants")
                    }
                >
                    ← Back
                </button>

                <div className="alert alert-danger">
                    {error || "Restaurant not found."}
                </div>

            </div>
        );
    }

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

    return (

        <div className="container mt-4 mb-5">

            <button
                className="btn btn-secondary mb-4"
                onClick={() =>
                    navigate("/admin/restaurants")
                }
            >
                ← Back to Restaurants
            </button>

            {/* Restaurant Header */}

            <div className="card shadow mb-4">

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-4">

                            {restaurant.image ? (

                                <img
                                    src={restaurant.image}
                                    alt={restaurant.restaurantName}
                                    className="img-fluid rounded"
                                />

                            ) : (

                                <div className="alert alert-secondary">
                                    No restaurant image
                                </div>

                            )}

                        </div>

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
                                {value(restaurant.id)}
                            </p>

                            <p>
                                <strong>
                                    Rating:
                                </strong>{" "}
                                ⭐ {value(restaurant.rating)}
                            </p>

                        </div>

                    </div>

                </div>

            </div>


            {/* Restaurant Information */}

            <div className="card shadow mb-4">

                <div className="card-header bg-dark text-white">

                    <h4 className="mb-0">
                        Restaurant Information
                    </h4>

                </div>

                <div className="card-body">

                    <div className="row">

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


            {/* Opening Hours */}

            <div className="card shadow mb-4">

                <div className="card-header bg-primary text-white">

                    <h4 className="mb-0">
                        🕐 Opening Hours
                    </h4>

                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6">

                            <div className="card border-success">

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

                        <div className="col-md-6">

                            <div className="card border-danger">

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


            {/* Back */}

            <div className="text-center">

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate("/admin/restaurants")
                    }
                >
                    ← Back to Restaurant Management
                </button>

            </div>

        </div>
    );
}

export default RestaurantDetails;