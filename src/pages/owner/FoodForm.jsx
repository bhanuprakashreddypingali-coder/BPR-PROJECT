import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/ApiService";

function FoodForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = !!id;


    // ==================================================
    // FOOD STATE
    // ==================================================

    const [food, setFood] = useState({

        foodName: "",
        description: "",
        price: "",
        image: "",
        category: "BIRYANIS",
        available: true

    });


    // ==================================================
    // CATEGORY LIST
    // ==================================================

    const categories = [

        {
            value: "BIRYANIS",
            label: "🍗 Biryanis"
        },

        {
            value: "ROTIS",
            label: "🫓 Rotis & Breads"
        },

        {
            value: "VEG_CURRIES",
            label: "🥦 Veg Curries"
        },

        {
            value: "NON_VEG_CURRIES",
            label: "🍗 Non-Veg Curries"
        },

        {
            value: "RICE",
            label: "🍚 Rice & Meals"
        },

        {
            value: "STARTERS",
            label: "🍟 Starters"
        },

        {
            value: "FAMILY_PACK",
            label: "👨‍👩‍👧‍👦 Family Packs"
        },

        {
            value: "COMBOS",
            label: "🎁 Combos"
        },

        {
            value: "DRINKS",
            label: "🥤 Drinks"
        },

        {
            value: "WATER",
            label: "💧 Water"
        },

        {
            value: "DESSERTS",
            label: "🍨 Desserts"
        },

        {
            value: "SALADS",
            label: "🥗 Salads & Sides"
        }

    ];


    // ==================================================
    // LOAD FOOD WHEN EDITING
    // ==================================================

    useEffect(() => {

        if (isEdit) {

            loadFood();

        }

    }, [id]);


    const loadFood = async () => {

        try {

            const response =
                await API.get("/owner/foods");


            const selectedFood =
                response.data.find(
                    (item) =>
                        item.id === Number(id)
                );


            if (selectedFood) {

                setFood({

                    foodName:
                        selectedFood.foodName || "",

                    description:
                        selectedFood.description || "",

                    price:
                        selectedFood.price ?? "",

                    image:
                        selectedFood.image || "",

                    category:
                        normalizeCategory(
                            selectedFood.category
                        ),

                    available:
                        selectedFood.available !== false

                });

            }

        } catch (err) {

            console.error(
                "Error loading food:",
                err
            );

            alert(
                "Unable to load food details."
            );

        }

    };


    // ==================================================
    // NORMALIZE CATEGORY
    // ==================================================

    const normalizeCategory = (category) => {

        if (!category) {

            return "BIRYANIS";

        }


        const value =
            String(category)
                .trim()
                .toUpperCase()
                .replace(/[\s-]+/g, "_");


        // ------------------------------------------
        // OLD CATEGORY SUPPORT
        // ------------------------------------------

        const oldCategories = {

            BIRYANI: "BIRYANIS",

            "BIRYANI'S": "BIRYANIS",

            RICE: "RICE",

            DRINK: "DRINKS",

            DESSERT: "DESSERTS",

            "NON VEG": "NON_VEG_CURRIES",

            NONVEG: "NON_VEG_CURRIES",

            "VEG": "VEG_CURRIES"

        };


        return oldCategories[value] || value;

    };


    // ==================================================
    // HANDLE INPUT
    // ==================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFood({

            ...food,

            [name]: value

        });

    };


    // ==================================================
    // HANDLE AVAILABILITY
    // ==================================================

    const handleAvailability = (e) => {

        setFood({

            ...food,

            available:
                e.target.value === "true"

        });

    };


    // ==================================================
    // SAVE FOOD
    // ==================================================

    const saveFood = async (e) => {

        e.preventDefault();


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !food.foodName ||
            food.foodName.trim() === ""
        ) {

            alert(
                "Please enter food name."
            );

            return;

        }


        if (
            !food.price ||
            Number(food.price) <= 0
        ) {

            alert(
                "Please enter a valid price."
            );

            return;

        }


        if (!food.category) {

            alert(
                "Please select a category."
            );

            return;

        }


        // ------------------------------------------
        // PREPARE DATA
        // ------------------------------------------

        const foodData = {

            foodName:
                food.foodName.trim(),

            description:
                food.description?.trim() || "",

            price:
                Number(food.price),

            image:
                food.image?.trim() || "",

            category:
                normalizeCategory(
                    food.category
                ),

            available:
                Boolean(food.available)

        };


        try {


            // ======================================
            // EDIT
            // ======================================

            if (isEdit) {

                await API.put(
                    `/owner/foods/${id}`,
                    foodData
                );


                alert(
                    "Food Updated Successfully"
                );

            }


            // ======================================
            // CREATE
            // ======================================

            else {

                await API.post(
                    "/owner/foods",
                    foodData
                );


                alert(
                    "Food Added Successfully"
                );

            }


            navigate(
                "/owner/foods"
            );


        } catch (err) {

            console.error(
                "Food save error:",
                err
            );


            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Operation Failed";


            alert(message);

        }

    };


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div className="container mt-4 mb-5">

            <div className="card shadow">

                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="card-header bg-danger text-white">

                    <h3 className="mb-0">

                        {isEdit
                            ? "✏️ Edit Food"
                            : "🍽️ Add New Food"}

                    </h3>

                </div>


                <div className="card-body">


                    <form onSubmit={saveFood}>


                        {/* ==================================
                            FOOD NAME
                        ================================== */}

                        <div className="mb-3">

                            <label className="form-label fw-bold">

                                Food Name

                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="foodName"
                                placeholder="Example: Chicken Biryani"
                                value={
                                    food.foodName
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* ==================================
                            DESCRIPTION
                        ================================== */}

                        <div className="mb-3">

                            <label className="form-label fw-bold">

                                Description

                            </label>

                            <textarea
                                className="form-control"
                                rows="3"
                                name="description"
                                placeholder="Describe the food..."
                                value={
                                    food.description
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* ==================================
                            PRICE
                        ================================== */}

                        <div className="mb-3">

                            <label className="form-label fw-bold">

                                Price (₹)

                            </label>

                            <input
                                type="number"
                                className="form-control"
                                name="price"
                                placeholder="Example: 250"
                                min="1"
                                step="0.01"
                                value={
                                    food.price
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* ==================================
                            IMAGE
                        ================================== */}

                        <div className="mb-3">

                            <label className="form-label fw-bold">

                                Image URL

                            </label>

                            <input
                                type="url"
                                className="form-control"
                                name="image"
                                placeholder="https://example.com/food.jpg"
                                value={
                                    food.image
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* ==================================
                            CATEGORY
                        ================================== */}

                        <div className="mb-3">

                            <label className="form-label fw-bold">

                                🍽️ Food Category

                            </label>

                            <select
                                className="form-select"
                                name="category"
                                value={
                                    food.category
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">

                                    Select Food Category

                                </option>


                                {categories.map(
                                    (category) => (

                                        <option
                                            key={
                                                category.value
                                            }
                                            value={
                                                category.value
                                            }
                                        >

                                            {
                                                category.label
                                            }

                                        </option>

                                    )
                                )}

                            </select>


                            <small className="text-muted">

                                Select the category that
                                customers will use to filter
                                this food.

                            </small>

                        </div>


                        {/* ==================================
                            AVAILABILITY
                        ================================== */}

                        <div className="mb-4">

                            <label className="form-label fw-bold">

                                Food Availability

                            </label>

                            <select
                                className="form-select"
                                value={
                                    String(
                                        food.available
                                    )
                                }
                                onChange={
                                    handleAvailability
                                }
                            >

                                <option value="true">

                                    ✓ Available

                                </option>

                                <option value="false">

                                    ✕ Unavailable

                                </option>

                            </select>

                        </div>


                        {/* ==================================
                            BUTTONS
                        ================================== */}

                        <button
                            type="submit"
                            className="btn btn-success me-2"
                        >

                            {isEdit
                                ? "💾 Update Food"
                                : "➕ Save Food"}

                        </button>


                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/owner/foods"
                                )
                            }
                        >

                            Cancel

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default FoodForm;