import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useSyncWebsites } from "../hooks/useSyncWebsites";
import {
  computeStats,
  filterEvents,
  getDefaultFilters,
  getDeviceTypes,
  getFilterOptions,
  getOperatingSystems,
  getTopBrowsers,
  getTopCountries,
  getTopPages,
  getTrafficOverTime,
  getTrafficSources,
} from "../utils/analyticsData";

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
  const authFetch = useAuthFetch();

  useSyncWebsites();

  const websites = useSelector((state) => state.websites.websites);
  const website = websites.find((w) => w.id === id || w.websiteName === id);

  const [filters, setFilters] = useState(getDefaultFilters);
  const [events, setEvents] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAnalytics = async () => {
      try {
        const params = new URLSearchParams({
          websiteId: id,
          from: filters.fromDate,
          to: filters.toDate,
        });

        const [overviewRes, activeRes] = await Promise.all([
          authFetch(`/api/analytics/overview?${params}`),
          authFetch(`/api/analytics/active?websiteId=${id}&minutes=5`),
        ]);

        if (!overviewRes.ok) {
          throw new Error("Failed to fetch analytics overview");
        }

        const overview = await overviewRes.json();
        const active = activeRes.ok
          ? await activeRes.json()
          : { activeUsers: 0 };

        setEvents(overview.events || []);
        setActiveUsers(active.activeUsers || 0);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [id, authFetch, filters.fromDate, filters.toDate]);

  const filteredEvents = useMemo(
    () => filterEvents(events, filters),
    [events, filters]
  );

  const stats = useMemo(
    () => computeStats(filteredEvents),
    [filteredEvents]
  );

  const filterOptions = useMemo(() => getFilterOptions(events), [events]);

  const trafficData = useMemo(
    () => getTrafficOverTime(filteredEvents, filters.granularity),
    [filteredEvents, filters.granularity]
  );

  const deviceData = useMemo(
    () => getDeviceTypes(filteredEvents),
    [filteredEvents]
  );

  const browserData = useMemo(
    () => getTopBrowsers(filteredEvents),
    [filteredEvents]
  );

  const countryData = useMemo(
    () => getTopCountries(filteredEvents),
    [filteredEvents]
  );

  const osData = useMemo(
    () => getOperatingSystems(filteredEvents),
    [filteredEvents]
  );

  const pageData = useMemo(
    () => getTopPages(filteredEvents),
    [filteredEvents]
  );

  const sourceData = useMemo(
    () => getTrafficSources(filteredEvents, website?.domain || ""),
    [filteredEvents, website?.domain]
  );

  if (!website) {
    return <h2>Website not found.</h2>;
  }

  return (
    <div>
      <div className="analytics-header">
        <div className="analytics-title">
          <h2>Analytics</h2>
          <p>{website.domain || website.websiteName}</p>
        </div>

        <div
          className="analytics-link"
          onClick={() => navigate("/manage-websites")}
        >
          ← Back to websites
        </div>
      </div>

      <AnalyticsFilters
        filters={filters}
        onChange={setFilters}
        options={filterOptions}
      />

      <div className="analytic-grid">
        <div className="analytics-card stat-card">
          <p>Total visitors</p>
          <h3>{loading ? "..." : stats.totalVisitors}</h3>
        </div>

        <div className="analytics-card stat-card">
          <p>Page views</p>
          <h3>{loading ? "..." : stats.pageViews}</h3>
        </div>

        <div className="analytics-card stat-card">
          <p>Sessions</p>
          <h3>{loading ? "..." : stats.sessions}</h3>
        </div>

        <div className="analytics-card stat-card">
          <div className="stat-card-header">
            <p>Active users</p>
            <span className="live-badge">Live</span>
          </div>
          <h3>{loading ? "..." : activeUsers}</h3>
          {lastUpdated && (
            <p className="stat-updated">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <div className="analytics-content">
        <TrafficChart data={trafficData} />

        <div className="analytics-chart-grids">
          <DeviceTypesChart data={deviceData} />
          <TopBrowsersChart data={browserData} />
          <TopCountriesChart data={countryData} />
          <OperatingSystemsChart data={osData} />
          <TopPages data={pageData} />
          <TrafficSources data={sourceData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
