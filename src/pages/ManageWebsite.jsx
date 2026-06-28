import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import AddWebsiteModal from "../components/AddWebsiteModal";
import {
  addWebsite,
  updateWebsite,
  deleteWebsite,
} from "../store/websitesSlice";
import { useSyncWebsites } from "../hooks/useSyncWebsites";
import { useAuthFetch } from "../hooks/useAuthFetch";

const ManageWebsites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authFetch = useAuthFetch();
  const websites = useSelector((state) => state.websites.websites);

  useSyncWebsites();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSaveWebsite = (websiteData) => {
    if (editingId !== null) {
      dispatch(
        updateWebsite({
          id: websiteData.id ?? editingId,
          websiteName: websiteData.websiteName,
          domain: websiteData.domain,
        })
      );
    } else {
      dispatch(addWebsite(websiteData));
    }

    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleDeleteWebsite = async (id) => {
    if (!window.confirm("Delete this website and all its analytics data?")) {
      return;
    }

    try {
      const response = await authFetch(`/api/websites/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete website");
      }

      dispatch(deleteWebsite(id));
    } catch (err) {
      alert(err.message || "Failed to delete website");
    }
  };

  const handleEditWebsite = (id) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
    } catch {
      alert("Failed to copy!");
    }
  };

  const editingWebsite =
    editingId !== null
      ? websites.find((site) => site.id === editingId)
      : null;

  return (
    <div className="app-page">
      <header className="app-header">
        <div className="app-header-inner manage-header-content">
          <div className="app-page-title">
            <h1>Websites</h1>
            <p>Manage websites and tracking scripts.</p>
          </div>

          <div className="manage-header-actions">
            <a
              type="button"
              className="back-link"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to dashboard
            </a>

            <button
              type="button"
              className="add-btn"
              onClick={() => {
                setEditingId(null);
                setIsModalOpen(true);
              }}
            >
              Add website
            </button>

            <UserButton />
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="manage-website-list">
          {websites.length === 0 ? (
            <div className="dashboard-card empty-state-center">
              <p className="empty-text">No websites added yet.</p>
            </div>
          ) : (
            websites.map((site, index) => (
              <div key={site.id} className="website-card">
              {/* TOP SECTION */}
              <div className="website-top">
                <div className="website-info">
                  <h3>{site.websiteName}</h3>

                  <div className="website-domain">{site.domain}</div>

                  <div className="website-date">
                    Created {site.createdAt}
                  </div>
                </div>

                <div className="website-actions">
                  <button
                    className="action-btn"
                    onClick={() => navigate(`/analytics/${site.id}`)}
                  >
                    View Analytics
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => handleEditWebsite(site.id)}
                  >
                    Edit
                  </button>

                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteWebsite(site.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* TRACKING SCRIPT */}
              <div className="tracking-box">
                <div className="tracking-header">
                  <span>Tracking Script</span>

                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(site.trackingScript, index)}
                  >
                    {copiedIndex === index ? "Copied!" : "Copy"}
                  </button>
                </div>

                <textarea
                  readOnly
                  value={site.trackingScript}
                  rows={site.trackingScript.split("\n").length}
                />
              </div>
            </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL */}
      <AddWebsiteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingId(null);
        }}
        onAddWebsite={handleSaveWebsite}
        websiteData={editingWebsite}
      />
    </div>
  );
};

export default ManageWebsites;
