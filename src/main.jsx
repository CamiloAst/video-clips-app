// Importación del modo estricto de React para detección de errores y prácticas obsoletas
import { StrictMode } from "react";

// Crea el punto de entrada React para renderizado concurrente
import { createRoot } from "react-dom/client";

// React Router: configuración de rutas
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Componentes de la aplicación
import VideoLibrary from "./components/VideoLibrary.jsx";
import App from "./App.jsx";

// Estilos globales
import "./index.css";

// Redux: proveedor del estado global
import { Provider } from "react-redux";
import { store } from "./app/store";

/**
 * Punto de entrada de la aplicación React.
 *
 * - `StrictMode`: ayuda a detectar posibles problemas en desarrollo.
 * - `Provider`: inyecta el store de Redux en todos los componentes.
 * - `BrowserRouter`: permite la navegación por rutas.
 * - `Routes`: define las rutas disponibles en la SPA.
 *
 * Rutas definidas:
 * - `/`: Página principal con reproductor y clips (`App`)
 * - `/videos`: Biblioteca de videos (`VideoLibrary`)
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
