import { useEffect, useState } from "react";
import "../styles/projects.css";

export default function Projects() {
  const userId = localStorage.getItem("userId");

  const [projects, setProjects] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState("Active");

  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  useEffect(() => {
    if (userId) {
      loadProjects();
      loadNotes();
    }
  }, [userId]);

  async function loadProjects() {
    try {
      const response = await fetch(`http://localhost:5000/vercel/projects/${userId}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to load projects.");
        return;
      }

      setProjects(data.projects);
      setDisplayedProjects(data.projects);
    } catch {
      setError("Could not connect to server.");
    }
  }

  async function loadNotes() {
    const response = await fetch(`http://localhost:5000/project-notes/${userId}`);
    const data = await response.json();

    if (data.success) {
      setNotes(data.notes);
    }
  }

  function wildcardToRegex(value) {
    const escaped = value.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(escaped.replace(/\*/g, ".*"), "i");
  }

  function searchProjects() {
    if (!search.trim()) {
      setDisplayedProjects(projects);
      return;
    }

    const regex = wildcardToRegex(search);
    setDisplayedProjects(projects.filter((project) => regex.test(project.name)));
  }

  function resetSearch() {
    setSearch("");
    setDisplayedProjects(projects);
  }

  function getProjectNote(projectId) {
    return notes.find((note) => note.project_id === projectId);
  }

  async function addNote(project) {
    if (!newNote.trim()) {
      alert("Please enter a note first.");
      return;
    }

    const response = await fetch("http://localhost:5000/project-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId,
        projectId: project.id,
        projectName: project.name,
        note: newNote,
        status: newStatus
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    setNotes([...notes, data.note]);
    setNewNote("");
    setNewStatus("Active");
  }

  async function saveEdit(noteId) {
    const response = await fetch(`http://localhost:5000/project-notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        note: editNote,
        status: editStatus
      })
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    setNotes(
      notes.map((note) =>
        note.id === noteId
          ? { ...note, note: editNote, status: editStatus }
          : note
      )
    );

    setEditingId(null);
  }

  async function deleteNote(noteId) {
    const response = await fetch(`http://localhost:5000/project-notes/${noteId}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    setNotes(notes.filter((note) => note.id !== noteId));
  }

  return (
    <div className="projects-page">
      <section className="projects-container">
        <h1>Projects</h1>

        <p className="page-description">
          Search your Vercel projects by name. Wildcards are supported.
          Examples: <b>portfolio</b>, <b>port*</b>, <b>*dashboard*</b>.
        </p>

        <div className="search-box">
          <input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={searchProjects}>Search</button>
          <button className="secondary-btn" onClick={resetSearch}>Reset</button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="project-grid">
          {displayedProjects.map((project) => {
            const note = getProjectNote(project.id);

            return (
              <div className="project-card" key={project.id}>
                <h3>{project.name}</h3>
                <p>Framework: {project.framework || "Unknown"}</p>

                {note ? (
                  <div className="note-box">
                    <h4>Project Note</h4>

                    {editingId === note.id ? (
                      <>
                        <textarea
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                        />

                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option>Active</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>

                        <button onClick={() => saveEdit(note.id)}>Save</button>
                        <button className="secondary-btn" onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <p>{note.note}</p>
                        <span className="status">{note.status}</span>

                        <div className="note-actions">
                          <button
                            onClick={() => {
                              setEditingId(note.id);
                              setEditNote(note.note);
                              setEditStatus(note.status);
                            }}
                          >
                            Edit
                          </button>

                          <button className="delete-btn" onClick={() => deleteNote(note.id)}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="note-box">
                    <h4>Add Note</h4>

                    <textarea
                      placeholder="Add a note for this project..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />

                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option>Active</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>

                    <button onClick={() => addNote(project)}>Add Note</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}