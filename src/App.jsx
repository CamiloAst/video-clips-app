// === Main Application Component ===

import React, { useState } from "react";

// Internal components
import Navbar from "./components/Navbar";
import VideoPlayer from "./components/VideoPlayer";
import ClipForm from "./components/ClipForm";
import ClipList from "./components/ClipList";

/**
 * App Component
 *
 * This is the main layout component of the application.
 * It orchestrates the following components:
 * - Navbar with search functionality
 * - Video player with active clip (VideoPlayer)
 * - List of video clips (ClipList)
 * - Modal form for adding new clips (ClipForm)
 */
function App() {
  // State for filtering clips by name or tags
  const [searchQuery, setSearchQuery] = useState("");

  // State for modal visibility and exit animation
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Opens the modal to add a new clip.
   */
  const openModal = () => {
    setShowModal(true);
    setIsClosing(false);
  };

  /**
   * Closes the modal with a smooth fade/slide animation.
   */
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300); // Delay to allow exit animation
  };

  return (
    <div className="App">
      {/* Top navigation bar with search input */}
      <Navbar onSearch={setSearchQuery} />

      {/* Main layout content */}
      <div className="main-content">
        {/* Section: video playback */}
        <div className="video-section">
          <VideoPlayer />
        </div>

        {/* Section: clip list and modal trigger */}
        <div className="cliplist-section">
          {/* Floating action button to open clip creation modal */}
          <button
            className="floating-button"
            onClick={openModal}
            title="Add new clip"
          >
            <i className="fas fa-plus"></i>
          </button>

          {/* Modal overlay for adding new clips */}
          {showModal && (
            <div
              className={`modal-overlay ${isClosing ? "fade-out" : ""}`}
              onClick={closeModal}
            >
              <div
                className={`modal ${isClosing ? "slide-out" : ""}`}
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing on inner click
              >
                <ClipForm onClose={closeModal} />
              </div>
            </div>
          )}

          {/* Render filtered clip list based on search */}
          <ClipList search={searchQuery} />
        </div>
      </div>
    </div>
  );
}

// Export the main application component
export default App;
