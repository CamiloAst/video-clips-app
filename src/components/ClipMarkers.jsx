// Importación de React y hooks de Redux
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// Importa la acción para seleccionar un clip específico
import { setCurrentClip } from "../features/clips/clipsSlice";

/**
 * Componente ClipMarkers
 *
 * Este componente visualiza marcadores sobre una barra de progreso personalizada
 * que indica los puntos de inicio de los clips dentro del video actual.
 *
 * Permite hacer clic sobre un marcador para seleccionar y reproducir el clip correspondiente.
 *
 * Props:
 * - videoDuration: duración total del video en segundos, usada para calcular posiciones relativas.
 */
const ClipMarkers = ({ videoDuration }) => {
  const dispatch = useDispatch();

  // Obtiene el ID del video actualmente seleccionado desde el estado global
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);

  // Obtiene el objeto video correspondiente al ID actual
  const video = useSelector((state) => state.clips.videos?.[currentVideoId]);

  // Extrae los clips definidos para el video (o una lista vacía si no existen)
  const clips = video?.clips || [];

  // Si no hay clips o la duración del video es inválida, no renderiza nada
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
      {/* Mapea los clips y dibuja un marcador en la posición de inicio relativa de cada uno */}
      {clips.map((clip) => {
        // Verifica que el clip tenga tiempo de inicio válido y que la duración del video no sea cero
        if (clip.start == null || videoDuration === 0) return null;

        // Calcula la posición horizontal del marcador como porcentaje del ancho total
        const left = (clip.start / videoDuration) * 100;

        return (
          <div
            key={clip.id}
            title={clip.name} // Tooltip al pasar el mouse
            onClick={() =>
              dispatch(
                setCurrentClip({ videoId: currentVideoId, clipId: clip.id })
              )
            }
            style={{
              position: "absolute",
              left: `${left}%`, // Posición horizontal relativa
              top: 0,
              width: "8px",
              height: "10px",
              backgroundColor: "#007bff", // Azul para resaltar
              cursor: "pointer",
              borderRadius: "2px",
            }}
          />
        );
      })}
    </div>
  );
};

// Exportación del componente para ser usado en otras partes de la app
export default ClipMarkers;
