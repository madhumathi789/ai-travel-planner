import React, { useState, useEffect } from "react";
import "./Memories.css";

const Memories = () => {
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
  const loadAlbums = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/memories");
      const data = await res.json();
      setAlbums(data);
    } catch (err) {
      console.error("Failed to load albums:", err);
    }
  };
  loadAlbums();
}, []);

  const updateAlbums = (updatedAlbums, updatedSelectedAlbum = null) => {
    setAlbums(updatedAlbums);
    localStorage.setItem("albums", JSON.stringify(updatedAlbums));
    if (updatedSelectedAlbum) setSelectedAlbum(updatedSelectedAlbum);
  };

  const addAlbum =async () => {
    if (!newAlbum.trim()) return;
    const res = await fetch("http://localhost:5000/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAlbum, location, description }),
      });
    const created = await res.json();
    setAlbums([...albums, created]);
  };

  const deleteAlbum = async (id) => {
  if (!window.confirm("Delete this album?")) return;

  await fetch(`http://localhost:5000/api/memories/${id}`, {
    method: "DELETE"
  });

  const updated = albums.filter((a) => a._id !== id);
  setAlbums(updated);
  if (selectedAlbum?._id === id) setSelectedAlbum(null);
};


  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

   const formData = new FormData();
   files.forEach(file => formData.append("images", file));

  const res = await fetch(`http://localhost:5000/api/memories/${selectedAlbum._id}/upload`, {
    method: "PUT",
    body: formData,
});

const updated = await res.json();
setSelectedAlbum(updated);
setAlbums(albums.map(a => (a._id === updated._id ? updated : a)));

  };

  const deletePhoto = async(index) => {
    if (!window.confirm("Delete this photo?")) return;
    const updatedImages = selectedAlbum.images.filter((_, i) => i !== index);

      const res = await fetch(`http://localhost:5000/api/memories/${selectedAlbum._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selectedAlbum, images: updatedImages }),
      });

      const updated = await res.json();
      setSelectedAlbum(updated);
      setAlbums(albums.map(a => (a._id === updated._id ? updated : a)));

  };

  const goBack = () => setSelectedAlbum(null);

  return (
    <div className="memories-container">
      {!selectedAlbum ? (
        <>
          <h2>My Travel Albums</h2>

          <div className="add-album">
            <input
              type="text"
              placeholder="Album name (e.g., Goa Trip)"
              value={newAlbum}
              onChange={(e) => setNewAlbum(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={addAlbum}>Add Album</button>
          </div>

          <div className="album-grid">
            {albums.length === 0 && <p>No albums yet.</p>}
            {albums.map((album, index) => (
              <div key={index} className="album-card">
                <div
                  onClick={() => setSelectedAlbum(album)}
                  style={{ cursor: "pointer" }}
                >
                  {album.images[0] ? (
                    <img
                      src={`http://localhost:5000${album.images[0]}`}
                      alt={album.name}
                      className="album-cover"
                    />

                  ) : (
                    <div className="album-placeholder">📷</div>
                  )}
                  <p className="album-name">{album.name}</p>
                  {album.location && <p className="album-location">📍 {album.location}</p>}
                  {album.description && <p className="album-description">{album.description}</p>}
                </div>
                <button
                    className="delete-album-btn"
                    onClick={() => deleteAlbum(album._id)}
                  >
                    🗑 Delete
                  </button>

              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Only show back button */}
          <button className="back-btn" onClick={goBack}>
            ← Back to Albums
          </button>

          {/* Photo upload */}
          <div className="upload-section">
            <label className="upload-btn">
              ➕ Add Pictures
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </label>
          </div>

          <div className="photo-grid">
            {selectedAlbum.images.length > 0 ? (
              selectedAlbum.images.map((img, i) => (
                <div key={i} className="photo-card">
                   <img src={`http://localhost:5000${img}`} alt={`memory-${i}`} />
                  <button
                    className="delete-photo-btn"
                    onClick={() => deletePhoto(i)}
                  >
                    🗑
                  </button>
                </div>
              ))
            ) : (
              <p className="no-photos">No photos added yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Memories;