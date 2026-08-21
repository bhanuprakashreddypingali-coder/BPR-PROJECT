function FoodCard({ food }) {

  const addToCart = () => {
    alert("Cart API will be connected next.");
  };

  return (
    <div className="col-md-3 mb-4">

      <div className="card shadow h-100">

        <img
          src={
            food.image ||
            "https://via.placeholder.com/300x220?text=Food"
          }
          className="card-img-top"
          alt={food.foodName}
          style={{ height: "180px", objectFit: "cover" }}
        />

        <div className="card-body">

          <h5>{food.foodName}</h5>

          <p>{food.description}</p>

          <h6 className="text-success">
            ₹{food.price}
          </h6>

          <button
            className="btn btn-primary w-100"
            onClick={addToCart}
          >
            Add to Cart
          </button>

        </div>
      </div>

    </div>
  );
}

export default FoodCard;