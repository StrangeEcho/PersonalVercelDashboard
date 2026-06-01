export default function Insights() {
  return (
    <div className="insights-page">
      <h1>Insights</h1>

      <p>This page summarizes your deployment activity.</p>

      <div className="insight-card">
        <h3>Deployment Success Rate</h3>
        <p>Live insight calculations can be added from deployment data.</p>
      </div>

      <div className="insight-card">
        <h3>Most Active Project</h3>
        <p>This can be calculated from your Vercel deployment history.</p>
      </div>

      <div className="insight-card">
        <h3>Average Build Time</h3>
        <p>This can be calculated from recent deployment records.</p>
      </div>
    </div>
  );
}