// === Redux Slice for Video Clips Management ===

import { createSlice } from "@reduxjs/toolkit";

// Initial state structure for video clips application
const initialState = {
  videos: {
    // Example structure:
    // videoId: {
    //   url: 'https://example.com/video.mp4',
    //   name: 'Sample Video',
    //   icon: '/icons/icon-1.jpg',
    //   clips: [...],
    //   currentClipId: 'clipId',
    // }
  },
  currentVideoId: null, // Currently selected video ID
};

// Define the "clips" slice of state
const clipsSlice = createSlice({
  name: "clips",
  initialState,
  reducers: {
    /**
     * Adds a new video to the state with a default full-length clip.
     * Automatically sets the new video as the current one.
     */
    addVideo: (state, action) => {
      const { id, url, name, icon } = action.payload;
      state.videos[id] = {
        url,
        name,
        icon,
        clips: [
          {
            id: "full-video", // Default clip covering the entire video
            name: "Full Video",
            start: 0,
            end: null,
            tags: [],
            isDefault: true,
          },
        ],
        currentClipId: "full-video", // Automatically play full video on load
      };
      state.currentVideoId = id;
    },

    /**
     * Deletes a video by ID. If it was the current video,
     * switches to another remaining video or null if none left.
     */
    deleteVideo: (state, action) => {
      const videoId = action.payload;
      delete state.videos[videoId];

      if (state.currentVideoId === videoId) {
        const remainingIds = Object.keys(state.videos);
        state.currentVideoId = remainingIds.length > 0 ? remainingIds[0] : null;
      }
    },

    /**
     * Sets the current active video by ID (if it exists).
     */
    setCurrentVideo: (state, action) => {
      const videoId = action.payload;
      if (state.videos[videoId]) {
        state.currentVideoId = videoId;
      }
    },

    /**
     * Adds a new clip to the specified video.
     */
    addClip: (state, action) => {
      const { videoId, clip } = action.payload;
      state.videos[videoId].clips.push(clip);
    },

    /**
     * Deletes a clip from a video by ID.
     * The default clip ("full-video") cannot be deleted.
     */
    deleteClip: (state, action) => {
      const { videoId, clipId } = action.payload;
      const video = state.videos[videoId];
      if (clipId === "full-video") return;

      video.clips = video.clips.filter((c) => c.id !== clipId);

      if (video.currentClipId === clipId) {
        video.currentClipId = "full-video";
      }
    },

    /**
     * Edits an existing clip in a video.
     */
    editClip: (state, action) => {
      const { videoId, clip } = action.payload;
      const video = state.videos[videoId];
      const index = video.clips.findIndex((c) => c.id === clip.id);
      if (index !== -1) {
        video.clips[index] = clip;
      }
    },

    /**
     * Sets the currently playing clip within a video.
     */
    setCurrentClip: (state, action) => {
      const { videoId, clipId } = action.payload;
      if (state.videos[videoId]) {
        state.videos[videoId].currentClipId = clipId;
      }
    },
  },
});

// Export the auto-generated action creators
export const {
  addVideo,
  deleteVideo,
  setCurrentVideo,
  addClip,
  deleteClip,
  editClip,
  setCurrentClip,
} = clipsSlice.actions;

// Export the reducer to be included in the Redux store
export default clipsSlice.reducer;
