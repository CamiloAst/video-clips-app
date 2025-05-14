// === EditClipForm Component ===

import React, { useState } from "react";
import { useDispatch } from "react-redux";

// Redux action to update an existing clip
import { editClip } from "../features/clips/clipsSlice";

/**
 * EditClipForm Component
 *
 * Provides an editable form to modify an existing clip associated with a video.
 * Allows the user to update the clip's name, start and end times, and associated tags.
 *
 * Props:
 * - clip (object): The clip object to edit.
 * - videoId (string): ID of the video to which the clip belongs.
 * - onCancel (function): Callback function triggered after saving or canceling the form.
 */
const EditClipForm = ({ clip, videoId, onCancel }) => {
  const dispatch = useDispatch();

  // Local states to hold form input values
  const [name, setName] = useState(clip.name);
  const [start, setStart] = useState(clip.start);
  const [end, setEnd] = useState(clip.end);
  const [tagsInput, setTagsInput] = useState(clip.tags.join(", ")); // Tags as a comma-separated string

  /**
   * Handle form submission:
   * - Validates and parses inputs
   * - Dispatches Redux action to update the clip
   * - Closes the form afterward
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the updated clip object
    const updatedClip = {
      ...clip,
      name,
      start: parseFloat(start),
      end: parseFloat(end),
      tags: tagsInput
        .split(",") // Split input by commas
        .map((t) => t.trim()) // Trim whitespace
        .filter(Boolean), // Remove empty tags
    };

    // Dispatch action to update the clip in the store
    dispatch(editClip({ videoId, clip: updatedClip }));

    // Close the form (triggers parent logic)
    onCancel();
  };

  return (
    <form
      className="clip-item edit-form"
      onSubmit={handleSubmit}
      style={{ marginTop: "0.5rem" }}
    >
      {/* Input: Clip name */}
      <input
        type="text"
        value={name}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      {/* Input: Clip start time in seconds */}
      <input
        type="number"
        value={start}
        placeholder="Start (s)"
        onChange={(e) => setStart(e.target.value)}
      />

      {/* Input: Clip end time in seconds */}
      <input
        type="number"
        value={end}
        placeholder="End (s)"
        onChange={(e) => setEnd(e.target.value)}
      />

      {/* Input: Tags (comma-separated) */}
      <input
        type="text"
        value={tagsInput}
        placeholder="Tags (comma separated)"
        onChange={(e) => setTagsInput(e.target.value)}
      />

      {/* Action buttons */}
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

// Export the component for reuse
export default EditClipForm;
