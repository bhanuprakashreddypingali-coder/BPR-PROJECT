import {
    Link,
    useLocation
} from "react-router-dom";

function PaymentFailed() {

    const location = useLocation();

    const state =
        location.state || {};

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-6">

                    <div className="card shadow">

                        <div className="card-body text-center">

                            <h1 className="text-danger">
                                ❌ Payment Failed
                            </h1>

                            <hr />

                            <p className="lead">
                                Sorry, your payment could
                                not be completed.
                            </p>

                            {state.message && (

                                <div
                                    className=
                                        "alert alert-danger"
                                >
                                    {state.message}
                                </div>

                            )}

                            <p>
                                Please try again from
                                your Orders page.
                            </p>

                            <div className="mt-4">

                                <Link
                                    to="/orders"
                                    className=
                                        "btn btn-warning me-2"
                                >
                                    💳 Retry Payment
                                </Link>

                                <Link
                                    to="/"
                                    className=
                                        "btn btn-primary"
                                >
                                    🏠 Home
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default PaymentFailed;