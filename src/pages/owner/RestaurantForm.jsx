import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/ApiService";

function RestaurantForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = id !== undefined;

    const [restaurant, setRestaurant] = useState({

        restaurantName: "",
        location: "",
        phone: "",
        image: ""

    });

    useEffect(() => {

        if (isEdit) {

            loadRestaurant();

        }

    }, []);

    const loadRestaurant = async () => {

        try {

            const response = await API.get(`/restaurants/${id}`);

            setRestaurant(response.data);

        } catch (error) {

            console.log(error);

            alert("Unable to load restaurant.");

        }

    };

    const handleChange = (e) => {

        setRestaurant({

            ...restaurant,

            [e.target.name]: e.target.value

        });

    };

    const saveRestaurant = async (e) => {

        e.preventDefault();

        try {

            if (isEdit) {

                await API.put(`/restaurants/${id}`, restaurant);

                alert("Restaurant Updated Successfully");

            } else {

                await API.post("/restaurants", restaurant);

                alert("Restaurant Added Successfully");

            }

            navigate("/owner/restaurants");

        } catch (error) {

            console.log(error);

            alert("Unable to Save Restaurant");

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-7">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">

                                {

                                    isEdit ?

                                        "✏ Edit Restaurant"

                                        :

                                        "➕ Add Restaurant"

                                }

                            </h2>

                            <form onSubmit={saveRestaurant}>

                                <div className="mb-3">

                                    <label>

                                        Restaurant Name

                                    </label>

                                    <input

                                        type="text"

                                        name="restaurantName"

                                        className="form-control"

                                        value={restaurant.restaurantName}

                                        onChange={handleChange}

                                        required

                                    />

                                </div>

                                <div className="mb-3">

                                    <label>

                                        Location

                                    </label>

                                    <input

                                        type="text"

                                        name="location"

                                        className="form-control"

                                        value={restaurant.location}

                                        onChange={handleChange}

                                        required

                                    />

                                </div>

                                <div className="mb-3">

                                    <label>

                                        Phone

                                    </label>

                                    <input

                                        type="text"

                                        name="phone"

                                        className="form-control"

                                        value={restaurant.phone}

                                        onChange={handleChange}

                                        required

                                    />

                                </div>

                                <div className="mb-3">

                                    <label>

                                        Image URL

                                    </label>

                                    <input

                                        type="text"

                                        name="image"

                                        className="form-control"

                                        value={restaurant.image}

                                        onChange={handleChange}

                                    />

                                </div>

                                {

                                    restaurant.image && (

                                        <div className="text-center mb-3">

                                            <img

                                                src={restaurant.image}

                                                alt="Restaurant"

                                                className="img-fluid rounded"

                                                style={{

                                                    maxHeight: "220px"

                                                }}

                                            />

                                        </div>

                                    )

                                }

                                <button

                                    className="btn btn-success w-100"

                                >

                                    {

                                        isEdit ?

                                            "Update Restaurant"

                                            :

                                            "Add Restaurant"

                                    }

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default RestaurantForm;