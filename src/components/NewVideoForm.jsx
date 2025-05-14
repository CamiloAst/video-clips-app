// === NewVideoForm Component ===

import React, { useState } from "react";
import { useDispatch } from "react-redux";

// Redux actions to add and select a video
import { addVideo, setCurrentVideo } from "../features/clips/clipsSlice";

/**
 * NewVideoForm Component
 *
 * Provides a form to input data for adding a new video:
 * - Video URL (must be a valid .mp4 link)
 * - Custom video name
 * - Selectable icon thumbnail
 *
 * Props:
 * - onClose (function): Optional callback to close the form (e.g., modal dismissal).
 */
const NewVideoForm = ({ onClose }) => {
  const dispatch = useDispatch();

  // State to manage video URL input
  const [url, setUrl] = useState("");

  // State to manage custom video name input
  const [name, setName] = useState("");

  // Available icon options to choose as thumbnails
  const ICONS = [
    { id: "icon-1", path: "/icons/icon-1.jpg" },
    { id: "icon-2", path: "/icons/icon-2.jpg" },
    { id: "icon-3", path: "/icons/icon-3.jpg" },
    { id: "icon-4", path: "/icons/icon-4.jpg" },
    { id: "icon-5", path: "/icons/icon-5.jpg" },
  ];

  // Currently selected icon path
  const [iconPath, setIconPath] = useState("/icons/icon-1.jpg");

  /**
   * Handles form submission:
   * - Validates the URL
   * - Dispatches actions to add and select the new video
   * - Clears form fields and closes the modal
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation: video URL is required
    if (!url.trim()) return;

    const id = Date.now().toString(); // Generate unique ID from timestamp

    // Dispatch action to add video
    dispatch(addVideo({ id, url, name, icon: iconPath }));

    // Set the new video as the current active one
    dispatch(setCurrentVideo(id));

    // Reset form fields
    setName("");
    setUrl("");

    // Trigger close if callback is provided
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Video</h3>

      {/* Input: Video URL */}
      <input
        type="text"
        placeholder="Video URL (.mp4)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {/* Input: Video name */}
      <input
        type="text"
        placeholder="Video name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Icon selection section */}
      <label>Select an icon:</label>
      <div className="icon-grid">
        {ICONS.map((icon) => (
          <img
            key={icon.id}
            src={icon.path}
            alt={icon.id}
            className={`icon-option ${
              iconPath === icon.path ? "selected" : ""
            }`}
            onClick={() => setIconPath(icon.path)}
          />
        ))}
      </div>

      {/* Action buttons */}
      <button type="submit">Add Video</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

// Export the component for reuse
export default NewVideoForm;
