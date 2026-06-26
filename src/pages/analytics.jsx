import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AnalyticsFilters from "../components/AnalyticsFilters";
import TrafficChart from "../components/TrafficChart";
import DeviceTypesChart from "../components/DeviceTypesChart";
import TopBrowsersChart from "../components/TopBrowsersChart";
import TopCountriesChart from "../components/TopCountriesChart";
import OperatingSystemsChart from "../components/OperatingSystemsChart";
import TopPages from "../components/TopPages";
import TrafficSources from "../components/TrafficSources";

const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const websites = useSelector((state) => state.websites.websites);

  const website = websites.find((w) => w.id === id);

  if (!website) {
    return <h2>Website not found.</h2>;
  }

  const trackingId = website.trackingId;

  const [analytics, setAnalytics] = useState({
    events: [],
    totalVisitors: 0,
    pageViews: 0,
    sessions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackingId) return;

    setLoading(true);

    fetch(`https://analytics.utkarsh.app/api/analytics/${trackingId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA:", data);

        setAnalytics({
          events: data.events || [],
          totalVisitors: data.totalVisitors || 0,
          pageViews: data.pageViews || 0,
          sessions: data.sessions || 0,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      });
  }, [trackingId]);

  return (
    <div>
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-title">
          <h2>Analytics</h2>
          <p>Website: {website.websiteName}</p>
        </div>

        <div
          className="analytics-link"
          onClick={() => navigate("/manage-websites")}
        >
          ← Back to Website
        </div>
      </div>

      <AnalyticsFilters />

      {/* Stats */}
      <div className="analytic-grid">
        <div className="analytics-card stat-card">
          <p>Total Visitors</p>
          <h3>{loading ? "..." : analytics.totalVisitors}</h3>
        </div>

        <div className="analytics-card stat-card">
          <p>Page Views</p>
          <h3>{loading ? "..." : analytics.pageViews}</h3>
        </div>

        <div className="analytics-card stat-card">
          <p>Sessions</p>
          <h3>{loading ? "..." : analytics.sessions}</h3>
        </div>

        <div className="analytics-card stat-card">
          <p>Active Users</p>
          <h3>{loading ? "..." : 0}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="analytics-content">
        <TrafficChart data={analytics.events} />

        <div className="main">
          <div className="chart">
            <DeviceTypesChart data={analytics.events} />
          </div>

          <div className="chart">
            <TopBrowsersChart data={analytics.events} />
          </div>

          <div className="chart">
            <TopCountriesChart data={analytics.events} />
          </div>

          <div className="chart">
            <OperatingSystemsChart data={analytics.events} />
          </div>

          <div className="chart">
            <TopPages data={analytics.events} />
          </div>

          <div className="chart">
            <TrafficSources data={analytics.events} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;