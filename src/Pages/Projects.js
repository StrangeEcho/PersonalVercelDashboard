import { useEffect, useState } from "react";


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function loadProjects() {
      try {
        setError("");

        const response = await fetch(
          `http://localhost:5000/vercel/projects/${userId}`
        );

        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to load projects.");
          return;
        }

        setProjects(data.projects);
        setDisplayedProjects(data.projects);
      } catch (err) {
        setError("Could not connect to server.");
      }
    }

    if (userId) {
      loadProjects();
    }
  }, [userId]);

  function wildcardToRegex(value) {
    const escaped = value.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    const wildcard = escaped.replace(/\*/g, ".*");
    return new RegExp(wildcard, "i");
  }

  function searchProjects() {
    if (!search.trim()) {
      setDisplayedProjects(projects);
      return;
    }

    try {
      const regex = wildcardToRegex(search);

      const results = projects.filter((project) =>
        regex.test(project.name)
      );

      setDisplayedProjects(results);
    } catch (err) {
      setError("Invalid search input.");
    }
  }

  function resetSearch() {
    setSearch("");
    setDisplayedProjects(projects);
  }

  return (
    <div className="projects-page">
      <h1>Projects</h1>

      <p>
        This page displays your Vercel projects. Use the search field to
        search by project name.
      </p>

      <p>
        Wildcards are supported. Example searches: portfolio, port*,
        *dashboard*
      </p>

      <div className="search-box">
        <input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={searchProjects}>Search</button>
        <button onClick={resetSearch}>Reset</button>
      </div>

      {error && <p className="error">{error}</p>}

      {displayedProjects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        displayedProjects.map((project) => (
          <div className="project-card" key={project.id}>
            <h3>{project.name}</h3>
            <p>Framework: {project.framework || "Unknown"}</p>
            <p>
              Created:{" "}
              {project.createdAt
                ? new Date(project.createdAt).toLocaleString()
                : "Unknown"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}