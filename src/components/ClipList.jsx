// === ClipList Component ===

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux actions to set and delete clips
import { setCurrentClip, deleteClip } from "../features/clips/clipsSlice";

// Component to edit a clip
import EditClipForm from "./EditClipForm";

/**
 * ClipList Component
 *
 * This component displays a list of clips associated with the currently selected video.
 * Features:
 * - Filters clips by name or tags
 * - Allows selecting a clip for playback
 * - Enables editing or deleting existing clips
 *
 * Props:
 * - search (string): Optional search query to filter clips by name or tag
 */
const ClipList = ({ search = "" }) => {
  const dispatch = useDispatch();

  // Get the ID of the currently selected video
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);

  // Get the video object from the store
  const video = useSelector((state) => {
    if (!state.clips.currentVideoId) return null;
    return state.clips.videos[state.clips.currentVideoId];
  });

  /**
   * Format a number of seconds into MM:SS format
   */
  const formatTime = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  };

  // Retrieve clips from the current video or return an empty array
  const clips = video?.clips || [];

  // ID of the currently playing clip (if any)
  const currentClipId = video?.currentClipId;

  /**
   * Filter the list of clips based on the search query (matches name or tags)
   */
  const filteredClips = clips.filter((clip) => {
    const query = search.toLowerCase();
    return (
      clip.name.toLowerCase().includes(query) ||
      clip.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // Local state to track which clip is being edited
  const [editingId, setEditingId] = useState(null);

  // If no video is selected, don't render anything
  if (!video) return null;

  return (
    <div className="clip-card">
      <h3>Video Clips</h3>

      <div className="clip-scroll">
        <ul>
          {/* Render each clip in the filtered list */}
          {filteredClips.map((clip) => (
            <div key={clip.id} className="clip-item">
              <div className="clip-header">
                <div className="clip-left">
                  {/* Play button */}
                  <img
                    src="/icons/boton-de-play.png"
                    alt="play"
                    className={`icon-action ${
                      clip.id === currentClipId ? "active" : ""
                    }`}
                    onClick={() =>
                      dispatch(
                        setCurrentClip({
                          videoId: currentVideoId,
                          clipId: clip.id,
                        })
                      )
                    }
                  />

                  {/* Thumbnail */}
                  <img
                    src={video.icon || "/icons/icon-default.jpg"}
                    alt="clip"
                    className="clip-thumbnail"
                  />

                  {/* Clip details: name and time range */}
                  <div className="clip-details">
                    <div className="clip-name">{clip.name}</div>
                    <div className="clip-time">
                      {formatTime(clip.start)} - {formatTime(clip.end)}
                    </div>
                  </div>
                </div>

                {/* Clip actions: delete and edit */}
                <div className="clip-actions">
                  <img
                    src="/icons/eliminar.png"
                    alt="delete"
                    className="icon-action"
                    onClick={() =>
                      dispatch(
                        deleteClip({ videoId: currentVideoId, clipId: clip.id })
                      )
                    }
                  />
                  <img
                    src="/icons/editar.png"
                    alt="edit"
                    className="icon-action"
                    onClick={() => setEditingId(clip.id)}
                  />
                </div>
              </div>

              {/* Show edit form if this clip is being edited */}
              {editingId === clip.id && (
                <EditClipForm
                  clip={clip}
                  videoId={currentVideoId}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Export the component for use in other parts of the app
export default ClipList;
