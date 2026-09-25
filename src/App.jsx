

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Add / Update note
  function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (content.trim() === "") {
      setError("Content cannot be empty");
      return;
    }

    if (title.length > 100) {
      setError("Title cannot be more than 100 characters");
      return;
    }

    // Duplicate check
    const duplicate = notes.some(
      (note) =>
        note.title.toLowerCase() === title.toLowerCase() &&
        note.content.toLowerCase() === content.toLowerCase() &&
        note.id !== editingId
    );

    if (duplicate) {
      setError("This note already exists");
      return;
    }

    setError("");

    if (editingId) {
      // Update note
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title,
                content,
                color,
                tag,
                updatedAt: new Date().toLocaleString(),
              }
            : note
        )
      );

      setEditingId(null);
    } else {
      // Create note
      const newNote = {
        id: Date.now(),
        title,
        content,
        color,
        tag,
        archived: false,
        pinned: false,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };

      setNotes([newNote, ...notes]);
    }

    setTitle("");
    setContent("");
    setColor("yellow");
    setTag("");
  }

  // Edit
  function handleEdit(note) {
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color);
    setTag(note.tag);
    setEditingId(note.id);
    setError("");
  }

  // Delete
  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (confirmDelete) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  }

  // Archive / Unarchive
  function handleArchive(id) {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, archived: !note.archived }
          : note
      )
    );
  }

  // Pin / Unpin
  function handlePin(id) {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, pinned: !note.pinned }
          : note
      )
    );
  }

  // Search
  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.tag.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="app">

      <header className="header">
        <h1>Note Pad</h1>

        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <main className="container">

        {/* Note Form */}
        <form className="note-form" onSubmit={handleSubmit}>

          <h2>
            {editingId ? "✏️ Edit Note" : "➕ Create Note"}
          </h2>

          {error && <p className="error">{error}</p>}

          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            maxLength="100"
            onChange={(e) => setTitle(e.target.value)}
          />

          <p className="character-count">
            {title.length}/100 characters
          </p>

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="text"
            placeholder="Tag / Category"
            value={tag}
            maxLength="30"
            onChange={(e) => setTag(e.target.value)}
          />

          <div className="color-section">
            <p>Select color:</p>

            <button
              type="button"
              className="color yellow"
              onClick={() => setColor("yellow")}
            ></button>

            <button
              type="button"
              className="color blue"
              onClick={() => setColor("blue")}
            ></button>

            <button
              type="button"
              className="color green"
              onClick={() => setColor("green")}
            ></button>

            <button
              type="button"
              className="color pink"
              onClick={() => setColor("pink")}
            ></button>

            <button
              type="button"
              className="color purple"
              onClick={() => setColor("purple")}
            ></button>
          </div>

          <button className="add-btn" type="submit">
            {editingId ? "Update Note" : "Add Note"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setContent("");
                setTag("");
                setError("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Notes */}
        <section className="notes-section">

          <h2>My Notes ({filteredNotes.length})</h2>

          {filteredNotes.length === 0 ? (
            <div className="empty">
              <h3>📭 No Notes Found</h3>
              <p>Create your first note above.</p>
            </div>
          ) : (
            <div className="notes-grid">

              {filteredNotes.map((note) => (

                <div
                  key={note.id}
                  className={`note-card ${note.color} ${
                    note.archived ? "archived" : ""
                  }`}
                >

                  <div className="note-header">
                    <h3>
                      {note.title || "Untitled Note"}
                    </h3>

                    <button
                      className="pin-btn"
                      onClick={() => handlePin(note.id)}
                    >
                      {note.pinned ? "📌" : "📍"}
                    </button>
                  </div>

                  <p className="note-content">
                    {note.content}
                  </p>

                  {note.tag && (
                    <span className="tag">
                      #{note.tag}
                    </span>
                  )}

                  <p className="date">
                    Created: {note.createdAt}
                  </p>

                  {note.updatedAt !== note.createdAt && (
                    <p className="date">
                      Updated: {note.updatedAt}
                    </p>
                  )}

                  <div className="actions">

                    <button
                      onClick={() => handleEdit(note)}
                      className="edit-btn"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleArchive(note.id)}
                      className="archive-btn"
                    >
                      {note.archived ? "📂 Unarchive" : "📦 Archive"}
                    </button>

                    <button
                      onClick={() => handleDelete(note.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default App;


