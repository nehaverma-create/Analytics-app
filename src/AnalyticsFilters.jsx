import React, { useState } from "react";
import CustomSelect from "./components/CustomSelect";

const AnalyticsFilters = () => {
  const [fromDate, setFromDate] = useState("2026-05-25");
  const [toDate, setToDate] = useState("2026-06-23");
  const [device, setDevice] = useState("all");
  const [browser, setBrowser] = useState("chrome");
  const [country, setCountry] = useState("all");
  const [granularity, setGranularity] = useState("daily");

  return (
    <div className="filters-container">

      {/* Heading */}
      <h3 className="filters-heading">Filters</h3>

      {/* Filters Grid */}
      <div className="filters-grid">

        {/* FROM DATE */}
        <div className="filter-group">
          <label className="filter-label">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="filter-input"
          />
        </div>

        {/* TO DATE */}
        <div className="filter-group">
          <label className="filter-label">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="filter-input"
          />
        </div>

        {/* DEVICE */}
        <CustomSelect
          label="Device"
          value={device}
          onValueChange={setDevice}
          options={[
            { value: "all", label: "All devices" },
            { value: "desktop", label: "Desktop" },
            { value: "mobile", label: "Mobile" },
          ]}
        />

        {/* BROWSER */}
        <CustomSelect
          label="Browser"
          value={browser}
          onValueChange={setBrowser}
          options={[
            { value: "chrome", label: "Chrome" },
            { value: "safari", label: "Safari" },
            { value: "firefox", label: "Firefox" },
          ]}
        />

        {/* COUNTRY */}
        <CustomSelect
          label="Country"
          value={country}
          onValueChange={setCountry}
          options={[
            { value: "all", label: "All countries" },
            { value: "us", label: "United States" },
          ]}
        />

        {/* GRANULARITY */}
        <CustomSelect
          label="Granularity"
          value={granularity}
          onValueChange={setGranularity}
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ]}
        />

      </div>

      {/* RESET BUTTON */}
      <button className="reset-button">
        Reset filters
      </button>

    </div>
  );
};

export default AnalyticsFilters;