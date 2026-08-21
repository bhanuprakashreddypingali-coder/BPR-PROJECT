import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/ApiService";

function FoodList() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      const response = await API.get("/owner/foods");
      setFoods(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load foods.");
    } finally {
      setLoading(false);
    }
  };

  const deleteFood = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this food?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/owner/foods/${id}`);
      loadFoods();
      alert("Food deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to delete food.");
    }
  };

  const toggleStatus = async (food) => {
    try {
      await API.put(`/owner/foods/${food.id}`, {
        foodName: food.foodName,
        description: food.description,
        price: food.price,
        image: food.image,
        category: food.category,
        available: !food.available,
      });

      loadFoods();
    } catch (error) {
      console.error(error);
      alert("Unable to update status.");
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.foodName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>🍔 Food Management</h2>

        <Link
          to="/owner/foods/add"
          className="btn btn-success"
        >
          + Add Food
        </Link>

      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search Food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center mt-5">
          <h4>Loading...</h4>
        </div>
      ) : (
        <table className="table table-bordered table-hover shadow">

          <thead className="table-dark">

            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th width="220">Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredFoods.length === 0 ? (

              <tr>
                <td colSpan="6" className="text-center">
                  No Foods Found
                </td>
              </tr>

            ) : (

              filteredFoods.map((food) => (

                <tr key={food.id}>

                  <td>

                    <img
                      src={
                        food.image ||
                        "https://via.placeholder.com/80x80?text=Food"
                      }
                      alt={food.foodName}
                      width="80"
                      height="80"
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                  </td>

                  <td>{food.foodName}</td>

                  <td>₹ {food.price}</td>

                  <td>{food.category}</td>

                  <td>

                    <button
                      className={
                        food.available
                          ? "btn btn-success btn-sm"
                          : "btn btn-secondary btn-sm"
                      }
                      onClick={() => toggleStatus(food)}
                    >
                      {food.available
                        ? "🟢 Available"
                        : "🔴 Unavailable"}
                    </button>

                  </td>

                  <td>

                    <Link
                      to={`/owner/foods/edit/${food.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteFood(food.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>
      )}
    </div>
  );
}

export default FoodList;