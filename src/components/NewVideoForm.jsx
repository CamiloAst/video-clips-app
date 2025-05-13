// Importaciones necesarias
import React, { useState } from "react";
import { useDispatch } from "react-redux";

// Acciones para agregar un nuevo video y seleccionarlo
import { addVideo, setCurrentVideo } from "../features/clips/clipsSlice";

/**
 * Componente NewVideoForm
 *
 * Este componente proporciona un formulario para ingresar los datos de un nuevo video:
 * - URL del video en formato .mp4
 * - Nombre del video
 * - Ícono representativo
 *
 * Props:
 * - onClose: función que se ejecuta al cerrar el formulario (ej. cerrar modal)
 */
const NewVideoForm = ({ onClose }) => {
  const dispatch = useDispatch();

  // Estado para la URL del video
  const [url, setUrl] = useState("");

  // Estado para el nombre personalizado del video
  const [name, setName] = useState("");

  // Íconos disponibles para seleccionar en miniatura
  const ICONS = [
    { id: "icon-1", path: "/icons/icon-1.jpg" },
    { id: "icon-2", path: "/icons/icon-2.jpg" },
    { id: "icon-3", path: "/icons/icon-3.jpg" },
    { id: "icon-4", path: "/icons/icon-4.jpg" },
    { id: "icon-5", path: "/icons/icon-5.jpg" },
  ];

  // Icono actualmente seleccionado
  const [iconPath, setIconPath] = useState("/icons/icon-1.jpg");

  /**
   * Manejador del formulario.
   * Valida, crea un video con ID único y lo agrega al store.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica de campo URL
    if (!url.trim()) return;

    const id = Date.now().toString(); // ID único generado por timestamp

    // Despacha la acción para agregar un nuevo video
    dispatch(addVideo({ id, url, name, icon: iconPath }));

    // Selecciona el video recién agregado como activo
    dispatch(setCurrentVideo(id));

    // Limpia los campos
    setName("");
    setUrl("");

    // Cierra el formulario si se proporciona el callback
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar nuevo video</h3>

      {/* Campo para ingresar la URL del video */}
      <input
        type="text"
        placeholder="URL del video (.mp4)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {/* Campo para nombre descriptivo del video */}
      <input
        type="text"
        placeholder="Nombre del video"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Sección de selección de íconos */}
      <label>Selecciona un ícono:</label>
      <div className="icon-grid">
        {ICONS.map((icon) => (
          <img
            key={icon.id}
            src={icon.path}
            alt={icon.id}
            className={`icon-option ${
              iconPath === icon.path ? "selected" : ""
            }`}
            onClick={() => setIconPath(icon.path)}
          />
        ))}
      </div>

      {/* Botones de acción */}
      <button type="submit">Agregar video</button>
      <button type="button" onClick={onClose}>
        Cancelar
      </button>
    </form>
  );
};

// Exporta el componente para uso externo
export default NewVideoForm;
