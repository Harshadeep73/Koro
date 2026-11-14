import { useMemo, useState } from "react";
import "./App.css";
import AsciiWaves from "./components/AsciiWaves";

type Note = {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
};

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Docker fundamentals",
    content:
      "Containers share the host kernel. Images are immutable templates; containers are running instances of those images.",
    updatedAt: "2026-11-01",
  },
  {
    id: 2,
    title: "Hyprland setup",
    content:
      "Waybar configuration, Hyprland keybindings, window rules, and custom scripts for the Debian environment.",
    updatedAt: "2026-11-01",
  },
  {
    id: 3,
    title: "Koro architecture",
    content:
      "Frontend: React + TypeScript. Backend: Laravel REST API. Database: PostgreSQL. Containerization: Docker.",
    updatedAt: "2026-11-01",
  },
];

function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  }, [notes, search]);

  const activeNote =
    notes.find((note) => note.id === activeNoteId) ?? null;

  function openNewNote() {
    setActiveNoteId(null);
    setTitle("");
    setContent("");
    setEditorOpen(true);
  }

  function openEditNote(note: Note) {
    setActiveNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setActiveNoteId(null);
    setTitle("");
    setContent("");
  }

  function saveNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) return;

    const updatedAt = new Date().toISOString().slice(0, 10);

    if (activeNoteId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === activeNoteId
            ? { ...note, title: cleanTitle, content: cleanContent, updatedAt }
            : note,
        ),
      );
    } else {
      const newNote: Note = {
        id: Date.now(),
        title: cleanTitle,
        content: cleanContent,
        updatedAt,
      };

      setNotes((currentNotes) => [newNote, ...currentNotes]);
    }

    closeEditor();
  }

  function deleteNote(id: number) {
    const confirmed = window.confirm(
      "Delete this note? This action cannot be undone.",
    );

    if (!confirmed) return;

    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id),
    );

    if (activeNoteId === id) closeEditor();
  }

  return (
    <>
    <AsciiWaves />
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Koro home">
          <span className="brand-mark">&gt;_</span>
          <span className="brand-name">koro<span>.</span></span>
        </a>

        <div className="sidebar-section">
          <p className="section-label">WORKSPACE</p>

          <button className="nav-item active" type="button">
            <span className="nav-symbol">/</span>
            <span>all-notes</span>
            <span className="nav-count">{notes.length}</span>
          </button>

          <button
            className="nav-item"
            type="button"
            onClick={openNewNote}
          >
            <span className="nav-symbol">+</span>
            <span>new-note</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot" />
            <span>LOCAL WORKSPACE</span>
          </div>
          <div className="sidebar-footer">
            <span>KORO CLI</span>
            <span>v0.1.0</span>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="muted">~/</span>
            <span>notes</span>
            <span className="cursor">_</span>
          </div>

          <div className="topbar-right">
            <label className="search-box">
              <span className="search-symbol">/</span>
              <input
                type="search"
                placeholder="search notes..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search notes"
              />
              <span className="search-shortcut">CTRL /</span>
            </label>

            <button
              className="new-note-button"
              type="button"
              onClick={openNewNote}
            >
              <span>+</span> NEW NOTE
            </button>
          </div>
        </header>

        <div className="content-area">
          <section className="page-heading">
            <div>
              <p className="eyebrow">DIRECTORY LISTING</p>
              <h1>All notes<span className="heading-period">.</span></h1>
              <p className="page-description">
                Your thoughts, snippets, and everything in between.
              </p>
            </div>

            <div className="note-stat">
              <span className="stat-number">
                {String(filteredNotes.length).padStart(2, "0")}
              </span>
              <span className="stat-label">ENTRIES FOUND</span>
            </div>
          </section>

          <div className="list-toolbar">
            <span>NAME</span>
            <span>LAST MODIFIED</span>
          </div>

          {filteredNotes.length > 0 ? (
            <section className="notes-grid" aria-label="Your notes">
              {filteredNotes.map((note, index) => (
                <article className="note-card" key={note.id}>
                  <div className="card-top">
                    <span className="card-index">
                      {String(index + 1).padStart(2, "0")} /
                      {" "}{note.id === 1 ? "DOC" : "FILE"}
                    </span>

                    <button
                      className="card-menu"
                      type="button"
                      onClick={() => deleteNote(note.id)}
                      aria-label={`Delete ${note.title}`}
                      title="Delete note"
                    >
                      ×
                    </button>
                  </div>

                  <button
                    className="note-content"
                    type="button"
                    onClick={() => openEditNote(note)}
                    aria-label={`Edit ${note.title}`}
                  >
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                  </button>

                  <div className="card-footer">
                    <span className="file-type">TXT</span>
                    <span>{note.updatedAt}</span>
                    <button
                      className="edit-link"
                      type="button"
                      onClick={() => openEditNote(note)}
                    >
                      OPEN <span>↗</span>
                    </button>
                  </div>
                </article>
              ))}

              <button
                className="add-note-card"
                type="button"
                onClick={openNewNote}
              >
                <span className="add-icon">+</span>
                <span>create_new_entry</span>
              </button>
            </section>
          ) : (
            <div className="empty-state">
              <span className="empty-symbol">{"{ }"}</span>
              <h2>No entries found.</h2>
              <p>
                {search
                  ? "Try another search query."
                  : "Your workspace is empty. Create your first note."}
              </p>
              {!search && (
                <button
                  className="new-note-button"
                  type="button"
                  onClick={openNewNote}
                >
                  + NEW NOTE
                </button>
              )}
            </div>
          )}

          <footer className="content-footer">
            <span><span className="status-dot" /> ALL SYSTEMS NOMINAL</span>
            <span>KOro // PERSONAL KNOWLEDGE BASE</span>
          </footer>
        </div>
      </section>

      {editorOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditor();
          }}
        >
          <section
            className="editor-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-title"
          >
            <header className="editor-header">
              <span>
                <span className="status-dot" />
                {activeNote ? "EDIT ENTRY" : "NEW ENTRY"}
              </span>
              <button
                type="button"
                className="close-button"
                onClick={closeEditor}
                aria-label="Close editor"
              >
                ×
              </button>
            </header>

            <form onSubmit={saveNote}>
              <label className="field-label" htmlFor="note-title">
                FILENAME
              </label>
              <div className="input-prefix">
                <span>&gt;</span>
                <input
                  id="note-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="untitled.md"
                  maxLength={100}
                  autoFocus
                  required
                />
              </div>

              <label className="field-label" htmlFor="note-content">
                CONTENT
              </label>
              <textarea
                id="note-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Start typing your thoughts..."
                rows={8}
                required
              />

              <div className="editor-footer">
                <span>UTF-8 // PLAIN TEXT</span>
                <div>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeEditor}
                  >
                    CANCEL
                  </button>
                  <button className="save-button" type="submit">
                    {activeNote ? "SAVE CHANGES" : "CREATE ENTRY"} ↗
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}
      </main>
    </>
  );
}

export default App;
