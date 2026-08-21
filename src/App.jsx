import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router-dom";

// ==================================================
// COMPONENTS
// ==================================================

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ==================================================
// ADMIN
// ==================================================

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRestaurants from "./pages/admin/Restaurants";
import AdminRestaurantDetails from "./pages/admin/RestaurantDetails";
import AdminFoods from "./pages/admin/Foods";
import AdminOrders from "./pages/admin/Orders";
import AdminReports from "./pages/admin/Reports";
import SupportTickets from "./pages/admin/SupportTickets";

// ==================================================
// RESTAURANT OWNER
// ==================================================

import OwnerDashboard from "./pages/owner/ownerDashboard";
import MyRestaurant from "./pages/owner/MyRestaurant";
import FoodList from "./pages/owner/FoodList";
import FoodForm from "./pages/owner/FoodForm";
import OwnerOrders from "./pages/owner/OwnerOrders";
import OwnerReports from "./pages/owner/Reports";

// ==================================================
// CUSTOMER
// ==================================================

import Home from "./pages/user/home";
import Foods from "./pages/user/foods";
import RestaurantDetails from "./pages/user/RestaurantDetails";

import Login from "./pages/user/login";
import Register from "./pages/user/Register";

import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";

import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";

import Payment from "./pages/user/Payment";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import PaymentFailed from "./pages/user/PaymentFailed";

import Favorites from "./pages/user/Favorites";
import Wishlist from "./pages/user/Wishlist";

import Support from "./pages/user/Support";


// ==================================================
// APP LAYOUT
// ==================================================

function AppLayout() {

    const location = useLocation();

    // Hide main Navbar on auth pages
    const hideNavbar =
        location.pathname === "/login" ||
        location.pathname === "/register";

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>

                {/* ==================================================
                    HOME
                ================================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ==================================================
                    RESTAURANT DETAILS
                ================================================== */}

                <Route
                    path="/restaurant/:id"
                    element={<RestaurantDetails />}
                />

                <Route
                    path="/user/restaurant/:id"
                    element={<RestaurantDetails />}
                />

                <Route
                    path="/customer/restaurant/:id"
                    element={<RestaurantDetails />}
                />


                {/* ==================================================
                    RESTAURANT FOODS
                ================================================== */}

                <Route
                    path="/restaurants/:id"
                    element={<Foods />}
                />

                <Route
                    path="/user/restaurants/:id"
                    element={<Foods />}
                />

                <Route
                    path="/customer/restaurants/:id"
                    element={<Foods />}
                />


                {/* ==================================================
                    AUTHENTICATION
                ================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ==================================================
                    CUSTOMER CART
                ================================================== */}

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Cart />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    CUSTOMER CHECKOUT
                ================================================== */}

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Checkout />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    PAYMENT
                ================================================== */}

                <Route
                    path="/payment"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Payment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payment/:orderId"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Payment />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    PAYMENT SUCCESS
                ================================================== */}

                <Route
                    path="/payment-success"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <PaymentSuccess />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    PAYMENT FAILED
                ================================================== */}

                <Route
                    path="/payment-failed"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <PaymentFailed />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    CUSTOMER ORDERS
                ================================================== */}

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Orders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Orders />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    CUSTOMER PROFILE
                ================================================== */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    FAVORITES
                ================================================== */}

                <Route
                    path="/favorites"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Favorites />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/favorite"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Favorites />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    WISHLIST
                ================================================== */}

                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute
                            allowedRoles={["CUSTOMER"]}
                        >
                            <Wishlist />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    24/7 SUPPORT
                    CUSTOMER + RESTAURANT OWNER
                ================================================== */}

                <Route
                    path="/support"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "CUSTOMER",
                                "RESTAURANT_OWNER"
                            ]}
                        >
                            <Support />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    OWNER DASHBOARD
                ================================================== */}

                <Route
                    path="/owner/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "RESTAURANT_OWNER"
                            ]}
                        >
                            <OwnerDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    OWNER RESTAURANT
                ================================================== */}

                <Route
                    path="/owner/restaurant"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "RESTAURANT_OWNER"
                            ]}
                        >
                            <MyRestaurant />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    OWNER FOODS
                ================================================== */}

                <Route
                    path="/owner/foods"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "RESTAURANT_OWNER"
                            ]}
                        >
                            <FoodList />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/foods/add"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "RESTAURANT_OWNER"
                            ]}
                        >
                            <FoodForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/owner/foods/edit/:id"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "RESTAURANT_OWNER"
                            ]}
                        >
                            <FoodForm />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    OWNER ORDERS
                ================================================== */}

                <Route
                    path="/owner/orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "RESTAURANT_OWNER"
                            ]}
                        >
                            <OwnerOrders />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    OWNER REPORTS
                ================================================== */}

                <Route
                    path="/owner/reports"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "RESTAURANT_OWNER"
                            ]}
                        >
                            <OwnerReports />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN DASHBOARD
                ================================================== */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN USERS
                ================================================== */}

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN RESTAURANTS
                ================================================== */}

                <Route
                    path="/admin/restaurants"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminRestaurants />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/restaurants/:id"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminRestaurantDetails />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN FOODS
                ================================================== */}

                <Route
                    path="/admin/foods"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminFoods />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN ORDERS
                ================================================== */}

                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminOrders />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN REPORTS
                ================================================== */}

                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <AdminReports />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    ADMIN SUPPORT
                ================================================== */}

                <Route
                    path="/admin/support"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        >
                            <SupportTickets />
                        </ProtectedRoute>
                    }
                />


                {/* ==================================================
                    UNKNOWN URL
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    );
}


// ==================================================
// ROOT APP
// ==================================================

function App() {

    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
}

export default App;