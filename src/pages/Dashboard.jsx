import { useState, useEffect } from "react";
import { UserButton, useUser, useAuth } from "@clerk/clerk-react";
import AddWebsiteModal from "../components/AddWebsiteModal";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();


  // Load websites from localStorage on first render
  const [websites, setWebsites] = useState(() => {
    const savedWebsites = localStorage.getItem("websites");
    return savedWebsites ? JSON.parse(savedWebsites) : [];
  });


  // Save websites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("websites", JSON.stringify(websites));
  }, [websites]);

  const handleAddWebsite = (data) => {
    setWebsites((prev) => [...prev, data]);
  };



  return (
    <>
      <div className="dashboard-container">
        {/* HEADER */}
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <UserButton />
        </header>

        <main className="dashboard-content">
          {/* WELCOME CARD */}
          <div className="dashboard-card welcome-card">
            <h2>
              Welcome, {user?.firstName || "User"}!
            </h2>

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

          {/* ANALYTICS */}
          <div className="analytics-grid">
            <div className="dashboard-card ">
              <p>Total Visitors</p>
              <h3 className="text">0</h3>
            </div>

            <div className="dashboard-card ">
              <p>Page Views</p>
              <h3 className="text-V">0</h3>
            </div>

            <div className="dashboard-card ">
              <p>Sessions</p>
              <h3 className="text-S">0</h3>
            </div>

            <div className="dashboard-card ">
              <p>Active Users</p>
              <h3 className="text-A">0</h3>
            </div>
          </div>

          {/* YOUR WEBSITES */}
          <div className="dashboard-card">
            <h3>Your Websites</h3>

            <p className="sub-info-text">
              {websites.length ? `${websites.length} websites tracked` : "Get started by creating your first website"}
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
                {websites.map((web, index) => (
                  <div key={index} className="website-item">
                    <div>
                      <strong>{web.websiteName}</strong>
                      <p>{web.domain}</p>
                    </div>

                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/analytics/${web.websiteName}`
                          )
                      }
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

      {/* MODAL */}
      <AddWebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWebsite={handleAddWebsite}
      />
    </>
  );
};

export default Dashboard;