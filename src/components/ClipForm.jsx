// Importación de React y hooks de estado
import React, { useState } from "react";

// Importación de hooks de Redux para despachar acciones y leer el estado global
import { useDispatch, useSelector } from "react-redux";

// Acción para agregar un nuevo clip a un video
import { addClip } from "../features/clips/clipsSlice";

// Importación de la función para generar identificadores únicos
import { v4 as uuidv4 } from "uuid";

/**
 * Componente ClipForm
 *
 * Este componente proporciona un formulario para que el usuario agregue un nuevo clip
 * a un video previamente cargado. El formulario permite ingresar el nombre del clip,
 * el tiempo de inicio y fin (en segundos), y etiquetas separadas por comas.
 *
 * Props:
 * - onClose: función opcional que se ejecuta al cerrar el formulario.
 */
const ClipForm = ({ onClose }) => {
  const dispatch = useDispatch();

  // Obtiene el ID del video actualmente seleccionado en el estado global
  const currentVideoId = useSelector((state) => state.clips.currentVideoId);

  // Estados locales para los campos del formulario
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  /**
   * Manejador del evento submit del formulario.
   * Valida los campos y despacha la acción para agregar un nuevo clip.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica de campos requeridos
    if (!name || start === "" || end === "") {
      alert("Completa todos los campos.");
      return;
    }

    // Construcción del nuevo clip a partir del formulario
    const newClip = {
      id: uuidv4(), // ID único generado automáticamente
      name,
      start: parseFloat(start),
      end: parseFloat(end),
      tags: tagsInput
        .split(",") // Divide por comas
        .map((t) => t.trim()) // Elimina espacios en blanco
        .filter(Boolean), // Elimina valores vacíos
      isDefault: false, // Marca como clip personalizado
    };

    // Despacha la acción para agregar el clip al video actual
    dispatch(addClip({ videoId: currentVideoId, clip: newClip }));

    // Ejecuta función de cierre si se proporciona
    onClose?.();

    // Limpia el formulario
    setName("");
    setStart("");
    setEnd("");
    setTagsInput("");
  };

  // Si no hay un video seleccionado, no se muestra el formulario
  if (!currentVideoId) return null;

  return (
    <form onSubmit={handleSubmit}>
      <h3>Agregar nuevo clip</h3>

      {/* Campo: Nombre del clip */}
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Campo: Tiempo de inicio (en segundos) */}
      <input
        type="number"
        placeholder="Inicio (s)"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />

      {/* Campo: Tiempo de fin (en segundos) */}
      <input
        type="number"
        placeholder="Fin (s)"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />

      {/* Campo: Etiquetas separadas por comas */}
      <input
        type="text"
        placeholder="Etiquetas (coma)"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
      />

      {/* Botones de acción */}
      <button type="submit">Agregar clip</button>
      <button type="button" onClick={onClose}>
        Cancelar
      </button>
    </form>
  );
};

// Exportación del componente para uso externo
export default ClipForm;
