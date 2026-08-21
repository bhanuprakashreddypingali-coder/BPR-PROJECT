import React, { useEffect, useState } from "react";
import OwnerService from "../../services/OwnerService";

const MyRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadRestaurant();
  }, []);

  const loadRestaurant = async () => {
    try {
      const data = await OwnerService.getRestaurant();
      setRestaurant(data);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Restaurant not found."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setRestaurant({
      ...restaurant,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const updated = await OwnerService.updateRestaurant(restaurant);

      setRestaurant(updated);
      setMessage("Restaurant updated successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to update restaurant."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.center}>
        Loading restaurant...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div style={styles.container}>
        <h2>My Restaurant</h2>

        <div style={styles.error}>
          {error || "No restaurant found for this owner."}
        </div>

        <p>
          Your owner account may need a restaurant record before this page
          can be used.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>My Restaurant</h1>
      <p>Edit your restaurant information.</p>

      {message && <div style={styles.success}>{message}</div>}

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <Field
          label="Restaurant Name"
          name="restaurantName"
          value={restaurant.restaurantName}
          onChange={handleChange}
        />

        <Field
          label="Owner Name"
          name="ownerName"
          value={restaurant.ownerName}
          onChange={handleChange}
        />

        <Field
          label="Email"
          name="email"
          type="email"
          value={restaurant.email}
          onChange={handleChange}
        />

        <Field
          label="Phone"
          name="phone"
          value={restaurant.phone}
          onChange={handleChange}
        />

        <Field
          label="Address"
          name="address"
          value={restaurant.address}
          onChange={handleChange}
        />

        <Field
          label="Image URL"
          name="image"
          value={restaurant.image}
          onChange={handleChange}
        />

        <label style={styles.label}>Description</label>

        <textarea
          name="description"
          value={restaurant.description || ""}
          onChange={handleChange}
          rows="4"
          style={styles.textarea}
        />

        <div style={styles.row}>
          <div style={styles.half}>
            <Field
              label="Opening Time"
              name="openingTime"
              type="time"
              value={restaurant.openingTime || ""}
              onChange={handleChange}
            />
          </div>

          <div style={styles.half}>
            <Field
              label="Closing Time"
              name="closingTime"
              type="time"
              value={restaurant.closingTime || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" disabled={saving} style={styles.button}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div>
      <label style={styles.label}>{label}</label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        style={styles.input}
      />
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    maxWidth: "800px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginTop: "12px",
    marginBottom: "6px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    fontSize: "15px",
    resize: "vertical",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  half: {
    width: "100%",
  },

  button: {
    marginTop: "25px",
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    background: "#ff5722",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  success: {
    background: "#e7f7ed",
    color: "#218838",
    padding: "12px",
    borderRadius: "8px",
    margin: "20px 0",
  },

  error: {
    background: "#ffe5e5",
    color: "#c62828",
    padding: "12px",
    borderRadius: "8px",
    margin: "20px 0",
  },
};

export default MyRestaurant;