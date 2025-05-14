// === Redux Store Setup for Video Clips Application ===

// Import Redux Toolkit's configureStore function to create the Redux store
import { configureStore } from "@reduxjs/toolkit";

// Import the reducer responsible for managing the clips-related state
import clipsReducer from "../features/clips/clipsSlice";

// Attempt to retrieve previously saved state from localStorage
const saved = localStorage.getItem("clipsState");
let parsed = {};

// Try parsing the JSON retrieved from localStorage.
// If parsing fails (e.g., corrupted data), fall back to an empty object.
try {
  parsed = saved ? JSON.parse(saved) : {};
} catch {
  parsed = {};
}

// Define the initial state structure (preloadedState).
// This ensures `videos` and `currentVideoId` keys always exist,
// preventing reducer errors from undefined keys.
const preloadedState = {
  clips: {
    videos: parsed.videos || {}, // Dictionary of video clips indexed by ID
    currentVideoId: parsed.currentVideoId || null, // Currently selected video clip ID
  },
};

// Configure the Redux store with:
// - The `clips` reducer (slice)
// - The preloaded state loaded from localStorage
export const store = configureStore({
  reducer: {
    clips: clipsReducer,
  },
  preloadedState,
});

// Subscribe to store updates.
// On every state change, persist only the `clips` state to localStorage.
// This enables state persistence across page reloads.
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("clipsState", JSON.stringify(state.clips));
});
