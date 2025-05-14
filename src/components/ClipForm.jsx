// === ClipForm Component ===

// React and useState hook for local state management
import React, { useState } from "react";

// Redux hooks for dispatching actions and accessing the global state
import { useDispatch, useSelector } from "react-redux";

// Redux action to add a new clip to a video
import { addClip } from "../features/clips/clipsSlice";

// UUID function to generate unique IDs for each clip
import { v4 as uuidv4 } from "uuid";

/**
 * ClipForm Component
 *
 * This form allows the user to create and submit a new clip
 * for an already loaded video. The user can specify the clip's
 * name, start and end times (in seconds), and optional tags.
 *
 * Props:
 * - onClose (function): Optional callback to close the form after submission.
 */
const ClipForm = ({ onClose }) => {
  const dispatch = useDispatch();

  // Get the currently selected video ID from the Redux store
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);

  // Local state for form input values
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  /**
   * Handle form submission:
   * - Validate fields
   * - Create clip object
   * - Dispatch action to Redux store
   * - Clear form and optionally close it
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || start === "" || end === "") {
      alert("Please fill in all required fields.");
      return;
    }

    const newClip = {
      id: uuidv4(), // Generate a unique ID
      name,
      start: parseFloat(start),
      end: parseFloat(end),
      tags: tagsInput
        .split(",") // Split by comma
        .map((t) => t.trim()) // Trim whitespace
        .filter(Boolean), // Remove empty entries
      isDefault: false, // Indicates a user-created clip
    };

    // Dispatch action to add clip to current video
    dispatch(addClip({ videoId: currentVideoId, clip: newClip }));

    // Optional: close the form
    onClose?.();

    // Reset form fields
    setName("");
    setStart("");
    setEnd("");
    setTagsInput("");
  };

  // If no video is selected, do not render the form
  if (!currentVideoId) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Clip</h3>

      {/* Clip name input */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Clip start time (in seconds) */}
      <input
        type="number"
        placeholder="Start (s)"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      {/* Clip end time (in seconds) */}
      <input
        type="number"
        placeholder="End (s)"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      {/* Optional tags for filtering */}
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />

      {/* Action buttons */}
      <button type="submit">Add Clip</button>
      <button type="button" onClick={onClose}>
        Cancel
      </button>
    </form>
  );
};

// Export the component
export default ClipForm;
