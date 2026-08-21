import { Link } from "react-router-dom";
import "./Dashboard.css";

function Sidebar() {

    return (

        <div className="sidebar">

            <h2>BPR Flavors Hub</h2>

            <ul>

                <li>
                    <Link to="/owner/dashboard">
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/owner/restaurant">
                        Restaurant
                    </Link>
                </li>

                <li>
                    <Link to="/owner/foods">
                        Foods
                    </Link>
                </li>

                <li>
                    <Link to="/owner/orders">
                        Orders
                    </Link>
                </li>

                <li>
                    <Link to="/owner/reports">
                        Reports
                    </Link>
                </li>

            </ul>

        </div>

    );

}

export default Sidebar;