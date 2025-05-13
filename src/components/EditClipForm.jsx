// Importación de React y hooks de estado
import React, { useState } from "react";

// Hook de Redux para despachar acciones
import { useDispatch } from "react-redux";

// Acción para editar un clip existente
import { editClip } from "../features/clips/clipsSlice";

/**
 * Componente EditClipForm
 *
 * Este componente presenta un formulario editable para modificar un clip existente
 * asociado a un video. Permite cambiar el nombre, tiempos de inicio y fin, y las etiquetas.
 *
 * Props:
 * - clip: objeto clip a editar.
 * - videoId: identificador del video al que pertenece el clip.
 * - onCancel: función callback que se ejecuta al cancelar o guardar.
 */
const EditClipForm = ({ clip, videoId, onCancel }) => {
  const dispatch = useDispatch();

  // Estados locales para mantener los valores editables del clip
  const [name, setName] = useState(clip.name);
  const [start, setStart] = useState(clip.start);
  const [end, setEnd] = useState(clip.end);
  const [tagsInput, setTagsInput] = useState(clip.tags.join(", ")); // Unifica etiquetas como string

  /**
   * Manejador de envío del formulario.
   * Crea un objeto actualizado del clip y lo envía al store.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Construye el clip actualizado con los nuevos valores
    const updatedClip = {
      ...clip,
      name,
      start: parseFloat(start),
      end: parseFloat(end),
      tags: tagsInput
        .split(",") // Divide por comas
        .map((t) => t.trim()) // Elimina espacios
        .filter(Boolean), // Quita vacíos
    };

    // Despacha la acción para editar el clip
    dispatch(editClip({ videoId, clip: updatedClip }));

    // Llama a la función onCancel para cerrar el formulario
    onCancel();
  };

  return (
    <form
      className="clip-item edit-form" // Estilo reutilizable
      onSubmit={handleSubmit}
      style={{ marginTop: "0.5rem" }}
    >
      {/* Campo: nombre del clip */}
      <input
        type="text"
        value={name}
        placeholder="Nombre"
        onChange={(e) => setName(e.target.value)}
      />

      {/* Campo: tiempo de inicio */}
      <input
        type="number"
        value={start}
        placeholder="Inicio (s)"
        onChange={(e) => setStart(e.target.value)}
      />

      {/* Campo: tiempo de fin */}
      <input
        type="number"
        value={end}
        placeholder="Fin (s)"
        onChange={(e) => setEnd(e.target.value)}
      />

      {/* Campo: etiquetas separadas por coma */}
      <input
        type="text"
        value={tagsInput}
        placeholder="Etiquetas (coma)"
        onChange={(e) => setTagsInput(e.target.value)}
      />

      {/* Botones para guardar o cancelar */}
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

// Exportación del componente para su uso externo
export default EditClipForm;
