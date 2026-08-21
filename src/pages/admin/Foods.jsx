import { useEffect, useState } from "react";
import axios from "axios";

function Foods() {

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFoods();
    }, []);

    const loadFoods = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/foods",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFoods(response.data);

        } catch (error) {

            console.error("Failed to load foods:", error);

            alert(
                error.response?.data ||
                "Failed to load foods."
            );

        } finally {

            setLoading(false);

        }
    };

    const deleteFood = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this food?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/api/foods/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Food deleted successfully.");

            loadFoods();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data ||
                "Failed to delete food."
            );
        }
    };

    if (loading) {

        return (
            <div className="container mt-4">

                <h2>
                    Food Management
                </h2>

                <div className="alert alert-info mt-3">
                    Loading foods...
                </div>

            </div>
        );
    }

    return (

        <div className="container mt-4 mb-5">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Food Management
                </h2>

                <span className="badge bg-primary fs-6">
                    {foods.length} Foods
                </span>

            </div>


            {/* EMPTY */}

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

                            {foods.map((food) => (

                                <tr key={food.id}>

                                    {/* ID */}

                                    <td>
                                        {food.id}
                                    </td>


                                    {/* IMAGE */}

                                    <td>

                                        {food.image ? (

                                            <img
                                                src={food.image}
                                                alt={
                                                    food.name ||
                                                    food.foodName ||
                                                    "Food"
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
                                            ₹
                                            {food.price ??
                                                "0"}
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

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default Foods;