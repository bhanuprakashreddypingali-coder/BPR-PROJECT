import React, { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import api from "../../services/ApiService";

const Login = () => {

    const navigate = useNavigate();

    const [phone, setPhone] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // =========================================================
    // LOGIN
    // =========================================================

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");

        const cleanPhone =
            phone.trim();

        // =====================================================
        // VALIDATION
        // =====================================================

        if (
            !cleanPhone ||
            !password
        ) {

            setError(
                "Please enter phone number and password."
            );

            return;
        }

        if (
            !/^\d{10}$/.test(
                cleanPhone
            )
        ) {

            setError(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }

        try {

            setLoading(true);

            // =================================================
            // LOGIN API
            // =================================================

            const response =
                await api.post(
                    "/auth/login",
                    {
                        phone: cleanPhone,
                        password: password
                    }
                );

            const data =
                response.data;

            if (!data) {

                setError(
                    "Login failed. Server returned an empty response."
                );

                return;
            }

            // =================================================
            // JWT
            // =================================================

            const token =
                data.token ||
                data.jwt ||
                data.jwtToken ||
                data.accessToken ||
                data.access_token;

            if (!token) {

                setError(
                    "Login failed: server did not return an authentication token."
                );

                return;
            }

            // =================================================
            // ROLE
            // =================================================

            const role =
                String(
                    data.role ||
                    data.user?.role ||
                    ""
                )
                    .trim()
                    .replace(
                        /^ROLE_/i,
                        ""
                    )
                    .toUpperCase();

            if (!role) {

                setError(
                    "Login failed: user role was not returned by the server."
                );

                return;
            }

            // =================================================
            // OWNER APPROVAL
            // =================================================

            const approved =
                data.approved ??
                data.user?.approved ??
                true;

            // =================================================
            // CLEAR PREVIOUS AUTH
            // =================================================

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "role"
            );

            // =================================================
            // SAVE JWT
            // =================================================

            localStorage.setItem(
                "token",
                String(token)
            );

            // =================================================
            // SAVE USER
            // =================================================

            const userData = {
                ...data,
                role: role
            };

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            // =================================================
            // SAVE ROLE
            // =================================================

            localStorage.setItem(
                "role",
                role
            );

            // =================================================
            // ADMIN
            // =================================================

            if (
                role === "ADMIN"
            ) {

                navigate(
                    "/admin/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }

            // =================================================
            // RESTAURANT OWNER
            // =================================================

            if (
                role === "RESTAURANT_OWNER"
            ) {

                if (
                    approved === false
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    localStorage.removeItem(
                        "role"
                    );

                    setError(
                        "Your restaurant owner account is waiting for admin approval."
                    );

                    return;
                }

                navigate(
                    "/owner/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }

            // =================================================
            // CUSTOMER
            // =================================================

            if (
                role === "CUSTOMER"
            ) {

                navigate(
                    "/",
                    {
                        replace: true
                    }
                );

                return;
            }

            // =================================================
            // UNKNOWN ROLE
            // =================================================

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "role"
            );

            setError(
                `Unknown account role: ${role}`
            );

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            const status =
                error.response?.status;

            const backendData =
                error.response?.data;

            // =================================================
            // 401
            // =================================================

            if (
                status === 401
            ) {

                setError(
                    "Invalid phone number or password."
                );

                return;
            }

            // =================================================
            // 403
            // =================================================

            if (
                status === 403
            ) {

                setError(
                    typeof backendData ===
                    "string"
                        ? backendData
                        : backendData?.message ||
                          "Access denied."
                );

                return;
            }

            // =================================================
            // 400
            // =================================================

            if (
                status === 400
            ) {

                setError(
                    typeof backendData ===
                    "string"
                        ? backendData
                        : backendData?.message ||
                          "Invalid login request."
                );

                return;
            }

            // =================================================
            // OTHER BACKEND ERROR
            // =================================================

            if (
                backendData?.message
            ) {

                setError(
                    backendData.message
                );

                return;
            }

            if (
                typeof backendData ===
                "string"
            ) {

                setError(
                    backendData
                );

                return;
            }

            // =================================================
            // NETWORK ERROR
            // =================================================

            setError(
                "Login failed. Please check that the backend is running."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (

        <div style={styles.page}>

            <div style={styles.card}>

                <div style={styles.logo}>
                    BPR FLAVORS HUB
                </div>

                <h1 style={styles.title}>
                    Welcome Back
                </h1>

                <p style={styles.subtitle}>
                    Login using your phone number
                </p>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div style={styles.error}>
                        {error}
                    </div>
                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleLogin}
                >

                    {/* PHONE */}

                    <label
                        style={
                            styles.label
                        }
                    >
                        Phone Number
                    </label>

                    <input
                        type="tel"
                        value={phone}
                        onChange={(event) => {

                            const value =
                                event.target.value
                                    .replace(
                                        /\D/g,
                                        ""
                                    );

                            setPhone(value);
                        }}
                        placeholder="Enter 10-digit phone number"
                        style={styles.input}
                        maxLength={10}
                        autoComplete="tel"
                    />


                    {/* PASSWORD */}

                    <label
                        style={
                            styles.label
                        }
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        placeholder="Enter your password"
                        style={styles.input}
                        autoComplete="current-password"
                    />


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading
                                ? 0.7
                                : 1
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>


                {/* =================================================
                    REGISTER
                ================================================= */}

                <div
                    style={
                        styles.registerSection
                    }
                >

                    <span>
                        Don't have an account?
                    </span>

                    <Link
                        to="/register"
                        style={
                            styles.registerLink
                        }
                    >
                        Register
                    </Link>

                </div>


                {/* =================================================
                    BACK HOME
                ================================================= */}

                <Link
                    to="/"
                    style={
                        styles.homeLink
                    }
                >
                    ← Back to Home
                </Link>

            </div>

        </div>
    );
};


// =============================================================
// STYLES
// =============================================================

const styles = {

    page: {
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "linear-gradient(135deg, #fff7f2 0%, #f7f8fa 100%)",
        padding: "25px",
        boxSizing: "border-box"
    },

    card: {
        width: "100%",
        maxWidth: "430px",
        background: "#ffffff",
        padding: "38px",
        borderRadius: "20px",
        boxShadow:
            "0 16px 50px rgba(0,0,0,0.10)",
        boxSizing: "border-box"
    },

    logo: {
        textAlign: "center",
        color: "#ff5722",
        fontSize: "20px",
        fontWeight: "900",
        letterSpacing: "0.5px",
        marginBottom: "12px"
    },

    title: {
        textAlign: "center",
        margin: "0 0 7px",
        color: "#202124",
        fontSize: "28px"
    },

    subtitle: {
        textAlign: "center",
        color: "#777777",
        margin:
            "0 0 25px"
    },

    error: {
        background: "#fff1f2",
        color: "#c62828",
        border:
            "1px solid #fecdd3",
        padding: "12px",
        borderRadius: "10px",
        marginBottom: "18px",
        fontSize: "14px",
        lineHeight: "1.4"
    },

    label: {
        display: "block",
        marginBottom: "7px",
        fontWeight: "700",
        color: "#222222",
        fontSize: "14px"
    },

    input: {
        width: "100%",
        padding: "13px 14px",
        marginBottom: "18px",
        border:
            "1px solid #dddddd",
        borderRadius: "10px",
        fontSize: "15px",
        boxSizing: "border-box",
        outline: "none"
    },

    button: {
        width: "100%",
        padding: "13px",
        border: "none",
        borderRadius: "10px",
        background: "#ff5722",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
        marginTop: "4px"
    },

    registerSection: {
        marginTop: "22px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px",
        fontSize: "14px",
        color: "#555555"
    },

    registerLink: {
        color: "#ff5722",
        fontWeight: "800",
        textDecoration: "none"
    },

    homeLink: {
        display: "block",
        textAlign: "center",
        marginTop: "20px",
        color: "#667085",
        textDecoration: "none",
        fontSize: "13px"
    }
};

export default Login;