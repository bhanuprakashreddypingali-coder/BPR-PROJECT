import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/ApiService";

function RestaurantList() {

    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {

        try {

            const response = await API.get("/restaurants");

            setRestaurants(response.data);

        } catch (error) {

            console.log(error);

            alert("Unable to load restaurants.");

        }

    };

    const deleteRestaurant = async (id) => {

        if (!window.confirm("Delete this restaurant?")) {
            return;
        }

        try {

            await API.delete(`/restaurants/${id}`);

            alert("Restaurant deleted successfully.");

            loadRestaurants();

        } catch (error) {

            console.log(error);

            alert("Unable to delete restaurant.");

        }

    };

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>

                    🏪 My Restaurants

                </h2>

                <Link
                    to="/owner/restaurants/add"
                    className="btn btn-success"
                >
                    ➕ Add Restaurant
                </Link>

            </div>

            <table className="table table-bordered table-hover shadow">

                <thead className="table-dark">

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Location</th>

                        <th>Phone</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        restaurants.length === 0 ?

                            <tr>

                                <td
                                    colSpan="5"
                                    className="text-center"
                                >

                                    No Restaurants Found

                                </td>

                            </tr>

                            :

                            restaurants.map((restaurant) => (

                                <tr key={restaurant.id}>

                                    <td>{restaurant.id}</td>

                                    <td>{restaurant.restaurantName}</td>

                                    <td>{restaurant.location}</td>

                                    <td>{restaurant.phone}</td>

                                    <td>

                                        <Link
                                            to={`/owner/restaurants/edit/${restaurant.id}`}
                                            className="btn btn-primary btn-sm me-2"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteRestaurant(restaurant.id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default RestaurantList;