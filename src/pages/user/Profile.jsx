import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        role: "CUSTOMER",
        id: "",
        createdAt: "",
    });

    const [photo, setPhoto] = useState(null);
    const [showEdit, setShowEdit] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
    });

    /* =========================================================
       LOAD PROFILE FROM LOCAL STORAGE
       NO BACKEND REQUEST
    ========================================================= */

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            /*
             * Try different possible localStorage objects
             * used by the login page.
             */

            const storedUser =
                localStorage.getItem("user") ||
                localStorage.getItem("userData") ||
                localStorage.getItem("profile");

            let user = {};

            if (storedUser) {
                try {
                    user = JSON.parse(storedUser);
                } catch (error) {
                    console.log("Stored user is not JSON");
                }
            }

            /*
             * Read JWT claims as a fallback.
             */

            let jwtData = {};

            try {
                const tokenParts = token.split(".");

                if (tokenParts.length === 3) {
                    jwtData = JSON.parse(
                        atob(
                            tokenParts[1]
                                .replace(/-/g, "+")
                                .replace(/_/g, "/")
                        )
                    );
                }
            } catch (error) {
                console.log("Unable to decode token");
            }

            const finalProfile = {
                fullName:
                    user.fullName ||
                    user.name ||
                    localStorage.getItem("fullName") ||
                    jwtData.fullName ||
                    jwtData.name ||
                    "User",

                phone:
                    user.phone ||
                    user.phoneNumber ||
                    localStorage.getItem("phone") ||
                    localStorage.getItem("phoneNumber") ||
                    jwtData.phone ||
                    jwtData.phoneNumber ||
                    "",

                email:
                    user.email ||
                    localStorage.getItem("email") ||
                    jwtData.email ||
                    "",

                address:
                    user.address ||
                    localStorage.getItem("address") ||
                    jwtData.address ||
                    "",

                role:
                    user.role ||
                    localStorage.getItem("role") ||
                    jwtData.role ||
                    "CUSTOMER",

                id:
                    user.id ||
                    user.userId ||
                    localStorage.getItem("userId") ||
                    jwtData.userId ||
                    jwtData.id ||
                    "",

                createdAt:
                    user.createdAt ||
                    localStorage.getItem("createdAt") ||
                    jwtData.createdAt ||
                    "",
            };

            setProfile(finalProfile);

            setFormData({
                fullName: finalProfile.fullName || "",
                phone: finalProfile.phone || "",
                email: finalProfile.email || "",
                address: finalProfile.address || "",
            });

            const savedPhoto = localStorage.getItem("profilePhoto");

            if (savedPhoto) {
                setPhoto(savedPhoto);
            }

        } catch (error) {
            console.error("Profile loading error:", error);
        }
    };

    /* =========================================================
       PHOTO
    ========================================================= */

    const handlePhotoChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const imageData = reader.result;

            setPhoto(imageData);
            localStorage.setItem("profilePhoto", imageData);
        };

        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setPhoto(null);
        localStorage.removeItem("profilePhoto");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /* =========================================================
       EDIT PROFILE
    ========================================================= */

    const openEditModal = () => {
        setFormData({
            fullName: profile.fullName || "",
            phone: profile.phone || "",
            email: profile.email || "",
            address: profile.address || "",
        });

        setShowEdit(true);
    };

    const closeEditModal = () => {
        setShowEdit(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const saveProfile = () => {
        const updatedProfile = {
            ...profile,
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
        };

        setProfile(updatedProfile);

        /*
         * Save profile locally so the page works
         * without making the failing /profile API call.
         */

        localStorage.setItem(
            "user",
            JSON.stringify(updatedProfile)
        );

        localStorage.setItem(
            "fullName",
            formData.fullName
        );

        localStorage.setItem(
            "phone",
            formData.phone
        );

        localStorage.setItem(
            "email",
            formData.email
        );

        localStorage.setItem(
            "address",
            formData.address
        );

        setShowEdit(false);
    };

    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userData");
        localStorage.removeItem("profile");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");

        navigate("/login");
    };

    /* =========================================================
       INITIAL
    ========================================================= */

    const initial =
        profile.fullName?.trim()?.charAt(0)?.toUpperCase() || "U";

    const role =
        profile.role?.replace("ROLE_", "")?.toUpperCase() ||
        "CUSTOMER";

    return (
        <div className="profile-page">

            <div className="profile-container">

                {/* =================================================
                    BREADCRUMB
                ================================================= */}

                <div className="profile-breadcrumb">
                    <span onClick={() => navigate("/")}>
                        Home
                    </span>

                    <span>›</span>

                    <strong>Profile</strong>
                </div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="profile-title-section">

                    <div>
                        <h1>My Profile</h1>

                        <p>
                            Manage your personal information and account settings.
                        </p>
                    </div>

                    <button
                        className="edit-profile-top-btn"
                        onClick={openEditModal}
                    >
                        ✏️ Edit Profile
                    </button>

                </div>

                {/* =================================================
                    PROFILE HEADER
                ================================================= */}

                <div className="profile-header-card">

                    <div className="profile-photo-section">

                        <div className="profile-photo-wrapper">

                            {photo ? (
                                <img
                                    src={photo}
                                    alt="Profile"
                                    className="profile-photo"
                                />
                            ) : (
                                <div className="profile-avatar">
                                    {initial}
                                </div>
                            )}

                            <button
                                className="camera-button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                title="Change photo"
                            >
                                📷
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handlePhotoChange}
                            />

                        </div>

                        {photo && (
                            <button
                                className="remove-photo-btn"
                                onClick={removePhoto}
                            >
                                Remove photo
                            </button>
                        )}

                    </div>

                    <div className="profile-main-info">

                        <div className="profile-name-row">

                            <div>

                                <h2>
                                    {profile.fullName || "User"}
                                </h2>

                                <span className="role-badge">
                                    {role}
                                </span>

                            </div>

                            <div className="account-status">

                                <span className="status-dot"></span>

                                Active

                            </div>

                        </div>

                        <div className="profile-contact-grid">

                            <div className="contact-item">

                                <div className="contact-icon">
                                    📱
                                </div>

                                <div>

                                    <small>
                                        Phone Number
                                    </small>

                                    <strong>
                                        {profile.phone || "Not available"}
                                    </strong>

                                </div>

                            </div>

                            <div className="contact-item">

                                <div className="contact-icon">
                                    ✉️
                                </div>

                                <div>

                                    <small>
                                        Email Address
                                    </small>

                                    <strong>
                                        {profile.email || "Not available"}
                                    </strong>

                                </div>

                            </div>

                            <div className="contact-item">

                                <div className="contact-icon">
                                    📅
                                </div>

                                <div>

                                    <small>
                                        Member Since
                                    </small>

                                    <strong>
                                        {profile.createdAt
                                            ? new Date(
                                                profile.createdAt
                                            ).toLocaleDateString()
                                            : "Not available"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    QUICK ACTIONS
                    NO COUNTS
                    NO FAVORITES
                ================================================= */}

                <div className="quick-actions">

                    {/* ORDERS */}

                    <button
                        className="quick-action-card"
                        onClick={() => navigate("/orders")}
                    >

                        <div className="quick-icon orders-icon">
                            📦
                        </div>

                        <div className="quick-content">

                            <h3>
                                My Orders
                            </h3>

                            <p>
                                Track your orders
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>

                    {/* WISHLIST */}

                    <button
                        className="quick-action-card"
                        onClick={() => navigate("/wishlist")}
                    >

                        <div className="quick-icon wishlist-icon">
                            💜
                        </div>

                        <div className="quick-content">

                            <h3>
                                Wishlist
                            </h3>

                            <p>
                                Your saved foods
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>

                    {/* CART */}

                    <button
                        className="quick-action-card"
                        onClick={() => navigate("/cart")}
                    >

                        <div className="quick-icon cart-icon">
                            🛒
                        </div>

                        <div className="quick-content">

                            <h3>
                                My Cart
                            </h3>

                            <p>
                                View your cart
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </button>

                </div>

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <div className="information-card">

                    <div className="section-heading">

                        <div className="section-icon">
                            👤
                        </div>

                        <div>

                            <span>
                                PERSONAL
                            </span>

                            <h2>
                                Personal Information
                            </h2>

                        </div>

                        <button
                            className="small-edit-btn"
                            onClick={openEditModal}
                        >
                            ✏️ Edit
                        </button>

                    </div>

                    <div className="information-grid">

                        <div className="information-item">

                            <span className="info-label">
                                Full Name
                            </span>

                            <strong>
                                {profile.fullName || "Not available"}
                            </strong>

                        </div>

                        <div className="information-item">

                            <span className="info-label">
                                Phone Number
                            </span>

                            <strong>
                                {profile.phone || "Not available"}
                            </strong>

                        </div>

                        <div className="information-item">

                            <span className="info-label">
                                Email Address
                            </span>

                            <strong>
                                {profile.email || "Not available"}
                            </strong>

                        </div>

                        <div className="information-item">

                            <span className="info-label">
                                Role
                            </span>

                            <strong>
                                {role}
                            </strong>

                        </div>

                        <div className="information-item full-width">

                            <span className="info-label">
                                Address
                            </span>

                            <strong>
                                {profile.address || "Not available"}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <div className="information-card">

                    <div className="section-heading">

                        <div className="section-icon account-icon">
                            🔐
                        </div>

                        <div>

                            <span>
                                ACCOUNT
                            </span>

                            <h2>
                                Account Information
                            </h2>

                        </div>

                    </div>

                    <div className="account-grid">

                        <div className="account-info-box">

                            <span>
                                Customer ID
                            </span>

                            <strong>
                                {profile.id || "Not available"}
                            </strong>

                        </div>

                        <div className="account-info-box">

                            <span>
                                Account Role
                            </span>

                            <strong>
                                {role}
                            </strong>

                        </div>

                        <div className="account-info-box">

                            <span>
                                Account Status
                            </span>

                            <strong className="active-text">
                                Active
                            </strong>

                        </div>

                        <div className="account-info-box">

                            <span>
                                Member Since
                            </span>

                            <strong>
                                {profile.createdAt
                                    ? new Date(
                                        profile.createdAt
                                    ).toLocaleDateString()
                                    : "Not available"}
                            </strong>

                        </div>

                    </div>

                    <div className="account-actions">

                        <button
                            className="account-action-button"
                            onClick={openEditModal}
                        >
                            ✏️ Edit Profile
                        </button>

                        <button
                            className="account-action-button logout-action"
                            onClick={handleLogout}
                        >
                            🚪 Logout
                        </button>

                    </div>

                </div>

            </div>

            {/* =====================================================
                EDIT PROFILE MODAL
            ===================================================== */}

            {showEdit && (

                <div
                    className="modal-overlay"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            closeEditModal();
                        }
                    }}
                >

                    <div className="edit-modal">

                        <div className="modal-header">

                            <div>

                                <span>
                                    PROFILE
                                </span>

                                <h2>
                                    Edit Profile
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                onClick={closeEditModal}
                            >
                                ×
                            </button>

                        </div>

                        <div className="modal-body">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                            />

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                            />

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                            />

                            <label>
                                Address
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter address"
                                rows="4"
                            />

                        </div>

                        <div className="modal-footer">

                            <button
                                className="cancel-button"
                                onClick={closeEditModal}
                            >
                                Cancel
                            </button>

                            <button
                                className="save-button"
                                onClick={saveProfile}
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Profile;