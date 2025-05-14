// === VideoPlayer Component ===

import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux action to set the current clip
import { setCurrentClip } from "../features/clips/clipsSlice";

// Visual markers showing clip positions on the timeline
import ClipMarkers from "./ClipMarkers";

/**
 * VideoPlayer Component
 *
 * Plays the currently selected clip from the active video using an HTML5 video player.
 * Features:
 * - Plays video fragments using media fragment URLs.
 * - Automatically moves to the next clip after 3 seconds of pause.
 * - Supports keyboard navigation (← and →).
 * - Displays markers for all clip start times on the timeline.
 */
const VideoPlayer = () => {
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  // Global state: current video and clip
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);
  const videos = useSelector((state) => state.clips.videos || {});
  const video = currentVideoId ? videos[currentVideoId] : null;
  const clips = video?.clips || [];
  const currentClip = clips.find((c) => c.id === video?.currentClipId);

  const [loadingNext, setLoadingNext] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  /**
   * Navigates to the next clip in the list (if any).
   */
  const goToNextClip = () => {
    const index = clips.findIndex((c) => c.id === currentClip?.id);
    const next = clips[index + 1];
    if (next) {
      dispatch(setCurrentClip({ videoId: currentVideoId, clipId: next.id }));
    }
  };

  /**
   * Navigates to the previous clip in the list (if any).
   */
  const goToPreviousClip = () => {
    const index = clips.findIndex((c) => c.id === currentClip?.id);
    const prev = clips[index - 1];
    if (prev) {
      dispatch(setCurrentClip({ videoId: currentVideoId, clipId: prev.id }));
    }
  };

  /**
   * Effect: reloads and plays the current clip.
   * Also enables left/right arrow key navigation.
   */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current
        .play()
        .catch((err) => console.warn("Autoplay blocked:", err.message));
    }

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNextClip();
      if (e.key === "ArrowLeft") goToPreviousClip();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentClip, clips]);

  /**
   * Effect: detects end of clip and triggers transition to next clip after 3 seconds.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const videoEl = videoRef.current;
      if (
        videoEl &&
        !videoEl.paused &&
        currentClip?.end !== null &&
        videoEl.currentTime >= currentClip.end
      ) {
        videoEl.pause();
        setLoadingNext(true);

        setTimeout(() => {
          const index = clips.findIndex((c) => c.id === currentClip.id);
          const next = clips[index + 1];
          if (next) {
            dispatch(
              setCurrentClip({ videoId: currentVideoId, clipId: next.id })
            );
          }
          setLoadingNext(false);
        }, 3000);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [currentClip, clips]);

  // If no video or clip is selected, render nothing
  if (!video || !currentClip) return null;

  // Media fragment for the clip time range
  const mediaFragment =
    currentClip.end !== null
      ? `#t=${currentClip.start},${currentClip.end}`
      : "";

  return (
    <div>
      <h2>Now Playing: {currentClip.name}</h2>

      {/* Loading animation when transitioning to the next clip */}
      {loadingNext && (
        <div className="loading-spinner">
          <div className="spinner" />
          <span>Loading next clip...</span>
        </div>
      )}

      {/* HTML5 video player */}
      <video
        ref={videoRef}
        muted
        controls
        key={mediaFragment} // Forces reload when clip changes
        onLoadedMetadata={() =>
          setVideoDuration(videoRef.current?.duration || 0)
        }
        style={{
          width: "100%",
          maxWidth: "640px",
          height: "auto",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <source src={`${video.url}${mediaFragment}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Timeline clip markers */}
      <ClipMarkers videoDuration={videoDuration} />
    </div>
  );
};

export default VideoPlayer;
