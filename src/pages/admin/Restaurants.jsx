import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Restaurants() {

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/restaurants",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setRestaurants(response.data);

        } catch (error) {

            console.error("Failed to load restaurants:", error);

            alert("Failed to load restaurants.");

        } finally {

            setLoading(false);

        }
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

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Restaurant Management
                </h2>

                <span className="badge bg-primary fs-6">
                    {restaurants.length} Restaurants
                </span>

            </div>

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

                            {restaurants.map((restaurant) => (

                                <tr key={restaurant.id}>

                                    {/* ID */}

                                    <td>
                                        {restaurant.id}
                                    </td>

                                    {/* IMAGE */}

                                    <td>

                                        {restaurant.image ? (

                                            <img
                                                src={restaurant.image}
                                                alt={
                                                    restaurant.restaurantName ||
                                                    "Restaurant"
                                                }
                                                width="80"
                                                height="60"
                                                style={{
                                                    objectFit: "cover",
                                                    borderRadius: "8px"
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
                                            {restaurant.restaurantName}
                                        </strong>

                                    </td>

                                    {/* OWNER */}

                                    <td>
                                        {restaurant.ownerName || "N/A"}
                                    </td>

                                    {/* EMAIL */}

                                    <td>
                                        {restaurant.email || "N/A"}
                                    </td>

                                    {/* PHONE */}

                                    <td>
                                        {restaurant.phone || "N/A"}
                                    </td>

                                    {/* RATING */}

                                    <td>

                                        <span className="badge bg-warning text-dark">

                                            ⭐{" "}
                                            {restaurant.rating ?? "N/A"}

                                        </span>

                                    </td>

                                    {/* ACTION */}

                                    <td>

                                        <button
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

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
}

export default Restaurants;