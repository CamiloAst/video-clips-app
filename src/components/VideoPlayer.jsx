// Importación de hooks de React y Redux
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Acción para cambiar el clip actual
import { setCurrentClip } from "../features/clips/clipsSlice";

// Componente para mostrar marcadores en la línea de tiempo del video
import ClipMarkers from "./ClipMarkers";

/**
 * Componente VideoPlayer
 *
 * Reproduce el clip seleccionado del video actual, mostrando un reproductor HTML5 con:
 * - Fragmentos de tiempo (`media fragments`) para clips.
 * - Control automático para avanzar al siguiente clip tras 3 segundos.
 * - Navegación con teclas (← y →).
 * - Visualización de marcadores de inicio de clips.
 */
const VideoPlayer = () => {
  const videoRef = useRef(null); // Referencia al elemento <video>
  const dispatch = useDispatch();

  // Estado global: videos y video/clip actual
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);
  const videos = useSelector((state) => state.clips.videos || {});
  const video = currentVideoId ? videos[currentVideoId] : null;
  const clips = video?.clips || [];
  const currentClip = clips.find((c) => c.id === video?.currentClipId);

  const [loadingNext, setLoadingNext] = useState(false); // Cargando siguiente clip
  const [videoDuration, setVideoDuration] = useState(0); // Duración total del video (para ClipMarkers)

  /**
   * Cambia al siguiente clip en la lista.
   */
  const goToNextClip = () => {
    const index = clips.findIndex((c) => c.id === currentClip?.id);
    const next = clips[index + 1];
    if (next) {
      dispatch(setCurrentClip({ videoId: currentVideoId, clipId: next.id }));
    }
  };

  /**
   * Cambia al clip anterior en la lista.
   */
  const goToPreviousClip = () => {
    const index = clips.findIndex((c) => c.id === currentClip?.id);
    const prev = clips[index - 1];
    if (prev) {
      dispatch(setCurrentClip({ videoId: currentVideoId, clipId: prev.id }));
    }
  };

  /**
   * Efecto: carga y reproduce automáticamente el clip actual.
   * Agrega también los listeners para usar flechas de teclado.
   */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current
        .play()
        .catch((err) => console.warn("Autoplay bloqueado:", err.message));
    }

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNextClip();
      if (e.key === "ArrowLeft") goToPreviousClip();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentClip, clips]);

  /**
   * Efecto: supervisa si se ha alcanzado el final del clip actual y cambia al siguiente.
   * Incluye un delay de 3 segundos con animación de carga.
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
    }, 100); // Revisión cada 100ms

    return () => clearInterval(interval);
  }, [currentClip, clips]);

  // Si no hay video o clip activo, no renderiza nada
  if (!video || !currentClip) return null;

  // Fragmento de medios para reproducir solo el rango del clip
  const mediaFragment =
    currentClip.end !== null
      ? `#t=${currentClip.start},${currentClip.end}`
      : "";

  return (
    <div>
      <h2>Reproduciendo: {currentClip.name}</h2>

      {/* Animación de carga al cambiar de clip */}
      {loadingNext && (
        <div className="loading-spinner">
          <div className="spinner" />
          <span>Cargando siguiente clip...</span>
        </div>
      )}

      {/* Reproductor de video HTML5 */}
      <video
        ref={videoRef}
        muted
        controls
        key={mediaFragment} // Forzar recarga al cambiar clip
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
        Tu navegador no soporta el video.
      </video>

      {/* Marcadores de clips en la línea de tiempo */}
      <ClipMarkers videoDuration={videoDuration} />
    </div>
  );
};

export default VideoPlayer;
