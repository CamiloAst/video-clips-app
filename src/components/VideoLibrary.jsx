// Importación de React y hooks de Redux y React Router
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentVideo, deleteVideo } from "../features/clips/clipsSlice";
import { useNavigate } from "react-router-dom";

/**
 * Componente VideoLibrary
 *
 * Este componente representa una galería de videos del usuario.
 * Muestra miniaturas de cada video guardado, permitiendo:
 * - Abrir un video para editarlo o reproducir sus clips.
 * - Eliminar un video de la biblioteca.
 */
const VideoLibrary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Obtiene todos los videos del estado global (diccionario de ID → video)
  const videos = useSelector((state) => state.clips.videos || {});

  /**
   * Maneja la selección de un video:
   * - Establece como actual el video seleccionado.
   * - Redirige a la pantalla principal.
   */
  const handleOpen = (id) => {
    dispatch(setCurrentVideo(id));
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Mis Videos</h2>

      {/* Contenedor principal de la galería de videos */}
      <div
        className={`video-grid ${
          Object.keys(videos).length === 1 ? "centered" : ""
        }`}
      >
        {/* Itera sobre todos los videos existentes y los renderiza */}
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
            {/* Muestra la miniatura del video si tiene ícono */}
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

            {/* Botón para eliminar el video, con confirmación */}
            <div>
              <button
                onClick={() => {
                  if (confirm("¿Eliminar este video?"))
                    dispatch(deleteVideo(id));
                }}
                style={{
                  backgroundColor: "crimson",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exporta el componente para uso en el router u otros lugares
export default VideoLibrary;
