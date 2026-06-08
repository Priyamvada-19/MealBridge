import { useState, useEffect } from "react";
import api from "../services/api";
import "./DonorDashboard.css";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

function DonorDashboard() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [foodType, setFoodType] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const [foods, setFoods] = useState([]);

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

  const createFood = async () => {

  try {

    const token = localStorage.getItem("token");

    const foodData = {
      food_name: foodName,
      quantity: Number(quantity),
      food_type: foodType,
      pickup_address: pickupAddress,
      expiry_time: expiryTime
    };

    console.log("Sending:", foodData);

    await api.post(
  "/food/create",
  foodData,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

setShowSuccess(true);

setFoodName("");
setQuantity("");
setFoodType("");
setPickupAddress("");
setExpiryTime("");

fetchFoods();

setTimeout(() => {
  setShowSuccess(false);
}, 2500);

    fetchFoods();

  } catch (error) {

    console.error(error);

    console.log("Backend Error:", error.response?.data);

    alert(
      error.response?.data?.detail ||
      "Food Creation Failed"
    );
  }
};

    const handleLogout = () => {

  const confirmLogout =
    window.confirm("Are you sure you want to logout?");

  if (!confirmLogout) return;

  localStorage.clear();

  navigate("/login");

};

  return (

  <div className="donor-page">


{/* Sidebar */}
<aside className="sidebar">

  <div className="logo">
     MealBridge
  </div>

  <ul className="menu">
    <li onClick={() => navigate("/donor-dashboard")}>Dashboard</li>
    <li onClick={() => navigate("/my-donations")}>My Donations</li>
    <li onClick={() => navigate("/notifications")}>Notifications</li>
    <li onClick={() => navigate("/profile")}>Profile</li>
    <li onClick={handleLogout}>
  Logout
</li>
  </ul>

</aside>

{/* Main Content */}
<main className="main-content">

  <div className="welcome-card">

    <h1>Welcome Back, Donor 👋</h1>

  </div>

  <div className="stats-grid">

    <div className="stat-card">
      <h3>Total Donations</h3>
      <h2>{foods.length}</h2>
    </div>

    <div className="stat-card">
      <h3>Meals Shared</h3>
      <h2>{foods.length * 20}</h2>
    </div>

    <div className="stat-card">
      <h3>Lives Impacted</h3>
      <h2>{foods.length * 8}</h2>
    </div>

    <div className="stat-card">
      <h3>Active Donations</h3>
      <h2>
        {
          foods.filter(
            (food) => food.status === "AVAILABLE"
          ).length
        }
      </h2>
    </div>

  </div>

  <div className="donation-section">

    <div className="form-card">

      <h2>Create Donation</h2>

      <input
        className="form-control mb-3"
        placeholder="Food Name"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />

      <input
  type="number"
  className="form-control mb-3"
  placeholder="Quantity"
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
/>

      <input
        className="form-control mb-3"
        placeholder="Food Type"
        value={foodType}
        onChange={(e) => setFoodType(e.target.value)}
      />

      <input
        className="form-control mb-3"
        placeholder="Pickup Address"
        value={pickupAddress}
        onChange={(e) => setPickupAddress(e.target.value)}
      />

      <input
  type="datetime-local"
  className="form-control mb-3"
  value={expiryTime}
  onChange={(e) => setExpiryTime(e.target.value)}
/>

      <button
        className="btn btn-success w-100"
        onClick={createFood}
      >
        Create Food Donation
      </button>

    </div>

    <div className="impact-card">

      <h2>
         Make An Impact !
      </h2>

      <p>
        Every meal donated helps
        reduce food waste and feed
        people in need.
      </p>

      <div className="impact-number">
        {foods.length}
      </div>

      <span>
        Donations Made
      </span>

    </div>

  </div>

  <div className="table-card">

    <h2>Recent Donations</h2>

    <table className="table">

      <thead>
        <tr>
          <th>ID</th>
          <th>Food</th>
          <th>Quantity</th>
          <th>Type</th>
          <th>Status</th>
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

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</main>

{
  showSuccess && (

    <div className="success-overlay">

      <div className="success-card">

        <div className="success-icon">
          🎉
        </div>

        <h2>Donation Created!</h2>

        <p>
          Thank you for helping reduce food waste.
        </p>

      </div>

    </div>

  )
}


  </div>
);

}

export default DonorDashboard;