// === VideoLibrary Component ===

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentVideo, deleteVideo } from "../features/clips/clipsSlice";
import { useNavigate } from "react-router-dom";

/**
 * VideoLibrary Component
 *
 * Displays a gallery of saved user videos. For each video, it allows:
 * - Opening the video to edit or play its clips.
 * - Deleting the video from the library.
 */
const VideoLibrary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get all videos from global Redux state (as a dictionary: id → video)
  const videos = useSelector((state) => state.clips.videos || {});

  /**
   * Handles opening a selected video:
   * - Sets the selected video as the current one in the store.
   * - Navigates to the main screen for clip management.
   */
  const handleOpen = (id) => {
    dispatch(setCurrentVideo(id));
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>My Videos</h2>

      {/* Main container for video gallery */}
      <div
        className={`video-grid ${
          Object.keys(videos).length === 1 ? "centered" : ""
        }`}
      >
        {/* Loop through videos and render each one */}
        {Object.entries(videos).map(([id, video]) => (
          <div
            key={id}
            style={{
              background: "#fff",
              padding: "1rem",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Video thumbnail with clickable icon */}
            {video.icon && (
              <div
                className="thumbnail-container"
                onClick={() => handleOpen(id)}
              >
                <img src={video.icon} alt="icon" className="thumbnail-image" />
                <div className="thumbnail-overlay">
                  <span className="video-name">{video.name}</span>
                </div>

                <p className="video-title-below">{video.name}</p>
              </div>
            )}

            {/* Delete button with confirmation prompt */}
            <div>
              <button
                onClick={() => {
                  if (confirm("Delete this video?")) {
                    dispatch(deleteVideo(id));
                  }
                }}
                style={{
                  backgroundColor: "crimson",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the component for use in routes or other views
export default VideoLibrary;
