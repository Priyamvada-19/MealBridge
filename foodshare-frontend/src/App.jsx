import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChooseRole from "./pages/ChooseRole";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

         <Route
    path="/login"
    element={<Login />}
  />


        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/donor"
          element={<DonorDashboard />}
        />

        <Route
  path="/donor-dashboard"
  element={
    localStorage.getItem("token")
      ? <DonorDashboard />
      : <Navigate to="/login" />
  }
/>

        <Route
          path="/ngo"
          element={<NGODashboard />}
        />

        <Route
  path="/volunteer"
  element={
    localStorage.getItem("token")
      ? <VolunteerDashboard />
      : <Navigate to="/login" />
  }
/>

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/choose-role"
          element={<ChooseRole />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;