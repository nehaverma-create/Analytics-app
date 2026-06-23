import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnalyticsFilters from "../AnalyticsFilters";

const Analytics = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-title">
          <h2>Analytics</h2>
          <p>Website: {name}</p>
        </div>

        <div
          className="analytics-link"
          onClick={() => navigate("/manage-websites")}
        >
          ← Back to website
        </div>
      </div>

      
      <AnalyticsFilters />
    
    <div className="analytic-grid">
            <div className="analytics-card stat-card">
              <p>Total Visitors</p>
              <h3 className="total">0</h3>
            </div>

            <div className="analytics-card stat-card">
              <p>Page Views</p>
              <h3 className="page">0</h3>
            </div>

            <div className="analytics-card stat-card">
              <p>Sessions</p>
              <h3 className="session">0</h3>
            </div>

            <div className="analytics-card stat-card">
              <p>Active Users</p>
              <h3 className="">0</h3>
            </div>
          </div>
          </div>
  );
};

export default Analytics;