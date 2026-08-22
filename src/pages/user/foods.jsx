import { useEffect, useState } from "react";
import API from "../../services/ApiService";

function Foods() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    // ============================================================
    // BACKEND BASE URL
    // ============================================================

    const BACKEND_URL = API.defaults.baseURL.replace(/\/api\/?$/, "");

    // ============================================================
    // LOAD FOODS
    // ============================================================

    useEffect(() => {
        loadFoods();
    }, []);

    const loadFoods = async () => {
        try {
            setLoading(true);

            const response = await API.get("/foods");

            setFoods(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {
            console.error("Failed to load foods:", error);

            if (error.response?.status === 401) {
                alert("Your session has expired. Please login again.");
            } else if (error.response?.status === 403) {
                alert("You do not have permission to view foods.");
            } else {
                alert(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to load foods."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // FOOD IMAGE URL
    // ============================================================

    const getImageUrl = (image) => {
        if (!image) {
            return null;
        }

        // Already a complete URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Backend relative path
        if (image.startsWith("/")) {
            return `${BACKEND_URL}${image}`;
        }

        return `${BACKEND_URL}/${image}`;
    };

    // ============================================================
    // DELETE FOOD
    // ============================================================

    const deleteFood = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this food?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await API.delete(`/foods/${id}`);

            alert("Food deleted successfully.");

            await loadFoods();

        } catch (error) {
            console.error("Failed to delete food:", error);

            if (error.response?.status === 401) {
                alert("Your session has expired. Please login again.");
            } else if (error.response?.status === 403) {
                alert("You do not have permission to delete this food.");
            } else {
                alert(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to delete food."
                );
            }
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="container mt-4">
                <h2>Food Management</h2>

                <div className="alert alert-info mt-3">
                    Loading foods...
                </div>
            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="container mt-4 mb-5">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Food Management
                </h2>

                <span className="badge bg-primary fs-6">
                    {foods.length} Foods
                </span>

            </div>

            {/* =====================================================
                EMPTY
            ====================================================== */}

            {foods.length === 0 ? (

                <div className="alert alert-warning">
                    No food items found.
                </div>

            ) : (

                <div className="table-responsive">

                    <table className="table table-bordered table-striped table-hover align-middle">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>

                                <th>Image</th>

                                <th>Food Name</th>

                                <th>Restaurant</th>

                                <th>Category</th>

                                <th>Price</th>

                                <th>Available</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {foods.map((food) => {

                                const imageUrl = getImageUrl(
                                    food.image
                                );

                                return (

                                    <tr key={food.id}>

                                        {/* ID */}

                                        <td>
                                            {food.id}
                                        </td>

                                        {/* IMAGE */}

                                        <td>

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        food.name ||
                                                        food.foodName ||
                                                        "Food"
                                                    }
                                                    width="80"
                                                    height="60"
                                                    style={{
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                        border: "1px solid #ddd"
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />

                                            ) : (

                                                <span className="text-muted">
                                                    No Image
                                                </span>

                                            )}

                                        </td>

                                        {/* FOOD NAME */}

                                        <td>

                                            <strong>
                                                {food.name ||
                                                    food.foodName ||
                                                    "N/A"}
                                            </strong>

                                        </td>

                                        {/* RESTAURANT */}

                                        <td>

                                            {food.restaurantName ||
                                                food.restaurant?.restaurantName ||
                                                food.restaurant?.name ||
                                                "N/A"}

                                        </td>

                                        {/* CATEGORY */}

                                        <td>
                                            {food.category || "N/A"}
                                        </td>

                                        {/* PRICE */}

                                        <td>

                                            <strong>
                                                ₹{food.price ?? "0"}
                                            </strong>

                                        </td>

                                        {/* AVAILABLE */}

                                        <td>

                                            {food.available !==
                                            undefined ? (

                                                food.available ? (

                                                    <span className="badge bg-success">
                                                        Available
                                                    </span>

                                                ) : (

                                                    <span className="badge bg-danger">
                                                        Unavailable
                                                    </span>

                                                )

                                            ) : (

                                                <span className="badge bg-secondary">
                                                    N/A
                                                </span>

                                            )}

                                        </td>

                                        {/* DELETE */}

                                        <td>

                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    deleteFood(
                                                        food.id
                                                    )
                                                }
                                            >
                                                Delete
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

export default Foods;