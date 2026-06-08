import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./VolunteerDashboard.css";

function VolunteerDashboard() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const handleLogout = () => {

  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  navigate("/login");

};

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {

    try {

      const response = await api.get("/food/all");
      setFoods(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  const acceptDelivery = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await api.post(
        `/food/deliver/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Delivery Accepted");

      fetchFoods();

    } catch (error) {

      console.error(error);
      alert("Failed");

    }
  };

  const availableDeliveries =
    foods.filter(food => food.status === "CLAIMED");

  const completedDeliveries =
    foods.filter(food => food.status === "DELIVERED");

  return (

    <div className="volunteer-page">

      {/* Sidebar */}

      <div className="sidebar">

        <h2>MealBridge</h2>

        <ul>
          <li>Dashboard</li>
          <li>Available Deliveries</li>
          <li>My Deliveries</li>
          <li>Notifications</li>
          <li>Profile</li>
          <li
  onClick={handleLogout}
  style={{ cursor: "pointer" }}
>
  Logout
</li>
        </ul>

      </div>

      {/* Main Content */}

      <div className="main-content">

        <h1 className="welcome-title">
          Welcome Back, Volunteer 🚚
        </h1>

        {/* Stats */}

        <div className="stats-grid">

          <div className="stat-card">
            <h3>Available Deliveries</h3>
            <h2>{availableDeliveries.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <h2>{completedDeliveries.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Meals Delivered</h3>
            <h2>{completedDeliveries.length * 20}</h2>
          </div>

          <div className="stat-card">
            <h3>Lives Helped</h3>
            <h2>{completedDeliveries.length * 8}</h2>
          </div>

        </div>

        {/* Main Grid */}

        <div className="dashboard-grid">

          {/* Deliveries */}

          <div className="delivery-card">

            <h2>Available Deliveries</h2>

            <table className="table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Food</th>
                  <th>Qty</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {foods.map(food => (

                  <tr key={food.id}>

                    <td>{food.id}</td>
                    <td>{food.food_name}</td>
                    <td>{food.quantity}</td>
                    <td>{food.food_type}</td>
                    <td>{food.status}</td>

                    <td>

                      {food.status === "CLAIMED" ? (

                        <button
                          className="accept-btn"
                          onClick={() =>
                            acceptDelivery(food.id)
                          }
                        >
                          Deliver
                        </button>

                      ) : (

                        "Done"

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Impact Card */}

          <div className="impact-card">

            <h2>🚚 Your Impact</h2>

            <p>
              Every delivery connects food
              with someone who needs it.
            </p>

            <div className="impact-number">
              {completedDeliveries.length}
            </div>

            <p>Deliveries Completed</p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default VolunteerDashboard;