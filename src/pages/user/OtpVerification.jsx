import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerService from "../../services/CustomerService";

function OtpVerification() {

    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {

        const savedPhone =
            sessionStorage.getItem("otpPhone");

        if (!savedPhone) {

            alert(
                "Registration information not found."
            );

            navigate("/register");

            return;
        }

        setPhone(savedPhone);

        sendOtp(savedPhone);

    }, []);

    const sendOtp = async (phoneNumber) => {

        setSending(true);

        try {

            const response =
                await CustomerService.sendOtp({
                    phone: phoneNumber
                });

            console.log(
                "OTP response:",
                response.data
            );

            setOtpSent(true);

            alert(
                "Mock OTP sent successfully. Check the Spring Boot console for the OTP."
            );

        } catch (error) {

            console.error(
                "Send OTP error:",
                error
            );

            if (error.response) {

                const message =
                    typeof error.response.data === "string"
                        ? error.response.data
                        : error.response.data?.message;

                alert(
                    message ||
                    "Unable to send OTP."
                );

            } else {

                alert(
                    "Cannot connect to backend."
                );
            }

        } finally {

            setSending(false);
        }
    };


    const handleVerify = async (e) => {

        e.preventDefault();

        if (!otp) {

            alert("Please enter the OTP.");

            return;
        }

        if (otp.length !== 6) {

            alert("OTP must contain 6 digits.");

            return;
        }

        setLoading(true);

        try {

            const response =
                await CustomerService.verifyOtp({
                    phone: phone,
                    otp: otp
                });

            console.log(
                "OTP verification response:",
                response.data
            );

            if (response.data === true) {

                alert(
                    "Phone verified successfully! Please login."
                );

                sessionStorage.removeItem(
                    "otpPhone"
                );

                sessionStorage.removeItem(
                    "otpEmail"
                );

                navigate("/login", {
                    replace: true
                });

            } else {

                alert(
                    "Invalid or expired OTP."
                );
            }

        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            if (error.response) {

                const message =
                    typeof error.response.data === "string"
                        ? error.response.data
                        : error.response.data?.message;

                alert(
                    message ||
                    "OTP verification failed."
                );

            } else {

                alert(
                    "Cannot connect to backend."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="container mt-5">

            <div
                className="card shadow mx-auto"
                style={{
                    maxWidth: "500px"
                }}
            >

                <div className="card-header bg-danger text-white text-center">

                    <h2 className="mb-0">
                        Verify Phone
                    </h2>

                    <small>
                        Enter the OTP sent to your phone
                    </small>

                </div>

                <div className="card-body p-4">

                    <div className="text-center mb-4">

                        <p className="mb-1">
                            OTP sent to
                        </p>

                        <strong>
                            {phone}
                        </strong>

                    </div>


                    <form onSubmit={handleVerify}>

                        <div className="mb-3">

                            <label className="form-label">
                                Enter 6-Digit OTP
                            </label>

                            <input
                                type="text"
                                className="form-control text-center"
                                value={otp}
                                maxLength="6"
                                placeholder="000000"
                                onChange={(e) => {

                                    const value =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6);

                                    setOtp(value);

                                }}
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="btn btn-danger w-100"
                            disabled={
                                loading ||
                                !otpSent
                            }
                        >

                            {loading
                                ? "Verifying..."
                                : "Verify OTP"
                            }

                        </button>

                    </form>


                    <div className="text-center mt-4">

                        <button
                            type="button"
                            className="btn btn-link"
                            disabled={sending}
                            onClick={() =>
                                sendOtp(phone)
                            }
                        >

                            {sending
                                ? "Sending..."
                                : "Resend OTP"
                            }

                        </button>

                    </div>


                    <div className="alert alert-info mt-3">

                        <small>

                            <strong>
                                Mock OTP:
                            </strong>{" "}
                            Check the Spring Boot console.
                            The generated OTP is printed there
                            during development.

                        </small>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default OtpVerification;