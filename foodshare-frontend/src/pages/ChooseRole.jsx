import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ChooseRole.css";
import communityBg from "../assets/community-bg.jpg";

function ChooseRole() {
  const navigate = useNavigate();

  const selectRole = async (role) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://127.0.0.1:8000/auth/select-role",
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (role === "DONOR") {
        navigate("/donor");
      } else if (role === "NGO") {
        navigate("/ngo");
      } else if (role === "VOLUNTEER") {
        navigate("/volunteer");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to select role");
    }
  };

  return (
    <div className="role-page">
      <div className="background-illustration">
  <img
    src={communityBg}
    alt="Community Background"
  />
</div>
      <div className="role-container">

        <h1> Welcome to MealBridge ! </h1>

        <h2>Choose How You Want To Help</h2>

        <div className="role-grid">

          <div
            className="role-card"
            onClick={() => selectRole("DONOR")}
          >
            <h3>🍱 Donor</h3>
            <p>Donate surplus food to those in need</p>
          </div>

          <div
            className="role-card"
            onClick={() => selectRole("NGO")}
          >
            <h3>🏢 NGO</h3>
            <p>Claim and distribute food donations</p>
          </div>

          <div
            className="role-card"
            onClick={() => selectRole("VOLUNTEER")}
          >
            <h3>🚚 Volunteer</h3>
            <p>Pickup and deliver donated food</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ChooseRole;