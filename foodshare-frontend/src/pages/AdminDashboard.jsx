import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {

  const [stats, setStats] = useState({
    total_users: 0,
    total_food: 0,
    claimed_food: 0,
    delivered_food: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    try {

      const response = await api.get(
        "/admin/stats"
      );

      setStats(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <div className="container mt-5">

      <h2>Admin Dashboard</h2>

      <div className="row mt-4">

        <div className="col-md-3">

          <div className="card p-3">
            <h5>Total Users</h5>
            <h2>{stats.total_users}</h2>
          </div>

        </div>

        <div className="col-md-3">

          <div className="card p-3">
            <h5>Total Donations</h5>
            <h2>{stats.total_food}</h2>
          </div>

        </div>

        <div className="col-md-3">

          <div className="card p-3">
            <h5>Claimed Food</h5>
            <h2>{stats.claimed_food}</h2>
          </div>

        </div>

        <div className="col-md-3">

          <div className="card p-3">
            <h5>Delivered Food</h5>
            <h2>{stats.delivered_food}</h2>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;