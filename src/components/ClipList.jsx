// Importación de React y hooks necesarios
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Importación de acciones del slice de clips
import { setCurrentClip, deleteClip } from "../features/clips/clipsSlice";

// Importación del formulario de edición de clips
import EditClipForm from "./EditClipForm";

/**
 * Componente ClipList
 *
 * Este componente representa una lista de clips relacionados con el video actual.
 * Permite:
 *  - Visualizar la lista de clips asociados al video.
 *  - Filtrar los clips por nombre o etiquetas usando la barra de búsqueda.
 *  - Seleccionar un clip para reproducirlo.
 *  - Editar o eliminar un clip.
 */
const ClipList = ({ search = "" }) => {
  const dispatch = useDispatch();

  // Obtiene el ID del video actualmente seleccionado en el estado global
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);

  // Obtiene el objeto de video correspondiente al ID actual
  const video = useSelector((state) => {
    if (!state.clips.currentVideoId) return null;
    return state.clips.videos[state.clips.currentVideoId];
  });

  /**
   * Función auxiliar para formatear tiempos en segundos a formato MM:SS
   */
  const formatTime = (seconds) => {
    const date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  };

  // Obtiene los clips del video actual, o una lista vacía si no existen
  const clips = video?.clips || [];

  // Clip que actualmente se está reproduciendo (si aplica)
  const currentClipId = video?.currentClipId;

  /**
   * Filtrado de clips según el texto de búsqueda (nombre o etiquetas)
   */
  const filteredClips = clips.filter((clip) => {
    const query = search.toLowerCase();
    return (
      clip.name.toLowerCase().includes(query) ||
      clip.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // Estado local para manejar qué clip está siendo editado
  const [editingId, setEditingId] = useState(null);

  // Si no hay un video seleccionado, no renderiza nada
  if (!video) return null;

  return (
    <div className="clip-card">
      <h3>Clips del video</h3>

      <div className="clip-scroll">
        <ul>
          {/* Itera sobre los clips filtrados y los renderiza */}
          {filteredClips.map((clip) => (
            <div key={clip.id} className="clip-item">
              <div className="clip-header">
                <div className="clip-left">
                  {/* Botón para reproducir el clip */}
                  <img
                    src="/icons/boton-de-play.png"
                    alt="play"
                    className={`icon-action ${
                      clip.id === currentClipId ? "active" : ""
                    }`}
                    onClick={() =>
                      dispatch(
                        setCurrentClip({
                          videoId: currentVideoId,
                          clipId: clip.id,
                        })
                      )
                    }
                  />

                  {/* Miniatura del clip */}
                  <img
                    src={video.icon || "/icons/icon-default.jpg"}
                    alt="clip"
                    className="clip-thumbnail"
                  />

                  {/* Detalles del clip: nombre y rango de tiempo */}
                  <div className="clip-details">
                    <div className="clip-name">{clip.name}</div>
                    <div className="clip-time">
                      {formatTime(clip.start)} - {formatTime(clip.end)}
                    </div>
                  </div>
                </div>

                {/* Acciones: eliminar o editar clip */}
                <div className="clip-actions">
                  <img
                    src="/icons/eliminar.png"
                    alt="eliminar"
                    className="icon-action"
                    onClick={() =>
                      dispatch(
                        deleteClip({ videoId: currentVideoId, clipId: clip.id })
                      )
                    }
                  />
                  <img
                    src="/icons/editar.png"
                    alt="editar"
                    className="icon-action"
                    onClick={() => setEditingId(clip.id)}
                  />
                </div>
              </div>

              {/* Renderiza el formulario de edición si el clip está en modo edición */}
              {editingId === clip.id && (
                <EditClipForm
                  clip={clip}
                  videoId={currentVideoId}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Exporta el componente ClipList para ser utilizado en otras partes de la aplicación
export default ClipList;
