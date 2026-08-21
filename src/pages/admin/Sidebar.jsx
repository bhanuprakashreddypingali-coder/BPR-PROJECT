import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaStore,
  FaHamburger,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Restaurants",
      path: "/admin/restaurants",
      icon: <FaStore />,
    },
    {
      name: "Foods",
      path: "/admin/foods",
      icon: <FaHamburger />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <FaShoppingCart />,
    },
  ];

  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <h3 className="text-center mb-4">
        🍽️ BPR Admin
      </h3>

      {menu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`btn w-100 text-start mb-2 ${
            location.pathname === item.path
              ? "btn-success"
              : "btn-outline-light"
          }`}
        >
          {item.icon} &nbsp; {item.name}
        </Link>
      ))}

      <hr />

      <button
        className="btn btn-danger w-100"
        onClick={logout}
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Sidebar;