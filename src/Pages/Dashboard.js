export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <p>Main overview of your personal Vercel dashboard.</p>

      <div className="card">
        <h3>Projects</h3>
        <p>Use the Projects page to view and search your Vercel projects.</p>
      </div>

      <div className="card">
        <h3>Deployments</h3>
        <p>Use the Deployments page to view recent deployment records.</p>
      </div>

      <div className="card">
        <h3>User Settings</h3>
        <p>Use User Settings to update your API token or password.</p>
      </div>
    </div>
  );
}