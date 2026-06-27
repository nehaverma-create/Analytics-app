import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import AddWebsiteModal from "../components/AddWebsiteModal";
import { useNavigate } from "react-router-dom";
import { addWebsite } from "../store/websitesSlice";
import { useSyncWebsites } from "../hooks/useSyncWebsites";
import { useAuthFetch } from "../hooks/useAuthFetch";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authFetch = useAuthFetch();
  const websites = useSelector((state) => state.websites.websites);

  const [totals, setTotals] = useState({
    totalVisitors: 0,
    pageViews: 0,
    sessions: 0,
    activeUsers: 0,
  });
  const [loadingTotals, setLoadingTotals] = useState(true);

  useSyncWebsites();

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const res = await authFetch(
          "/api/analytics/summary?days=30&minutes=5"
        );

        if (!res.ok) return;

        const data = await res.json();
        setTotals({
          totalVisitors: data.totalVisitors ?? 0,
          pageViews: data.pageViews ?? 0,
          sessions: data.sessions ?? 0,
          activeUsers: data.activeUsers ?? 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard totals:", err);
      } finally {
        setLoadingTotals(false);
      }
    };

    fetchTotals();

    const interval = setInterval(fetchTotals, 30000);
    return () => clearInterval(interval);
  }, [authFetch, websites.length]);

  const handleAddWebsite = (data) => {
    dispatch(addWebsite(data));
  };

  const display = (value) => (loadingTotals ? "..." : value);

  return (
    <>
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <UserButton />
        </header>

        <main className="dashboard-content">
          <div className="dashboard-card welcome-card">
            <h2>Welcome, {user?.firstName || "User"}!</h2>

            <p>Overview of all your websites and analytics</p>

            <div className="dashboard-buttons">
              <button
                className="btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                Create new website
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/manage-websites")}
              >
                Manage websites
              </button>
            </div>
          </div>

          <div className="analytics-grid">
            <div className="dashboard-card ">
              <p>Total Visitors</p>
              <h3 className="text">{display(totals.totalVisitors)}</h3>
              <p>Last 30 days</p>
            </div>

            <div className="dashboard-card ">
              <p>Page Views</p>
              <h3 className="text-V">{display(totals.pageViews)}</h3>
              <p>Last 30 days</p>
            </div>

            <div className="dashboard-card ">
              <p>Sessions</p>
              <h3 className="text-S">{display(totals.sessions)}</h3>
              <p>Last 30 days</p>
            </div>

            <div className="dashboard-card ">
              <p>Active Users</p>
              <h3 className="text-A">{display(totals.activeUsers)}</h3>
              <p>Last 5 minutes</p>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Your Websites</h3>

            <p className="sub-info-text">
              {websites.length
                ? `${websites.length} websites tracked`
                : "Get started by creating your first website"}
            </p>

            {websites.length === 0 ? (
              <div className="empty-state-center">
                <p className="empty-text">
                  No websites yet. Get started by creating your first website
                </p>

                <button
                  className="btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create New Website
                </button>
              </div>
            ) : (
              <div className="website-list">
                {websites.map((web) => (
                  <div key={web.id} className="website-item">
                    <div>
                      <strong>{web.websiteName}</strong>
                      <p>{web.domain}</p>
                    </div>

                    <button
                      className="view-btn"
                      onClick={() => navigate(`/analytics/${web.id}`)}
                    >
                      View Analytics
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <AddWebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWebsite={handleAddWebsite}
      />
    </>
  );
};

export default Dashboard;
