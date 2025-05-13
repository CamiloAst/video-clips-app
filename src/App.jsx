// Importaciones principales de React y componentes internos
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import VideoPlayer from "./components/VideoPlayer";
import ClipForm from "./components/ClipForm";
import ClipList from "./components/ClipList";

/**
 * Componente principal de la aplicación
 *
 * Este componente define la estructura general del layout y coordina:
 * - Barra de navegación (Navbar)
 * - Reproductor de video con clips (VideoPlayer)
 * - Lista de clips asociados al video (ClipList)
 * - Formulario modal para agregar nuevos clips (ClipForm)
 */
function App() {
  // Estado para la búsqueda de clips por nombre o etiquetas
  const [searchQuery, setSearchQuery] = useState("");

  // Control de visibilidad del modal para agregar clips
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // Controla animación de cierre

  /**
   * Abre el modal de creación de clip
   */
  const openModal = () => {
    setShowModal(true);
    setIsClosing(false);
  };

  /**
   * Cierra el modal con animación suave
   */
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300); // Delay para permitir animación de salida
  };

  return (
    <div className="App">
      {/* Barra de navegación con campo de búsqueda */}
      <Navbar onSearch={setSearchQuery} />

      {/* Contenedor principal de la interfaz */}
      <div className="main-content">
        {/* Sección del reproductor de video */}
        <div className="video-section">
          <VideoPlayer />
        </div>

        {/* Sección de la lista de clips */}
        <div className="cliplist-section">
          {/* Botón flotante para abrir el modal */}
          <button
            className="floating-button"
            onClick={openModal}
            title="Agregar nuevo clip"
          >
            <i className="fas fa-plus"></i>
          </button>

          {/* Modal de formulario para agregar nuevo clip */}
          {showModal && (
            <div
              className={`modal-overlay ${isClosing ? "fade-out" : ""}`}
              onClick={closeModal}
            >
              <div
                className={`modal ${isClosing ? "slide-out" : ""}`}
                onClick={(e) => e.stopPropagation()} // Previene cierre si se hace clic dentro del modal
              >
                <ClipForm onClose={closeModal} />
              </div>
            </div>
          )}

          {/* Lista de clips, filtrada por término de búsqueda */}
          <ClipList search={searchQuery} />
        </div>
      </div>
    </div>
  );
}

// Exportación del componente principal
export default App;
