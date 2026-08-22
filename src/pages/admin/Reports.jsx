import { useEffect, useState } from "react";
import API from "../../services/ApiService";

function Reports() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ======================================================
    // LOAD REPORT
    // ======================================================

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/admin/reports");

            setReport(response.data);

        } catch (error) {
            console.error(
                "Failed to load reports:",
                error
            );

            if (error.response?.status === 401) {
                setError(
                    "Your session has expired. Please login again."
                );
            } else if (error.response?.status === 403) {
                setError(
                    "You do not have permission to view admin reports."
                );
            } else if (error.response?.status === 404) {
                setError(
                    "Reports API endpoint was not found on the backend."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Reports API is not available."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // HELPER
    // ======================================================

    const getValue = (value) => {
        if (
            value === null ||
            value === undefined
        ) {
            return 0;
        }

        return value;
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="container mt-4">

                <h2>
                    Reports
                </h2>

                <div className="alert alert-info mt-3">
                    Loading reports...
                </div>

            </div>
        );
    }

    // ======================================================
    // ERROR
    // ======================================================

    if (error) {
        return (
            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2 className="mb-0">
                        Reports
                    </h2>

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={loadReports}
                    >
                        🔄 Retry
                    </button>

                </div>

                <div className="alert alert-warning">

                    <h5>
                        Reports are not available.
                    </h5>

                    <p className="mb-0">
                        {error}
                    </p>

                </div>

            </div>
        );
    }

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="container mt-4 mb-5">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="mb-0">
                    Admin Reports
                </h2>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={loadReports}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div className="row g-4 mb-4">

                {/* TOTAL USERS */}

                <div className="col-md-3">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Users
                            </h6>

                            <h2>
                                {getValue(
                                    report?.totalUsers
                                )}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* RESTAURANTS */}

                <div className="col-md-3">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Restaurants
                            </h6>

                            <h2>
                                {getValue(
                                    report?.totalRestaurants
                                )}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* FOODS */}

                <div className="col-md-3">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Food Items
                            </h6>

                            <h2>
                                {getValue(
                                    report?.totalFoods
                                )}
                            </h2>

                        </div>

                    </div>

                </div>

                {/* ORDERS */}

                <div className="col-md-3">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Orders
                            </h6>

                            <h2>
                                {getValue(
                                    report?.totalOrders
                                )}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                SALES
            ================================================== */}

            <div className="row g-4 mb-4">

                {/* TOTAL REVENUE */}

                <div className="col-md-4">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h5>
                                Total Revenue
                            </h5>

                            <h2 className="text-success">

                                ₹
                                {getValue(
                                    report?.totalRevenue
                                )}

                            </h2>

                        </div>

                    </div>

                </div>

                {/* PENDING ORDERS */}

                <div className="col-md-4">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h5>
                                Pending Orders
                            </h5>

                            <h2 className="text-warning">

                                {getValue(
                                    report?.pendingOrders
                                )}

                            </h2>

                        </div>

                    </div>

                </div>

                {/* COMPLETED ORDERS */}

                <div className="col-md-4">

                    <div className="card shadow h-100">

                        <div className="card-body">

                            <h5>
                                Completed Orders
                            </h5>

                            <h2 className="text-primary">

                                {getValue(
                                    report?.completedOrders
                                )}

                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================================
                REPORT DATA
            ================================================== */}

            <div className="card shadow">

                <div className="card-header bg-dark text-white">

                    <h4 className="mb-0">
                        Report Details
                    </h4>

                </div>

                <div className="card-body">

                    {report ? (

                        <div className="table-responsive">

                            <table className="table table-bordered">

                                <tbody>

                                    {Object.entries(report).map(
                                        ([key, value]) => (

                                            <tr key={key}>

                                                <th>
                                                    {key}
                                                </th>

                                                <td>

                                                    {typeof value ===
                                                    "object" &&
                                                    value !== null
                                                        ? JSON.stringify(
                                                            value
                                                        )
                                                        : String(
                                                            value
                                                        )}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div className="alert alert-info">
                            No report data available.
                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Reports;