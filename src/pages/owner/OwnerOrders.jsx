import { useEffect, useState } from "react";
import API from "../../services/ApiService";

function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================================================
  // LOAD ORDERS
  // =========================================================

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await API.get("/owner/orders");

      console.log("OWNER ORDERS API RESPONSE:", response.data);

      const data = response.data;

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data?.content)) {
        setOrders(data.content);
      } else if (Array.isArray(data?.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("OWNER ORDERS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateStatus = async (id, status) => {
    try {
      setUpdatingOrder(id);

      await API.put(
        `/owner/orders/${id}/status`,
        null,
        {
          params: {
            status,
          },
        }
      );

      await loadOrders();
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // =========================================================
  // FORMAT MONEY
  // =========================================================

  const formatMoney = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return "0.00";
    }

    return amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =========================================================
  // CUSTOMER NAME
  // =========================================================

  const getCustomerName = (order) => {
    return (
      order?.customerName ||
      order?.userName ||
      order?.fullName ||
      order?.name ||
      "Not available"
    );
  };

  // =========================================================
  // CUSTOMER PHONE
  // =========================================================

  const getCustomerPhone = (order) => {
    return (
      order?.customerPhone ||
      order?.userPhone ||
      order?.phone ||
      "Not available"
    );
  };

  // =========================================================
  // RESTAURANT
  // =========================================================

  const getRestaurantName = (order) => {
    return (
      order?.restaurantName ||
      "Not available"
    );
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    switch (
      String(status || "").toUpperCase()
    ) {
      case "PENDING":
        return "status pending";

      case "ACCEPTED":
        return "status accepted";

      case "PREPARING":
        return "status preparing";

      case "OUT_FOR_DELIVERY":
        return "status delivery";

      case "DELIVERED":
        return "status delivered";

      case "CANCELLED":
        return "status cancelled";

      case "PAID":
        return "status paid";

      default:
        return "status";
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="owner-orders-page">
        <div className="loading-box">
          <div className="loading-spinner">
            ⏳
          </div>

          <h3>Loading Orders...</h3>

          <p>
            Please wait while we fetch your
            restaurant orders.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="owner-orders-page">

      {/* HEADER */}

      <div className="orders-header">

        <div>
          <div className="orders-brand">
            BPR FLAVORS HUB
          </div>

          <h2>
            📦 Order Management
          </h2>

          <p>
            Manage orders for your restaurant.
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={loadOrders}
        >
          🔄 Refresh
        </button>

      </div>

      {/* ORDER COUNT */}

      <div className="order-count">
        <strong>
          {orders.length}
        </strong>

        <span>
          Total Orders
        </span>
      </div>

      {/* EMPTY */}

      {orders.length === 0 ? (
        <div className="empty-orders">

          <div className="empty-icon">
            📦
          </div>

          <h3>
            No Orders Found
          </h3>

          <p>
            There are no orders for your
            restaurant yet.
          </p>

        </div>
      ) : (

        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>
              <tr>

                <th>
                  Order ID
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Restaurant
                </th>

                <th>
                  Food
                </th>

                <th>
                  Qty
                </th>

                <th>
                  Total
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Address
                </th>

                <th>
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {orders.map((order) => {

                const customerName =
                  getCustomerName(order);

                const customerPhone =
                  getCustomerPhone(order);

                const restaurantName =
                  getRestaurantName(order);

                const status =
                  String(
                    order?.status || ""
                  ).toUpperCase();

                const updating =
                  updatingOrder === order.id;

                return (
                  <tr
                    key={order.id}
                  >

                    {/* ORDER ID */}

                    <td>
                      <strong>
                        #{order.id}
                      </strong>
                    </td>

                    {/* CUSTOMER */}

                    <td>
                      <div className="customer-cell">

                        <div className="customer-avatar">
                          {customerName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {customerName}
                          </strong>

                          <small>
                            User ID:{" "}
                            {order.userId ??
                              "N/A"}
                          </small>
                        </div>

                      </div>
                    </td>

                    {/* PHONE */}

                    <td>
                      <span className="phone-text">
                        📞{" "}
                        {customerPhone}
                      </span>
                    </td>

                    {/* RESTAURANT */}

                    <td>
                      <strong>
                        {restaurantName}
                      </strong>
                    </td>

                    {/* FOOD */}

                    <td>
                      <strong>
                        {order.foodName ||
                          "Not available"}
                      </strong>
                    </td>

                    {/* QUANTITY */}

                    <td>
                      <strong>
                        {order.quantity ?? 0}
                      </strong>
                    </td>

                    {/* TOTAL */}

                    <td>
                      <strong className="amount">
                        ₹{" "}
                        {formatMoney(
                          order.totalAmount
                        )}
                      </strong>
                    </td>

                    {/* PAYMENT */}

                    <td>
                      {order.paymentMethod ||
                        "Not available"}
                    </td>

                    {/* ADDRESS */}

                    <td>
                      <div className="address-cell">
                        {order.deliveryAddress ||
                          "Not available"}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>

                      <select
                        className={getStatusClass(
                          status
                        )}
                        value={
                          status ||
                          "PENDING"
                        }
                        disabled={updating}
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="PENDING">
                          PENDING
                        </option>

                        <option value="ACCEPTED">
                          ACCEPTED
                        </option>

                        <option value="PREPARING">
                          PREPARING
                        </option>

                        <option value="OUT_FOR_DELIVERY">
                          OUT_FOR_DELIVERY
                        </option>

                        <option value="DELIVERED">
                          DELIVERED
                        </option>

                        <option value="CANCELLED">
                          CANCELLED
                        </option>

                      </select>

                      {updating && (
                        <small className="updating-text">
                          Updating...
                        </small>
                      )}

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

      {/* CSS */}

      <style>{`

        .owner-orders-page {
          min-height: calc(100vh - 70px);
          background: #f6f8fb;
          padding: 35px 5%;
          box-sizing: border-box;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .orders-brand {
          color: #ff5722;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 3px;
          margin-bottom: 6px;
        }

        .orders-header h2 {
          margin: 0;
          color: #172033;
          font-size: 32px;
        }

        .orders-header p {
          margin: 7px 0 0;
          color: #718096;
        }

        .refresh-btn {
          border: none;
          background: #ff5722;
          color: white;
          padding: 12px 20px;
          border-radius: 9px;
          font-weight: 700;
          cursor: pointer;
        }

        .order-count {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid #e8ebef;
          border-radius: 10px;
          padding: 10px 16px;
          margin-bottom: 18px;
        }

        .order-count strong {
          color: #ff5722;
          font-size: 20px;
        }

        .order-count span {
          color: #555;
          font-weight: 600;
        }

        .orders-table-wrapper {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow-x: auto;
          box-shadow:
            0 5px 20px rgba(0,0,0,0.05);
        }

        .orders-table {
          width: 100%;
          min-width: 1300px;
          border-collapse: collapse;
        }

        .orders-table th {
          background: #172033;
          color: white;
          padding: 15px 12px;
          text-align: left;
          font-size: 13px;
          white-space: nowrap;
        }

        .orders-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #eeeeee;
          color: #333;
          vertical-align: middle;
          font-size: 14px;
        }

        .orders-table tbody tr:hover {
          background: #fffaf7;
        }

        .customer-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 190px;
        }

        .customer-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ff5722;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          flex-shrink: 0;
        }

        .customer-cell div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .customer-cell small {
          color: #888;
          font-size: 11px;
        }

        .phone-text {
          white-space: nowrap;
        }

        .amount {
          color: #198754;
          white-space: nowrap;
        }

        .address-cell {
          max-width: 180px;
          white-space: normal;
          word-break: break-word;
        }

        .status {
          border: 1px solid #ddd;
          border-radius: 7px;
          padding: 8px 9px;
          font-weight: 700;
          font-size: 11px;
          cursor: pointer;
          background: white;
        }

        .status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status.accepted {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status.preparing {
          background: #e0e7ff;
          color: #4338ca;
        }

        .status.delivery {
          background: #cffafe;
          color: #0e7490;
        }

        .status.delivered {
          background: #d1fae5;
          color: #047857;
        }

        .status.cancelled {
          background: #fee2e2;
          color: #b91c1c;
        }

        .status.paid {
          background: #dcfce7;
          color: #15803d;
        }

        .updating-text {
          display: block;
          margin-top: 4px;
          color: #ff5722;
          font-size: 10px;
        }

        .loading-box,
        .empty-orders {
          background: white;
          border-radius: 15px;
          padding: 60px 20px;
          text-align: center;
          border: 1px solid #e8ebef;
        }

        .loading-spinner,
        .empty-icon {
          font-size: 45px;
          margin-bottom: 15px;
        }

        .loading-box h3,
        .empty-orders h3 {
          color: #172033;
        }

        .loading-box p,
        .empty-orders p {
          color: #718096;
        }

        @media (max-width: 768px) {

          .owner-orders-page {
            padding: 20px 3%;
          }

          .orders-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .orders-header h2 {
            font-size: 26px;
          }

        }

      `}</style>

    </div>
  );
}

export default OwnerOrders;