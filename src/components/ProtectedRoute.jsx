import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
    children,
    allowedRoles = []
}) => {

    const location = useLocation();

    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    /*
     * ==========================================================
     * NOT LOGGED IN
     * ==========================================================
     */

    if (!token) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname
                }}
            />
        );
    }

    /*
     * ==========================================================
     * GET USER
     * ==========================================================
     */

    let user = null;

    try {

        if (userString) {
            user = JSON.parse(userString);
        }

    } catch (error) {

        console.error(
            "Invalid user data in localStorage"
        );

        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("token");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    /*
     * ==========================================================
     * GET ROLE
     * ==========================================================
     *
     * We check both:
     *
     * localStorage.role
     *
     * and
     *
     * user.role
     *
     */

    const role = String(
        storedRole ||
        user?.role ||
        ""
    )
        .trim()
        .toUpperCase();

    /*
     * ==========================================================
     * NO ROLE
     * ==========================================================
     */

    if (!role) {

        console.error(
            "No role found for logged-in user."
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    /*
     * ==========================================================
     * ROLE AUTHORIZATION
     * ==========================================================
     */

    const normalizedAllowedRoles =
        allowedRoles.map((item) =>
            String(item)
                .trim()
                .toUpperCase()
        );

    /*
     * If no specific role restriction,
     * allow authenticated user.
     */

    if (normalizedAllowedRoles.length === 0) {

        return children;
    }

    /*
     * User does not have permission.
     */

    if (!normalizedAllowedRoles.includes(role)) {

        console.warn(
            "Access denied.",
            {
                userRole: role,
                allowedRoles: normalizedAllowedRoles,
                requestedPath: location.pathname
            }
        );

        /*
         * Send user to their correct dashboard.
         */

        if (role === "ADMIN") {

            return (
                <Navigate
                    to="/admin/dashboard"
                    replace
                />
            );
        }

        if (role === "RESTAURANT_OWNER") {

            return (
                <Navigate
                    to="/owner/dashboard"
                    replace
                />
            );
        }

        if (role === "CUSTOMER") {

            return (
                <Navigate
                    to="/"
                    replace
                />
            );
        }

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    /*
     * ==========================================================
     * AUTHORIZED
     * ==========================================================
     */

    return children;
};

export default ProtectedRoute;