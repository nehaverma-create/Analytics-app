import CustomSelect from "./CustomSelect";
import { getDefaultFilters } from "../utils/analyticsData";

const AnalyticsFilters = ({ filters, onChange, options = {} }) => {
  const { browsers = [], countries = [], devices = [] } = options;

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onChange(getDefaultFilters());
  };

  const deviceOptions = [
    { value: "all", label: "All devices" },
    ...devices.map((device) => ({
      value: device,
      label: device.charAt(0).toUpperCase() + device.slice(1),
    })),
  ];

  const browserOptions = [
    { value: "all", label: "All browsers" },
    ...browsers.map((browser) => ({ value: browser, label: browser })),
  ];

  const countryOptions = [
    { value: "all", label: "All countries" },
    ...countries.map((country) => ({ value: country, label: country })),
  ];

  return (
    <div className="filters-container">
      <h3 className="filters-heading">Filters</h3>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">From</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleChange("fromDate", e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">To</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleChange("toDate", e.target.value)}
            className="filter-input"
          />
        </div>

        <CustomSelect
          label="Device"
          value={filters.device}
          onValueChange={(val) => handleChange("device", val)}
          options={deviceOptions}
        />

        <CustomSelect
          label="Browser"
          value={filters.browser}
          onValueChange={(val) => handleChange("browser", val)}
          options={browserOptions}
        />

        <CustomSelect
          label="Country"
          value={filters.country}
          onValueChange={(val) => handleChange("country", val)}
          options={countryOptions}
        />

        <CustomSelect
          label="Granularity"
          value={filters.granularity}
          onValueChange={(val) => handleChange("granularity", val)}
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ]}
        />
      </div>

      <button className="reset-button" onClick={handleReset}>
        Reset filters
      </button>
    </div>
  );
};

export default AnalyticsFilters;
