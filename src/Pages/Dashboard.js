import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <section className="dashboard-container">
        <h1>Dashboard</h1>

        <p className="page-description">
          Main overview of your personal Vercel dashboard.
        </p>

        <div className="dashboard-grid">
          <div
            className="dashboard-card clickable-card"
            onClick={() => navigate("/projects")}
          >
            <h3>Projects</h3>
            <p>View, search, and add notes to your Vercel projects.</p>
          </div>

          <div
            className="dashboard-card clickable-card"
            onClick={() => navigate("/deployments")}
          >
            <h3>Deployments</h3>
            <p>View recent deployment history from your Vercel account.</p>
          </div>

          <div
            className="dashboard-card clickable-card"
            onClick={() => navigate("/insights")}
          >
            <h3>Insights</h3>
            <p>See summaries and future analytics for your project activity.</p>
          </div>

          <div
            className="dashboard-card clickable-card"
            onClick={() => navigate("/settings")}
          >
            <h3>User Settings</h3>
            <p>Update your saved API token or change your password.</p>
          </div>
        </div>
      </section>
    </div>
  );
}