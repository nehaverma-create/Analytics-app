import "./AddWebsiteModal.css";
import { useState, useEffect } from "react";

export default function AddWebsiteModal({
  isOpen,
  onClose,
  onAddWebsite,
  websiteData,
}) {
  const [websiteName, setWebsiteName] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (websiteData) {
      setWebsiteName(websiteData.websiteName || "");
      setDomain(websiteData.domain || "");
    } else {
      setWebsiteName("");
      setDomain("");
    }
  }, [websiteData, isOpen]);

  const domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!domainRegex.test(domain)) {
      setError("Please enter a valid domain (e.g. example.com)");
      return;
    }

    setError("");

    onAddWebsite({
      websiteName,
      domain,
       createdAt: new Date().toLocaleDateString(),
       trackingScript: "Hello World",
    });

    setWebsiteName("");
    setDomain("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>
          {websiteData ? "Edit Website" : "Add Website"}
        </h2>

        <p>
          {websiteData
            ? "Update the website name or domain."
            : "Provide a name and domain to generate a tracking script."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Website Name</label>
            <input
              value={websiteName}
              placeholder="Marketing site"
              onChange={(e) => setWebsiteName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Domain</label>
            <input
              value={domain}
              placeholder="example.com"
              onChange={(e) => {
                setError("")
                setDomain(e.target.value)
              }}
              required
            />
          </div>

          {error && <p>{error}</p>}

          <div className="btn-wrapper">
            <button
              type="submit"
              className="create-website-btn"
            >
              {websiteData
                ? "Save changes"
                : "Create website"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}