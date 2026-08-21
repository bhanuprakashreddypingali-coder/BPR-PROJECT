import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/ApiService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "CUSTOMER"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // =========================================================
    // REGISTER
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const fullName = formData.fullName.trim();
        const email = formData.email.trim();
        const password = formData.password;
        const phone = formData.phone.trim();
        const address = formData.address.trim();
        const role = formData.role;

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!fullName) {
            setError("Please enter your full name.");
            return;
        }

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            setError(
                "Please enter a valid 10-digit phone number."
            );
            return;
        }

        if (!address) {
            setError("Please enter your address.");
            return;
        }

        try {
            setLoading(true);

            console.log("======================================");
            console.log("REGISTRATION REQUEST");
            console.log("PHONE:", phone);
            console.log("ROLE:", role);
            console.log("======================================");

            // =================================================
            // REGISTER USER
            // NO OTP
            // =================================================

            const response = await API.post(
                "/auth/register",
                {
                    fullName,
                    email,
                    password,
                    phone,
                    address,
                    role
                }
            );

            console.log("======================================");
            console.log("REGISTRATION RESPONSE");
            console.log(response.data);
            console.log("======================================");

            // =================================================
            // RESTAURANT OWNER
            // =================================================

            if (role === "RESTAURANT_OWNER") {
                setSuccess(
                    "Registration successful! Your restaurant owner account has been created and is waiting for admin approval."
                );
            } else {
                // =================================================
                // CUSTOMER
                // =================================================

                setSuccess(
                    "Registration successful! You can now login with your phone number and password."
                );
            }

            // =================================================
            // REDIRECT TO LOGIN
            // =================================================

            setTimeout(() => {
                navigate("/login", {
                    replace: true
                });
            }, 1800);

        } catch (error) {
            console.error("======================================");
            console.error("REGISTRATION ERROR");
            console.error(error);
            console.error("======================================");

            const status = error.response?.status;
            const backendMessage = error.response?.data;

            // =================================================
            // EMAIL EXISTS
            // =================================================

            if (
                status === 409 &&
                typeof backendMessage === "string" &&
                backendMessage.toLowerCase().includes("email")
            ) {
                setError(
                    "Email already exists. Please use another email."
                );
                return;
            }

            // =================================================
            // PHONE EXISTS
            // =================================================

            if (
                status === 409 &&
                typeof backendMessage === "string" &&
                (
                    backendMessage.toLowerCase().includes("phone") ||
                    backendMessage.toLowerCase().includes("mobile")
                )
            ) {
                setError(
                    "Phone number already exists. Please use another phone number."
                );
                return;
            }

            // =================================================
            // STRING RESPONSE
            // =================================================

            if (typeof backendMessage === "string") {
                setError(backendMessage);
                return;
            }

            // =================================================
            // OBJECT RESPONSE
            // =================================================

            if (backendMessage?.message) {
                setError(backendMessage.message);
                return;
            }

            // =================================================
            // VALIDATION ERRORS
            // =================================================

            if (backendMessage?.error) {
                setError(backendMessage.error);
                return;
            }

            // =================================================
            // NETWORK ERROR
            // =================================================

            if (!error.response) {
                setError(
                    "Unable to connect to the backend. Please make sure Spring Boot is running."
                );
                return;
            }

            setError(
                "Registration failed. Please check your details and try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                {/* =================================================
                    HEADER
                ================================================= */}

                <div style={styles.header}>

                    <div style={styles.logoBox}>
                        🍴
                    </div>

                    <h1 style={styles.title}>
                        Create Account
                    </h1>

                    <p style={styles.subtitle}>
                        Join BPR Flavors Hub today
                    </p>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div style={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (
                    <div style={styles.success}>
                        ✓ {success}
                    </div>
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    {/* FULL NAME */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            style={styles.input}
                            autoComplete="name"
                            required
                        />

                    </div>

                    {/* EMAIL */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={styles.input}
                            autoComplete="email"
                            required
                        />

                    </div>

                    {/* PHONE */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => {

                                const value =
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 10);

                                setFormData((previous) => ({
                                    ...previous,
                                    phone: value
                                }));

                                setError("");
                            }}
                            placeholder="10-digit phone number"
                            style={styles.input}
                            maxLength={10}
                            inputMode="numeric"
                            autoComplete="tel"
                            required
                        />

                        <small style={styles.helper}>
                            Your phone number will be used to login.
                        </small>

                    </div>

                    {/* PASSWORD */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            style={styles.input}
                            minLength={6}
                            autoComplete="new-password"
                            required
                        />

                        <small style={styles.helper}>
                            Minimum 6 characters
                        </small>

                    </div>

                    {/* ADDRESS */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Delivery Address
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your delivery address"
                            style={{
                                ...styles.input,
                                minHeight: "90px",
                                resize: "vertical"
                            }}
                            rows={3}
                            required
                        />

                    </div>

                    {/* ACCOUNT TYPE */}

                    <div style={styles.field}>

                        <label style={styles.label}>
                            Account Type
                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={styles.input}
                        >

                            <option value="CUSTOMER">
                                Customer
                            </option>

                            <option value="RESTAURANT_OWNER">
                                Restaurant Owner
                            </option>

                        </select>

                    </div>

                    {/* OWNER NOTICE */}

                    {formData.role === "RESTAURANT_OWNER" && (
                        <div style={styles.ownerNotice}>
                            <strong>
                                Restaurant Owner
                            </strong>

                            <p style={styles.ownerText}>
                                Your account will be created successfully,
                                but restaurant owner access requires
                                approval from an administrator.
                            </p>
                        </div>
                    )}

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <div style={styles.loginText}>

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        style={styles.loginLink}
                    >
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
}

// =============================================================
// STYLES
// =============================================================

const styles = {

    page: {
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "linear-gradient(135deg, #fff7f3 0%, #ffffff 50%, #fff3ed 100%)",
        padding: "40px 20px",
        boxSizing: "border-box"
    },

    card: {
        width: "100%",
        maxWidth: "520px",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "35px",
        boxSizing: "border-box",
        boxShadow:
            "0 15px 45px rgba(0,0,0,0.10)",
        border:
            "1px solid rgba(255,87,34,0.08)"
    },

    header: {
        textAlign: "center",
        marginBottom: "28px"
    },

    logoBox: {
        width: "58px",
        height: "58px",
        margin: "0 auto 15px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ff5722",
        color: "#ffffff",
        fontSize: "28px",
        boxShadow:
            "0 8px 20px rgba(255,87,34,0.25)"
    },

    title: {
        margin: 0,
        fontSize: "30px",
        fontWeight: "800",
        color: "#1f2937"
    },

    subtitle: {
        marginTop: "8px",
        color: "#777",
        fontSize: "15px"
    },

    field: {
        marginBottom: "18px"
    },

    label: {
        display: "block",
        marginBottom: "7px",
        color: "#252525",
        fontSize: "14px",
        fontWeight: "700"
    },

    input: {
        width: "100%",
        padding: "13px 14px",
        border: "1px solid #dddddd",
        borderRadius: "10px",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
        background: "#ffffff",
        color: "#222"
    },

    helper: {
        display: "block",
        marginTop: "6px",
        color: "#888",
        fontSize: "12px"
    },

    button: {
        width: "100%",
        padding: "14px",
        marginTop: "5px",
        border: "none",
        borderRadius: "10px",
        background:
            "linear-gradient(135deg, #ff5722, #ff7043)",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        boxShadow:
            "0 8px 18px rgba(255,87,34,0.22)"
    },

    error: {
        background: "#fff0f0",
        color: "#c62828",
        border: "1px solid #ffcdd2",
        padding: "12px 14px",
        borderRadius: "10px",
        marginBottom: "20px",
        fontSize: "14px"
    },

    success: {
        background: "#edf9f1",
        color: "#218838",
        border: "1px solid #b8e6c4",
        padding: "12px 14px",
        borderRadius: "10px",
        marginBottom: "20px",
        fontSize: "14px"
    },

    ownerNotice: {
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: "10px",
        padding: "13px 15px",
        marginBottom: "18px",
        color: "#9a3412",
        fontSize: "14px"
    },

    ownerText: {
        margin: "6px 0 0",
        lineHeight: "1.5"
    },

    loginText: {
        textAlign: "center",
        marginTop: "24px",
        color: "#666",
        fontSize: "14px"
    },

    loginLink: {
        color: "#ff5722",
        fontWeight: "700",
        textDecoration: "none"
    }
};

export default Register;