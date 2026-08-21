import { useState } from "react";
import API from "../../services/ApiService";

function AddReview({ restaurantId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    try {
      await API.post("/reviews", {
        restaurantId,
        rating,
        comment,
      });

      alert("Review submitted successfully ⭐");

      setComment("");
      setRating(5);

      if (onSuccess) onSuccess();

    } catch (err) {
      alert(err.response?.data?.message || "Already reviewed.");
    }
  };

  return (
    <div className="card p-3 shadow mt-4">
      <h4>⭐ Rate Restaurant</h4>

      <select
        className="form-select my-2"
        value={rating}
        onChange={(e)=>setRating(Number(e.target.value))}
      >
        {[5,4,3,2,1].map(r=>(
          <option key={r} value={r}>
            {r} Star
          </option>
        ))}
      </select>

      <textarea
        className="form-control"
        rows="3"
        placeholder="Write your review..."
        value={comment}
        onChange={(e)=>setComment(e.target.value)}
      />

      <button
        className="btn btn-success mt-3"
        onClick={submitReview}
      >
        Submit Review
      </button>
    </div>
  );
}

export default AddReview;