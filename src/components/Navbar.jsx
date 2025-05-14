// === Navbar Component ===

import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Redux actions to manage video and clip state
import {
  addVideo,
  setCurrentVideo,
  deleteVideo,
  setCurrentClip,
} from "../features/clips/clipsSlice";

// Form component for adding a new video
import NewVideoForm from "./NewVideoForm";

/**
 * Navbar Component
 *
 * This is the main navigation bar for the application.
 * It allows the user to:
 * - Search for clips by name or tag.
 * - Add a new video.
 * - Select or delete the current video.
 * - Navigate to the saved videos section.
 *
 * Props:
 * - onSearch (function): Propagates the search text to child components.
 */
const Navbar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Global state: list of videos and current video ID
  const videos = useSelector((state) => state.clips.videos || {});
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);

  // Local state for form inputs and modal behavior
  const [urlInput, setUrlInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Adds a new video using the entered URL and sets it as the current video.
   */
  const handleAddVideo = () => {
    if (!urlInput.trim()) return;
    const id = Date.now().toString(); // Unique ID from timestamp
    dispatch(addVideo({ id, url: urlInput }));
    dispatch(setCurrentVideo(id));
    setUrlInput("");
  };

  /**
   * Returns a memoized list of all clips across all videos.
   */
  const allClips = useMemo(() => {
    return Object.entries(videos).flatMap(([videoId, video]) =>
      video.clips.map((clip) => ({
        ...clip,
        videoId,
        videoName: video.name,
      }))
    );
  }, [videos]);

  /**
   * Filters clips based on the search text (matches name or tags).
   */
  const searchResults = searchText
    ? allClips.filter(
        (clip) =>
          clip.name.toLowerCase().includes(searchText.toLowerCase()) ||
          clip.tags?.some((tag) =>
            tag.toLowerCase().includes(searchText.toLowerCase())
          )
      )
    : [];

  /**
   * Sets the selected video by ID from a dropdown (if implemented).
   */
  const handleSelectVideo = (e) => {
    dispatch(setCurrentVideo(e.target.value));
  };

  /**
   * Handles clip search input and propagates the value.
   */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  /**
   * Opens the modal to add a new video.
   */
  const openVideoModal = () => {
    setIsClosing(false);
    setShowVideoModal(true);
  };

  /**
   * Closes the video modal with transition animation.
   */
  const closeVideoModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowVideoModal(false);
      setIsClosing(false);
    }, 300);
  };

  /**
   * Handles clip selection from the search results.
   * Sets both the current video and clip, then navigates to the main page.
   */
  const handleClipSelect = (clip) => {
    dispatch(setCurrentVideo(clip.videoId));
    dispatch(setCurrentClip({ videoId: clip.videoId, clipId: clip.id }));
    setSearchText("");
    onSearch("");
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Clip search input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search clips by name or tag"
          value={searchText}
          onChange={handleSearch}
        />

        {/* Dynamic search results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((clip) => (
              <div
                key={clip.id + clip.videoId}
                className="search-result"
                onClick={() => handleClipSelect(clip)}
              >
                <strong>{clip.name}</strong> — <span>{clip.videoName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Button to open modal for adding a new video */}
      <button className="btn btn-primary" onClick={openVideoModal}>
        <i className="fas fa-video"></i> New Video
      </button>

      {/* Link to saved videos page */}
      <Link to="/videos" className="btn btn-secondary">
        <i className="fas fa-th-large"></i> My Videos
      </Link>

      {/* Button to delete the current video with confirmation */}
      {currentVideoId && (
        <button
          className="btn btn-danger"
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to delete this video and all of its clips?"
              )
            ) {
              dispatch(deleteVideo(currentVideoId));
            }
          }}
        >
          Delete Current Video
        </button>
      )}
      {showVideoModal && (
        <div
          className={`modal-overlay ${isClosing ? "fade-out" : ""}`}
          onClick={closeVideoModal}
        >
          <div
            className={`modal ${isClosing ? "slide-out" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <NewVideoForm onClose={closeVideoModal} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
