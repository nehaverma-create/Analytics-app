import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import AddWebsiteModal from "../components/AddWebsiteModal";

const ManageWebsites = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [websites, setWebsites] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Load websites from localStorage
  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("websites")) || [];
    setWebsites(saved);
  }, []);

  // Add / Update website
  const handleSaveWebsite = (websiteData) => {
    const existing =
      JSON.parse(localStorage.getItem("websites")) || [];

    let updatedWebsites;

    if (editingIndex !== null) {
      updatedWebsites = [...existing];

      updatedWebsites[editingIndex] = {                                          //edit
        ...updatedWebsites[editingIndex],
        websiteName: websiteData.websiteName,
        domain: websiteData.domain,
      };
    } else {
      updatedWebsites = [
        ...existing,
        {                                                                         //add
          websiteName: websiteData.websiteName,
          domain: websiteData.domain,
          createdAt: new Date().toLocaleDateString(),
          trackingScript: "Hello World",
        },
      ];
    }

    localStorage.setItem(
      "websites",
      JSON.stringify(updatedWebsites)
    );

    setWebsites(updatedWebsites);
    setEditingIndex(null);
    setIsModalOpen(false);
  };

  // Delete website
 const handleDeleteWebsite = (indexToDelete) => {
  const updated = websites.filter((site, index) => 
    index !== indexToDelete);

  setWebsites(updated);
  localStorage.setItem("websites", JSON.stringify(updated));
};

  // Edit website
  const handleEditWebsite = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  console.log('***websites', websites)
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);

    } catch (err) {
      alert("Failed to copy!");
    }
  };
  return (
    <div className="manage-container">
      {/* HEADER */}
      <div className="manage-header">
        <div>
          <h1 className="heading">Websites</h1>
          <p>Manage websites and tracking scripts.</p>
        </div>

        <div className="header-right">
          <div
            className="back-link"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </div>

          <button
            className="add-btn"
            onClick={() => {
              setEditingIndex(null);
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
            <div key={index} className="website-card">
              {/* TOP SECTION */}
              <div className="website-top">
                <div className="website-info">
                  <h3>{site.websiteName}</h3>

                  <div className="website-domain">
                    {site.domain}
                  </div>

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
                    onClick={() =>
                      handleEditWebsite(index)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="action-btn delete"
                    onClick={() =>
                      handleDeleteWebsite(index)
                    }
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
                    onClick={() =>
                      handleCopy(site.trackingScript, index)
                    }
                  >
                    {copiedIndex === index ? "Copied!" : "Copy"}
                  </button>
                </div>

                <textarea
                  readOnly
                  value={site.trackingScript}
                />
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
          setEditingIndex(null);
        }}
        onAddWebsite={handleSaveWebsite}
        websiteData={
          editingIndex !== null
            ? websites[editingIndex]
            : null
        }
      />
    </div>
  );
};

export default ManageWebsites;