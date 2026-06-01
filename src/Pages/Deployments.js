import { useEffect, useState } from "react";


export default function Deployments() {
  const [deployments, setDeployments] = useState([]);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadDeployments() {
      try {
        setError("");

        const response = await fetch(
          `http://localhost:5000/vercel/deployments/${userId}`
        );

        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to load deployments.");
          return;
        }

        setDeployments(data.deployments);
      } catch (err) {
        setError("Could not connect to server.");
      }
    }

    if (userId) {
      loadDeployments();
    }
  }, [userId]);

  return (
    <div className="deployments-page">
      <h1>Deployments</h1>

      <p>This page shows recent deployment records from your Vercel account.</p>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {deployments.length === 0 ? (
            <tr>
              <td colSpan="3">No deployments found.</td>
            </tr>
          ) : (
            deployments.map((deployment) => (
              <tr key={deployment.uid}>
                <td>{deployment.name || "Unknown"}</td>
                <td>{deployment.state || "Unknown"}</td>
                <td>
                  {deployment.createdAt
                    ? new Date(deployment.createdAt).toLocaleString()
                    : "Unknown"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}