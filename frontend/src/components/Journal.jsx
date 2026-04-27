// import React, { useState, useEffect } from "react";
// import "./Journal.css";

// const Journal = () => {
//   const [notes, setNotes] = useState([]);
//   const [currentNote, setCurrentNote] = useState(null); // null = show main page, number = edit note

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   // Load notes from localStorage
//   useEffect(() => {
//   const loadNotes = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/journal");
//       const data = await res.json();
//       setNotes(data);
//     } catch (err) {
//       console.error("Failed to load notes:", err);
//     }
//   };
//   loadNotes();
// }, []);
// const fetchNotes = async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/journal");
//     const data = await res.json();
//     setNotes(data);
//   } catch (err) {
//     console.error("Failed to reload notes:", err);
//   }
// };



//   const handleNewNote = () => {
//     setCurrentNote("new");
//     setTitle("");
//     setContent("");
//   };

//   const handleOpenNote = (index) => {
//   const note = notes[index];
//   setCurrentNote(note._id); // store the ID, not the index
//   setTitle(note.title);
//   setContent(note.content);
// };


//   const handleSave = async() => {
//     let updatedNotes = [...notes];
//       const noteData = { title, content };
//       const handleDelete = async (id) => {
//         if (!window.confirm("Delete this note?")) return;

//         await fetch(`http://localhost:5000/api/journal/${id}`, {
//           method: "DELETE",
//         });

//         setNotes(notes.filter((n) => n._id !== id));
//       };


//       if (currentNote === "new") {
//         const res = await fetch("http://localhost:5000/api/journal", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(noteData),
//         });
//         const saved = await res.json();
//         updatedNotes.push(saved);
//       } else {
//         const id = currentNote; // we now store the ID directly
//         const res = await fetch(`http://localhost:5000/api/journal/${id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(noteData),
//         });
//         const updated = await res.json();

//         updatedNotes = updatedNotes.map(n => (n._id === id ? updated : n));
//       }
//     await fetchNotes(); // reload from backend
//     setCurrentNote(null);


//   };

//   const handleBack = () => {
//     setCurrentNote(null);
//   };

//   // --- Render ---
//   if (currentNote !== null) {

//     // Note editor view
//     return (
//       <div className="editor-container">
//         <button className="back-btn" onClick={handleBack}>⬅ Back</button>
//         <input
//           className="note-title"
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <textarea
//           className="note-content"
//           placeholder="Start writing..."
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />
//         <button className="save-note-btn" onClick={handleSave}>Save</button>
//       </div>
//     );
//   }

//   // Main journal page view
//   return (
//     <div className="journal-container">
//       <div className="new-note" onClick={handleNewNote}>
//         <span className="plus-icon">+</span>
//         <p>Create New Note</p>
//       </div>

//       {notes.length > 0 && (
//         <div className="notes-preview">
//           <h3>Saved Notes</h3>
//           {notes.map((note, idx) => (
//             <div key={idx} className="note-preview-card">
//               <div onClick={() => handleOpenNote(idx)} className="note-text">
//                 <h4>{note.title || "Untitled"}</h4>
//                 <p>{(note.content || "").substring(0, 50)}...</p>
//               </div>

//               <button
//                 className="delete-note-btn"
//                 onClick={(e) => {
//                   e.stopPropagation(); 
//                   handleDelete(note._id);
//                 }}
//               >
//                 🗑
//               </button>
//             </div>

//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Journal;


import React, { useState, useEffect } from "react";
import "./Journal.css";

const Journal = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/journal");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to load notes:", err);
      }
    };
    loadNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/journal");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to reload notes:", err);
    }
  };

  const handleNewNote = () => {
    setCurrentNote("new");
    setTitle("");
    setContent("");
  };

  const handleOpenNote = (index) => {
    const note = notes[index];
    setCurrentNote(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  // ✅ FIX: Delete moved OUTSIDE handleSave
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    await fetch(`http://localhost:5000/api/journal/${id}`, {
      method: "DELETE",
    });

    setNotes(notes.filter((n) => n._id !== id));
  };

  const handleSave = async () => {
    let updatedNotes = [...notes];
    const noteData = { title, content };

    if (currentNote === "new") {
      const res = await fetch("http://localhost:5000/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      const saved = await res.json();
      updatedNotes.push(saved);
    } else {
      const id = currentNote;
      const res = await fetch(`http://localhost:5000/api/journal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      const updated = await res.json();

      updatedNotes = updatedNotes.map((n) => (n._id === id ? updated : n));
    }

    await fetchNotes();
    setCurrentNote(null);
  };

  const handleBack = () => {
    setCurrentNote(null);
  };

  if (currentNote !== null) {
    return (
      <div className="editor-container">
        <button className="back-btn" onClick={handleBack}>⬅ Back</button>
        <input
          className="note-title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="note-content"
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="save-note-btn" onClick={handleSave}>Save</button>
      </div>
    );
  }

  return (
    <div className="journal-container">
      <div className="new-note" onClick={handleNewNote}>
        <span className="plus-icon">+</span>
        <p>Create New Note</p>
      </div>

      {notes.length > 0 && (
        <div className="notes-preview">
          <h3>Saved Notes</h3>
          {notes.map((note, idx) => (
            <div key={idx} className="note-preview-card">
              <div onClick={() => handleOpenNote(idx)} className="note-text">
                <h4>{note.title || "Untitled"}</h4>
                <p>{(note.content || "").substring(0, 50)}...</p>
              </div>

              <button
                className="delete-note-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note._id);
                }}
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;
