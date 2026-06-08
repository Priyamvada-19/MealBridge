import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./NGODashboard.css";

function NGODashboard() {
const navigate = useNavigate();
const [foods, setFoods] = useState([]);

const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");

  navigate("/login");

};

useEffect(() => {

  fetchFoods();

  const interval = setInterval(() => {
    fetchFoods();
  }, 5000);

  return () => clearInterval(interval);

}, []);

  const fetchFoods = async () => {
    try {
      const response = await api.get("/food/all");
      setFoods(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const claimFood = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/food/claim/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Food Claimed Successfully");
      setFoods(prev =>
  prev.map(food =>
    food.id === id
      ? { ...food, status: "CLAIMED" }
      : food
  )
);
      fetchFoods();
    } catch (error) {

  console.error(error);

  console.log(
    "Backend Error:",
    error.response?.data
  );

  alert(
    error.response?.data?.detail ||
    "Claim Failed"
  );
}
  };

  const availableFoods = foods.filter(
    (food) => food.status === "AVAILABLE"
  );

  const claimedFoods =
  foods.filter(
    food =>
      food.status === "CLAIMED" ||
      food.status === "DELIVERED"
  );

  return (
    <div className="ngo-page">

      {/* Sidebar */}
      <div className="ngo-sidebar">
        <h2>MealBridge</h2>

        <ul>
          <li> Dashboard</li>
          <li> Available Food</li>
          <li> My Claims</li>
          <li> Notifications</li>
          <li> Profile</li>
          <li onClick={handleLogout}>
  Logout
</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="ngo-main">

        <h1 className="welcome-title">
          Welcome Back, NGO 🏢
        </h1>

        {/* Stats */}
        <div className="stats-grid">

          <div className="stat-card">
            <h3>Available Food</h3>
            <h2>{availableFoods.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Claimed Food</h3>
            <h2>{claimedFoods.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Meals Saved</h3>
            <h2>
{
  foods.reduce(
    (sum, food) =>
      food.status === "CLAIMED" ||
      food.status === "DELIVERED"
        ? sum + Number(food.quantity)
        : sum,
    0
  )
}
</h2>
          </div>

          <div className="stat-card">
            <h3>Impact Score</h3>
            <h2>
{
  foods.reduce(
    (sum, food) =>
      food.status === "CLAIMED" ||
      food.status === "DELIVERED"
        ? sum + Number(food.quantity)
        : sum,
    0
  ) / 5
}
</h2>
          </div>

        </div>

        {/* Main Grid */}
        <div className="content-grid">

          {/* Table */}
          <div className="table-card">

            <h2>Available Food Donations</h2>

            <table>

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

                {foods.map((food) => (
                  <tr key={food.id}>

                    <td>{food.id}</td>
                    <td>{food.food_name}</td>
                    <td>{food.quantity}</td>
                    <td>{food.food_type}</td>
                    <td>{food.status}</td>

                    <td>
                      {food.status === "AVAILABLE" ? (
                        <button
                          className="claim-btn"
                          onClick={() => claimFood(food.id)}
                        >
                          Claim
                        </button>
                      ) : (
                        <span className="claimed-text">
                          Claimed
                        </span>
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* Impact Card */}
          <div className="impact-card">

            <h2>🌱 NGO Impact</h2>

            <p>
              Every meal claimed helps
              reduce food waste and feed
              families in need.
            </p>

            <div className="impact-number">
  {claimedFoods.length}
</div>
            <p>Claims Completed</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default NGODashboard;