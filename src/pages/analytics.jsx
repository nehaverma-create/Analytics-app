import { useEffect, useState } from "react";
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
  const website = websites.find((w) => w.id === id || w.websiteName === id);

  const [analytics, setAnalytics] = useState({
    events: [],
    totalVisitors: 0,
    pageViews: 0,
    sessions: 0,
    activeUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAnalytics = async () => {
      try {
        const [overviewRes, activeRes] = await Promise.all([
          fetch(`/api/analytics/overview?websiteId=${id}&days=30`),
          fetch(`/api/analytics/active?websiteId=${id}&minutes=5`),
        ]);

        if (!overviewRes.ok) {
          throw new Error("Failed to fetch analytics overview");
        }

        const overview = await overviewRes.json();
        const active = activeRes.ok ? await activeRes.json() : { activeUsers: 0 };

        setAnalytics({
          events: overview.events || [],
          totalVisitors: overview.totalVisitors || 0,
          pageViews: overview.pageViews || 0,
          sessions: overview.sessions || 0,
          activeUsers: active.activeUsers || 0,
        });
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (!website) {
    return <h2>Website not found.</h2>;
  }

  return (
    <div>
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
          <h3>{loading ? "..." : analytics.activeUsers}</h3>
          <p>Last 5 minutes</p>
        </div>
      </div>

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
