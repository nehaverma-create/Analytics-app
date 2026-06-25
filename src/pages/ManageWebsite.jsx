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

const ManageWebsites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const websites = useSelector((state) => state.websites.websites);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSaveWebsite = (websiteData) => {
    if (editingId !== null) {
      dispatch(
        updateWebsite({
          id: editingId,
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

  const handleDeleteWebsite = (id) => {
    dispatch(deleteWebsite(id));
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
    <div className="manage-container">
      {/* HEADER */}
      <div className="manage-header">
        <div>
          <h1 className="heading">Websites</h1>
          <p>Manage websites and tracking scripts.</p>
        </div>

        <div className="header-right">
          <div className="back-link" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </div>

          <button
            className="add-btn"
            onClick={() => {
              setEditingId(null);
              setIsModalOpen(true);
            }}
          >
            Add Website
          </button>

          <UserButton />
        </div>
      </div>

      {/* LIST */}
      <div className="website-list">
      
        {websites.length === 0 ? (
          <center>No websites added yet.</center>
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
                    onClick={() =>
                      navigate(`/analytics/${site.websiteName}`)
                    }
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

                <textarea readOnly value={site.trackingScript} />
              </div>
            </div>
          ))
        )}
      </div>

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
