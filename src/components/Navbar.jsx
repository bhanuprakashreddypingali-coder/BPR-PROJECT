import React, {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState({});
    const [accountOpen, setAccountOpen] =
        useState(false);

    const accountRef = useRef(null);

    // =========================================================
    // LOAD USER
    // =========================================================

    useEffect(() => {

        loadUser();

        setAccountOpen(false);

    }, [location.pathname]);

    const loadUser = () => {

        try {

            const savedUser =
                localStorage.getItem("user");

            if (savedUser) {

                const parsedUser =
                    JSON.parse(savedUser);

                setUser(parsedUser);

            } else {

                setUser({});
            }

        } catch (error) {

            console.error(
                "Unable to read user:",
                error
            );

            setUser({});
        }
    };

    // =========================================================
    // AUTH STATE
    // =========================================================

    const token =
        localStorage.getItem("token");

    const isLoggedIn =
        Boolean(token);

    // =========================================================
    // USER INFORMATION
    // =========================================================

    const fullName =
        user?.fullName ||
        user?.name ||
        user?.user?.fullName ||
        "User";

    const role = isLoggedIn
        ? String(
            user?.role ||
            user?.user?.role ||
            localStorage.getItem("role") ||
            ""
        )
            .replace(/^ROLE_/i, "")
            .toUpperCase()
        : "";

    const avatarLetter =
        fullName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";

    // =========================================================
    // CLOSE DROPDOWN OUTSIDE
    // =========================================================

    useEffect(() => {

        const handleOutsideClick = (
            event
        ) => {

            if (
                accountRef.current &&
                !accountRef.current.contains(
                    event.target
                )
            ) {

                setAccountOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };

    }, []);

    // =========================================================
    // CLOSE MENU
    // =========================================================

    const closeMenu = () => {
        setAccountOpen(false);
    };

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        setUser({});
        setAccountOpen(false);

        navigate(
            "/login",
            {
                replace: true
            }
        );
    };

    // =========================================================
    // SUPPORT
    // =========================================================

    const goToSupport = () => {

        closeMenu();

        if (role === "ADMIN") {

            navigate("/admin/support");

        } else {

            navigate("/support");
        }
    };

    // =========================================================
    // CUSTOMER MENU
    // =========================================================

    const customerMenu = [

        {
            path: "/cart",
            icon: "🛒",
            title: "My Cart",
            subtitle: "View your cart"
        },

        {
            path: "/orders",
            icon: "📦",
            title: "My Orders",
            subtitle: "Track your orders"
        },

        {
            path: "/wishlist",
            icon: "🤍",
            title: "Wishlist",
            subtitle: "Saved foods"
        },

        {
            path: "/support",
            icon: "🛟",
            title: "Help & Support",
            subtitle: "24/7 customer support"
        },

        {
            path: "/profile",
            icon: "👤",
            title: "Profile",
            subtitle: "Manage your account"
        }

    ];

    // =========================================================
    // OWNER MENU
    // =========================================================

    const ownerMenu = [

        {
            path: "/owner/dashboard",
            icon: "📊",
            title: "Owner Dashboard",
            subtitle: "Manage your restaurant"
        },

        {
            path: "/owner/restaurant",
            icon: "🍽️",
            title: "My Restaurant",
            subtitle: "Manage restaurant details"
        },

        {
            path: "/owner/foods",
            icon: "🍔",
            title: "My Foods",
            subtitle: "Manage food items"
        },

        {
            path: "/owner/orders",
            icon: "📦",
            title: "Orders",
            subtitle: "Manage customer orders"
        },

        {
            path: "/support",
            icon: "🛟",
            title: "Help & Support",
            subtitle: "24/7 owner support"
        },

        {
            path: "/profile",
            icon: "👤",
            title: "Profile",
            subtitle: "Manage your account"
        }

    ];

    // =========================================================
    // ADMIN MENU
    // =========================================================

    const adminMenu = [

        {
            path: "/admin/dashboard",
            icon: "📊",
            title: "Admin Dashboard",
            subtitle: "Manage BPR Flavors Hub"
        },

        {
            path: "/admin/users",
            icon: "👥",
            title: "Users",
            subtitle: "Manage customers and owners"
        },

        {
            path: "/admin/restaurants",
            icon: "🍽️",
            title: "Restaurants",
            subtitle: "Manage restaurants"
        },

        {
            path: "/admin/foods",
            icon: "🍔",
            title: "Foods",
            subtitle: "Manage food items"
        },

        {
            path: "/admin/orders",
            icon: "📦",
            title: "Orders",
            subtitle: "Manage all orders"
        },

        {
            path: "/admin/reports",
            icon: "📈",
            title: "Reports",
            subtitle: "View system reports"
        },

        {
            path: "/admin/support",
            icon: "🛟",
            title: "Support Center",
            subtitle: "Manage customer problems"
        },

        {
            path: "/profile",
            icon: "👤",
            title: "Profile",
            subtitle: "Manage your account"
        }

    ];

    // =========================================================
    // SELECT MENU
    // =========================================================

    let menuItems = [];

    if (role === "ADMIN") {

        menuItems = adminMenu;

    } else if (
        role === "RESTAURANT_OWNER"
    ) {

        menuItems = ownerMenu;

    } else if (
        role === "CUSTOMER"
    ) {

        menuItems = customerMenu;
    }

    // =========================================================
    // HOME
    // =========================================================

    const goHome = () => {

        closeMenu();

        navigate("/");
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <nav style={styles.navbar}>

            {/* =================================================
                LOGO
            ================================================= */}

            <button
                type="button"
                style={styles.logoButton}
                onClick={goHome}
            >
                BPR FLAVORS HUB
            </button>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div style={styles.navigation}>

                <Link
                    to="/"
                    style={styles.navLink}
                    onClick={closeMenu}
                >
                    Home
                </Link>

                <Link
                    to="/restaurants"
                    style={styles.navLink}
                    onClick={closeMenu}
                >
                    Restaurants
                </Link>

                <Link
                    to="/foods"
                    style={styles.navLink}
                    onClick={closeMenu}
                >
                    Foods
                </Link>

            </div>


            {/* =================================================
                RIGHT SECTION
            ================================================= */}

            <div style={styles.rightSection}>

                {/* =================================================
                    SUPPORT
                ================================================= */}

                {isLoggedIn && (

                    <button
                        type="button"
                        style={styles.supportButton}
                        onClick={goToSupport}
                    >

                        <span>
                            🛟
                        </span>

                        <span>
                            {role === "ADMIN"
                                ? "Support Center"
                                : "Help & Support"}
                        </span>

                    </button>
                )}


                {/* =================================================
                    CART
                ================================================= */}

                {isLoggedIn &&
                    role !== "ADMIN" && (

                        <Link
                            to="/cart"
                            style={
                                styles.cartButton
                            }
                            onClick={closeMenu}
                        >

                            <span>
                                🛒
                            </span>

                            <span>
                                My Cart
                            </span>

                        </Link>
                    )}


                {/* =================================================
                    LOGIN FOR GUEST
                ================================================= */}

                {!isLoggedIn && (

                    <Link
                        to="/login"
                        style={
                            styles.loginButton
                        }
                    >
                        Login
                    </Link>
                )}


                {/* =================================================
                    ACCOUNT
                ================================================= */}

                {isLoggedIn && (

                    <div
                        ref={accountRef}
                        style={
                            styles.accountWrapper
                        }
                    >

                        <button
                            type="button"
                            style={{
                                ...styles.accountButton,

                                ...(accountOpen
                                    ? styles.accountButtonActive
                                    : {})
                            }}
                            onClick={(event) => {

                                event.stopPropagation();

                                setAccountOpen(
                                    (previous) =>
                                        !previous
                                );
                            }}
                        >

                            <div
                                style={
                                    styles.avatar
                                }
                            >
                                {avatarLetter}
                            </div>

                            <div
                                style={
                                    styles.userInfo
                                }
                            >

                                <strong>
                                    {fullName}
                                </strong>

                                <small>
                                    {role}
                                </small>

                            </div>

                            <span
                                style={
                                    styles.arrow
                                }
                            >
                                {accountOpen
                                    ? "▲"
                                    : "▼"}
                            </span>

                        </button>


                        {/* =================================================
                            DROPDOWN
                        ================================================= */}

                        {accountOpen && (

                            <div
                                style={
                                    styles.dropdown
                                }
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                            >

                                <div
                                    style={
                                        styles.dropdownHeader
                                    }
                                >

                                    <div
                                        style={
                                            styles.largeAvatar
                                        }
                                    >
                                        {avatarLetter}
                                    </div>

                                    <div
                                        style={
                                            styles.dropdownUser
                                        }
                                    >

                                        <strong>
                                            {fullName}
                                        </strong>

                                        <span>
                                            {role}
                                        </span>

                                    </div>

                                </div>


                                <div
                                    style={
                                        styles.divider
                                    }
                                />


                                {menuItems.map(
                                    (item) => (

                                        <Link
                                            key={
                                                item.path
                                            }
                                            to={
                                                item.path
                                            }
                                            style={
                                                styles.menuItem
                                            }
                                            onClick={
                                                closeMenu
                                            }
                                        >

                                            <span
                                                style={
                                                    styles.menuIcon
                                                }
                                            >
                                                {
                                                    item.icon
                                                }
                                            </span>

                                            <div
                                                style={
                                                    styles.menuText
                                                }
                                            >

                                                <strong>
                                                    {
                                                        item.title
                                                    }
                                                </strong>

                                                <small>
                                                    {
                                                        item.subtitle
                                                    }
                                                </small>

                                            </div>

                                            <span
                                                style={
                                                    styles.menuArrow
                                                }
                                            >
                                                →
                                            </span>

                                        </Link>
                                    )
                                )}


                                <div
                                    style={
                                        styles.divider
                                    }
                                />


                                <button
                                    type="button"
                                    style={
                                        styles.logoutButton
                                    }
                                    onClick={
                                        handleLogout
                                    }
                                >

                                    <span
                                        style={
                                            styles.menuIcon
                                        }
                                    >
                                        🚪
                                    </span>

                                    <div
                                        style={
                                            styles.menuText
                                        }
                                    >

                                        <strong>
                                            Logout
                                        </strong>

                                        <small>
                                            Sign out of your account
                                        </small>

                                    </div>

                                </button>

                            </div>
                        )}

                    </div>
                )}

            </div>

        </nav>
    );
}


// =============================================================
// STYLES
// =============================================================

const styles = {

    navbar: {
        height: "70px",
        width: "100%",
        background: "#ffffff",
        borderBottom:
            "1px solid #eeeeee",
        display: "flex",
        alignItems: "center",
        padding: "0 30px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 5000
    },

    logoButton: {
        border: "none",
        background: "transparent",
        color: "#ff5722",
        fontSize: "21px",
        fontWeight: "800",
        cursor: "pointer",
        whiteSpace: "nowrap",
        padding: 0
    },

    navigation: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginLeft: "45px",
        flex: 1
    },

    navLink: {
        textDecoration: "none",
        color: "#222222",
        fontSize: "15px",
        fontWeight: "600",
        padding: "11px 15px",
        borderRadius: "8px",
        cursor: "pointer"
    },

    rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },

    supportButton: {
        border: "none",
        background: "#fff5f1",
        color: "#ff5722",
        padding: "11px 15px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "7px",
        fontWeight: "700",
        fontSize: "13px",
        cursor: "pointer"
    },

    cartButton: {
        textDecoration: "none",
        background: "#fff5f1",
        color: "#ff5722",
        padding: "11px 17px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "700",
        fontSize: "14px",
        cursor: "pointer"
    },

    loginButton: {
        textDecoration: "none",
        background: "#ff5722",
        color: "#ffffff",
        padding: "11px 18px",
        borderRadius: "10px",
        fontWeight: "700",
        fontSize: "14px"
    },

    accountWrapper: {
        position: "relative"
    },

    accountButton: {
        border: "1px solid #e5e5e5",
        background: "#ffffff",
        padding: "6px 10px",
        borderRadius: "14px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "9px",
        minWidth: "175px"
    },

    accountButtonActive: {
        border: "2px solid #222222"
    },

    avatar: {
        width: "40px",
        height: "40px",
        minWidth: "40px",
        borderRadius: "50%",
        background: "#ff5722",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "800",
        fontSize: "17px"
    },

    userInfo: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        flex: 1,
        overflow: "hidden"
    },

    arrow: {
        fontSize: "11px",
        color: "#222222"
    },

    dropdown: {
        position: "absolute",
        right: 0,
        top: "58px",
        width: "365px",
        maxHeight:
            "calc(100vh - 85px)",
        overflowY: "auto",
        background: "#ffffff",
        border: "1px solid #eeeeee",
        borderRadius: "16px",
        padding: "10px",
        boxShadow:
            "0 20px 50px rgba(0,0,0,0.16)",
        zIndex: 6000,
        boxSizing: "border-box"
    },

    dropdownHeader: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "14px 12px"
    },

    largeAvatar: {
        width: "56px",
        height: "56px",
        minWidth: "56px",
        borderRadius: "50%",
        background: "#ff5722",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "22px",
        fontWeight: "800"
    },

    dropdownUser: {
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    },

    divider: {
        height: "1px",
        background: "#eeeeee",
        margin: "7px 0"
    },

    menuItem: {
        width: "100%",
        textDecoration: "none",
        color: "#222222",
        background: "#ffffff",
        padding: "12px 10px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxSizing: "border-box",
        cursor: "pointer"
    },

    menuIcon: {
        width: "38px",
        height: "38px",
        minWidth: "38px",
        borderRadius: "9px",
        background: "#f7f7f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px"
    },

    menuText: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        flex: 1,
        textAlign: "left"
    },

    menuArrow: {
        fontSize: "18px",
        color: "#333333"
    },

    logoutButton: {
        width: "100%",
        background: "#ffffff",
        border: "none",
        padding: "12px 10px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        cursor: "pointer",
        color: "#d32f2f",
        boxSizing: "border-box"
    }
};

export default Navbar;