import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AnalyticsFilters from "../components/AnalyticsFilters";
import TrafficChart from "../components/TrafficChart";
import DeviceTypesChart from "../components/DeviceTypesChart";
import TopBrowsersChart from "../components/TopBrowsersChart";
import TopCountriesChart from "../components/TopCountriesChart";
import OperatingSystemsChart from "../components/OperatingSystemsChart";
import TopPages from "../components/TopPages";
import TrafficSources from "../components/TrafficSources";

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

<div className="analytics-content">
  <TrafficChart />

  <div className="main">
    <div className="chart">
      <DeviceTypesChart />
    </div>

    <div className="chart">
      <TopBrowsersChart />
    </div>

    <div className="chart">
      <TopCountriesChart />
    </div>

    <div className="chart">
      <OperatingSystemsChart />
    </div>
    
    <div className="chart">
  <TopPages/>
 </div>
 
 <div className="chart">
  <TrafficSources/>
 </div>
  </div>
 
</div>

    </div>
  );
};

export default Analytics;