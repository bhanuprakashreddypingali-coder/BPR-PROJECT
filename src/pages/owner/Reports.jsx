import { useEffect, useState } from "react";
import API from "../../services/ApiService";

function Reports() {

    const [dashboard, setDashboard] = useState({
        totalFoods: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const response = await API.get("/owner/dashboard");

            setDashboard(response.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load reports.");

        }

    };

    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                📊 Restaurant Reports
            </h2>

            <div className="row">

                <div className="col-md-3">

                    <div className="card text-white bg-primary mb-3 shadow">

                        <div className="card-body">

                            <h5>Total Foods</h5>

                            <h2>{dashboard.totalFoods}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card text-white bg-success mb-3 shadow">

                        <div className="card-body">

                            <h5>Total Orders</h5>

                            <h2>{dashboard.totalOrders}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card text-white bg-warning mb-3 shadow">

                        <div className="card-body">

                            <h5>Pending Orders</h5>

                            <h2>{dashboard.pendingOrders}</h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card text-white bg-dark mb-3 shadow">

                        <div className="card-body">

                            <h5>Completed Orders</h5>

                            <h2>{dashboard.completedOrders}</h2>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Reports;