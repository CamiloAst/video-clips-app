// Importación de React y hooks necesarios
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Importación de acciones para manipular el estado de clips/videos
import {
  addVideo,
  setCurrentVideo,
  deleteVideo,
  setCurrentClip,
} from "../features/clips/clipsSlice";

// Componente para añadir un nuevo video (posiblemente modal)
import NewVideoForm from "./NewVideoForm";

// Importación para navegación entre rutas
import { Link } from "react-router-dom";

/**
 * Componente Navbar
 *
 * Barra de navegación principal que permite:
 * - Buscar clips por nombre o etiquetas.
 * - Agregar nuevos videos.
 * - Seleccionar o eliminar un video activo.
 * - Navegar a la sección de videos guardados.
 *
 * Props:
 * - onSearch: función que propaga el texto de búsqueda a componentes hijos.
 */
const Navbar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Acceso al estado global: videos y video actual
  const videos = useSelector((state) => state.clips.videos || {});
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);

  // Estados locales para inputs y modales
  const [urlInput, setUrlInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  /**
   * Agrega un nuevo video con ID único y la URL proporcionada.
   */
  const handleAddVideo = () => {
    if (!urlInput.trim()) return;
    const id = Date.now().toString(); // ID basado en timestamp
    dispatch(addVideo({ id, url: urlInput }));
    dispatch(setCurrentVideo(id));
    setUrlInput("");
  };

  /**
   * Obtiene todos los clips de todos los videos para búsqueda.
   * Se memoiza para evitar recálculos innecesarios.
   */
  const allClips = useMemo(() => {
    return Object.entries(videos).flatMap(([videoId, video]) =>
      video.clips.map((clip) => ({
        ...clip,
        videoId,
        videoName: video.name,
      }))
    );
  }, [videos]);

  /**
   * Filtra los clips según el texto de búsqueda.
   */
  const searchResults = searchText
    ? allClips.filter(
        (clip) =>
          clip.name.toLowerCase().includes(searchText.toLowerCase()) ||
          clip.tags?.some((tag) =>
            tag.toLowerCase().includes(searchText.toLowerCase())
          )
      )
    : [];

  /**
   * Selecciona el video a reproducir desde el dropdown (si existiera).
   */
  const handleSelectVideo = (e) => {
    dispatch(setCurrentVideo(e.target.value));
  };

  /**
   * Manejador para el campo de búsqueda.
   * Propaga el valor a través de `onSearch`.
   */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  /**
   * Abre el modal de carga de nuevo video.
   */
  const openVideoModal = () => {
    setIsClosing(false);
    setShowVideoModal(true);
  };

  /**
   * Cierra el modal con animación de transición.
   */
  const closeVideoModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowVideoModal(false);
      setIsClosing(false);
    }, 300);
  };

  /**
   * Cambia al video y clip seleccionados desde los resultados de búsqueda.
   */
  const handleClipSelect = (clip) => {
    dispatch(setCurrentVideo(clip.videoId));
    dispatch(setCurrentClip({ videoId: clip.videoId, clipId: clip.id }));
    setSearchText("");
    onSearch("");
    navigate("/"); // Redirige a la página principal
  };

  return (
    <nav className="navbar">
      {/* Campo de búsqueda de clips */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar clips por nombre o etiqueta"
          value={searchText}
          onChange={handleSearch}
        />

        {/* Resultados dinámicos según búsqueda */}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((clip) => (
              <div
                key={clip.id + clip.videoId}
                className="search-result"
                onClick={() => handleClipSelect(clip)}
              >
                <strong>{clip.name}</strong> — <span>{clip.videoName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para abrir modal de nuevo video */}
      <button className="btn btn-primary" onClick={openVideoModal}>
        <i className="fas fa-video"></i> Nuevo Video
      </button>

      {/* Enlace a vista de todos los videos */}
      <Link to="/videos" className="btn btn-secondary">
        <i className="fas fa-th-large"></i> Mis Videos
      </Link>

      {/* Botón para eliminar el video actual con confirmación */}
      {currentVideoId && (
        <button
          className="btn btn-danger"
          onClick={() => {
            if (
              confirm(
                "¿Estás seguro de que deseas eliminar este video y todos sus clips?"
              )
            ) {
              dispatch(deleteVideo(currentVideoId));
            }
          }}
        >
          Eliminar video actual
        </button>
      )}
    </nav>
  );
};

export default Navbar;
