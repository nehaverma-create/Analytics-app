import React, { useState } from "react";
import CustomSelect from "./CustomSelect";

const initialState = {
  fromDate: "2026-05-25",
  toDate: "2026-06-23",
  device: "all",
  browser: "chrome",
  country: "all",
  granularity: "daily",
};

const AnalyticsFilters = () => {
  const [filters, setFilters] = useState(initialState);

  const handleReset = () => {
    setFilters(initialState);
  };

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="filters-container">
      <h3 className="filters-heading">Filters</h3>

      <div className="filters-grid">

        {/* FROM DATE */}
        <div className="filter-group">
          <label className="filter-label">From</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) =>
              handleChange("fromDate", e.target.value)
            }
            className="filter-input"
          />
        </div>

        {/* TO DATE */}
        <div className="filter-group">
          <label className="filter-label">To</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) =>
              handleChange("toDate", e.target.value)
            }
            className="filter-input"
          />
        </div>

        {/* DEVICE */}
        <CustomSelect
          label="Device"
          value={filters.device}
          onValueChange={(val) =>
            handleChange("device", val)
          }
          options={[
            { value: "all", label: "All devices" },
            { value: "desktop", label: "Desktop" },
            { value: "mobile", label: "Mobile" },
          ]}
        />

        {/* BROWSER */}
        <CustomSelect
          label="Browser"
          value={filters.browser}
          onValueChange={(val) =>
            handleChange("browser", val)
          }
          options={[
            { value: "chrome", label: "Chrome" },
            { value: "safari", label: "Safari" },
            { value: "firefox", label: "Firefox" },
          ]}
        />

        {/* COUNTRY */}
        <CustomSelect
          label="Country"
          value={filters.country}
          onValueChange={(val) =>
            handleChange("country", val)
          }
          options={[
            { value: "all", label: "All countries" },
            { value: "us", label: "United States" },
          ]}
        />

        {/* GRANULARITY */}
        <CustomSelect
          label="Granularity"
          value={filters.granularity}
          onValueChange={(val) =>
            handleChange("granularity", val)
          }
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ]}
        />
      </div>

      {/* RESET BUTTON */}
      <button
        className="reset-button"
        onClick={handleReset}
      >
        Reset filters
      </button>
    </div>
  );
};

export default AnalyticsFilters;