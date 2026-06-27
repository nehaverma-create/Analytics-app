export default function ChartEmptyState({
  title = "No data",
  message,
  height = 140,
}) {
  return (
    <div className="chart-empty-state" style={{ minHeight: height }}>
      <p className="chart-empty-title">{title}</p>
      {message && <p className="chart-empty-message">{message}</p>}
    </div>
  );
}
