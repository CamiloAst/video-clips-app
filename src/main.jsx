// === Application Entry Point ===

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Routing with React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// App components
import App from "./App.jsx";
import VideoLibrary from "./components/VideoLibrary.jsx";

// Global styles
import "./index.css";

// Redux store and provider
import { Provider } from "react-redux";
import { store } from "./app/store";

/**
 * Entry point of the React application.
 *
 * - `StrictMode`: Activates additional checks and warnings in development.
 * - `Provider`: Wraps the app with the Redux store for global state management.
 * - `BrowserRouter`: Enables client-side routing for SPA behavior.
 * - `Routes`: Defines the navigable pages of the application.
 *
 * Available routes:
 * - `/`: Main application with video player and clip manager (`App`)
 * - `/videos`: User's saved video library (`VideoLibrary`)
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/videos" element={<VideoLibrary />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
