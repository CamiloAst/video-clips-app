// === ClipMarkers Component ===

import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux action to set the current clip
import { setCurrentClip } from "../features/clips/clipsSlice";

/**
 * ClipMarkers Component
 *
 * Renders clickable markers along a custom progress bar that indicate
 * the start times of each clip in the current video. Clicking on a marker
 * selects and plays the corresponding clip.
 *
 * Props:
 * - videoDuration (number): Total duration of the video in seconds, used to calculate relative positions.
 */
const ClipMarkers = ({ videoDuration }) => {
  const dispatch = useDispatch();

  // Get the ID of the currently selected video from the Redux store
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);

  // Get the video object associated with the current video ID
  const video = useSelector((state) => state.clips.videos?.[currentVideoId]);

  // Retrieve the list of clips for the current video, or return an empty array
  const clips = video?.clips || [];

  // Do not render if there are no clips or the video duration is invalid
  if (!clips.length || !videoDuration) return null;

  return (
    <div
      style={{
        position: "relative",
        height: "10px",
        background: "#eee",
        margin: "10px 0",
        borderRadius: "5px",
      }}
    >
      {/* Iterate over each clip and render a marker at its start time */}
      {clips.map((clip) => {
        // Ensure the clip has a valid start time and the video duration is non-zero
        if (clip.start == null || videoDuration === 0) return null;

        // Calculate horizontal position of the marker as a percentage of total width
        const left = (clip.start / videoDuration) * 100;

        return (
          <div
            key={clip.id}
            title={clip.name} // Show clip name as tooltip on hover
            onClick={() =>
              dispatch(
                setCurrentClip({ videoId: currentVideoId, clipId: clip.id })
              )
            }
            style={{
              position: "absolute",
              left: `${left}%`, // Position marker relative to video duration
              top: 0,
              width: "8px",
              height: "10px",
              backgroundColor: "#007bff", // Blue marker color
              cursor: "pointer",
              borderRadius: "2px",
            }}
          />
        );
      })}
    </div>
  );
};

// Export the component for use in other parts of the application
export default ClipMarkers;
