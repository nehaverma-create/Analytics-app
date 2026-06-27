import "./AddWebsiteModal.css";
import { useState, useEffect } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";

export default function AddWebsiteModal({
  isOpen,
  onClose,
  onAddWebsite,
  websiteData,
}) {
  const [websiteName, setWebsiteName] = useState("");
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authFetch = useAuthFetch();

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setIsSubmitting(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!domainRegex.test(domain)) {
      setError("Please enter a valid domain (e.g. example.com)");
      return;
    }

    setError("");

    if (websiteData) {
      setIsSubmitting(true);

      try {
        const response = await authFetch(`/api/websites/${websiteData.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: websiteName, domain }),
        });

        if (!response.ok) {
          throw new Error("Failed to update website");
        }

        const data = await response.json();

        onAddWebsite({
          id: data.id,
          websiteName: data.name,
          domain: data.domain,
          trackingId: data.trackingId,
          trackingScript: data.trackingScript,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
        });

        setWebsiteName("");
        setDomain("");
        onClose();
      } catch (err) {
        setError(err.message || "Failed to update website. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authFetch("/api/websites", {
        method: "POST",
        body: JSON.stringify({ name: websiteName, domain }),
      });

      if (!response.ok) {
        throw new Error("Failed to create website");
      }

      const data = await response.json();

      onAddWebsite({
        id: data.id,
        websiteName: data.name,
        domain: data.domain,
        trackingId: data.trackingId,
        trackingScript: data.trackingScript,
        createdAt: new Date(data.createdAt).toLocaleDateString(),
      });

      setWebsiteName("");
      setDomain("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create website. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                setError("");
                setDomain(e.target.value);
              }}
              required
            />
          </div>

          {error && <p>{error}</p>}

          <div className="btn-wrapper">
            <button
              type="submit"
              className="create-website-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? websiteData
                  ? "Saving..."
                  : "Creating..."
                : websiteData
                  ? "Save changes"
                  : "Create website"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
