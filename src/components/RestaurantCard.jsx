import { Link } from "react-router-dom";

function RestaurantCard({ restaurant }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow h-100">

        <img
          src={
            restaurant.image ||
            "https://via.placeholder.com/400x250?text=Restaurant"
          }
          className="card-img-top"
          alt={restaurant.restaurantName}
          style={{ height: "220px", objectFit: "cover" }}
        />

        <div className="card-body">

          <h5>{restaurant.restaurantName}</h5>

          <p className="text-muted">
            {restaurant.address}
          </p>

          <p>
            ⭐ {restaurant.rating}
          </p>

          <Link
            to={`/foods?restaurant=${restaurant.id}`}
            className="btn btn-success w-100"
          >
            View Foods
          </Link>

        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;