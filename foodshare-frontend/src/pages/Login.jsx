import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import heroImage from "../assets/foodshare-hero.png";
import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
  try {
    setLoading(true);

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem(
      "token",
      response.data.access_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    setTimeout(() => {
      navigate("/choose-role");
    }, 2000);

  } catch (error) {

    console.error(error);

    setLoading(false);

    alert("Invalid Credentials");
  }
};
  return (

  <div className="foodshare-page">


<div className="hero-section">

  {/* LEFT SIDE */}

  <div className="hero-left">

    <div className="brand">
      🍽️ MealBridge
    </div>

    <h1>
      Rescuing Food. 
      <br />
      Nourishing Lives.
    </h1>

    <p>
      Connecting donors, NGOs, and volunteers to make every meal count.
    </p>

    <img
      src={heroImage}
      alt="Food Donation"
      className="hero-image"
    />

    <div className="features">

      <div className="feature-card">
        🥗
        <span>Donate Food</span>
      </div>

      <div className="feature-card">
        🤝
        <span>NGO Support</span>
      </div>

      <div className="feature-card">
        🚚
        <span>Volunteer Delivery</span>
      </div>

    </div>

  </div>

  {/* RIGHT SIDE */}

  <div className="hero-right">

    <div className="login-card">

      <h2>Welcome Back</h2>

      <p className="login-subtitle">
        Sign in to continue helping communities
      </p>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
  type="password"
  placeholder="Enter Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

<button
  className="login-btn"
  onClick={loginUser}
>
  Login
</button>

<div className="divider">
  <span>OR</span>
</div>

<GoogleLogin
  onSuccess={async (credentialResponse) => {
    try {

      const response = await api.post(
        "/auth/google",
        {
          token: credentialResponse.credential
        }
      );

      localStorage.setItem(
  "token",
  response.data.access_token
);

setLoading(true);

setLoading(true);

setTimeout(() => {
  navigate("/choose-role");
}, 2000);

    } catch (error) {

      console.error(error);

      alert("Google Login Failed");
    }
  }}

  onError={() => {
    alert("Google Login Failed");
  }}
/>

<div className="register-link">
  New User?

  <span
    onClick={() => navigate("/register")}
  >
    Register
  </span>
</div>

    </div>
    <div className="about-card">

  <h3>About MealBridge</h3>

  <p>
    MealBridge is a community-driven food redistribution platform
    that connects food donors, NGOs, and volunteers. Our mission
    is to reduce food waste and ensure surplus food reaches people
    who need it most through a transparent and efficient network.
  </p>

</div>

  </div>

</div>
{
  loading && (
    <div className="loading-overlay">

      <div className="loading-card">

        <div className="spinner"></div>

        <h3>Logging you in...</h3>

        <p>Please wait</p>

      </div>

    </div>
  )
}


  </div>
);
}

export default Login;