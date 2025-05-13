// Importación de la utilidad para crear slices desde Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Estado inicial de la aplicación de clips
const initialState = {
  videos: {
    // Estructura esperada:
    // videoId: {
    //   url: 'https://video.mp4',
    //   name: 'Video nombre',
    //   icon: '/ruta/icon.jpg',
    //   clips: [...],
    //   currentClipId: 'id',
    // }
  },
  currentVideoId: null, // ID del video actualmente seleccionado
};

// Definición del slice `clips`
const clipsSlice = createSlice({
  name: "clips",
  initialState,
  reducers: {
    /**
     * Agrega un nuevo video con un clip inicial que representa todo el video.
     * El video se convierte automáticamente en el actual.
     */
    addVideo: (state, action) => {
      const { id, url, name, icon } = action.payload;
      state.videos[id] = {
        url,
        name,
        icon,
        clips: [
          {
            id: "full-video", // Clip inicial que cubre todo el video
            name: "Full Video",
            start: 0,
            end: null,
            tags: [],
            isDefault: true,
          },
        ],
        currentClipId: "full-video", // Se inicia mostrando el video completo
      };
      state.currentVideoId = id;
    },

    /**
     * Elimina un video y, si era el actual, selecciona el primero restante o nulifica.
     */
    deleteVideo: (state, action) => {
      const videoId = action.payload;
      delete state.videos[videoId];

      if (state.currentVideoId === videoId) {
        const remainingIds = Object.keys(state.videos);
        state.currentVideoId = remainingIds.length > 0 ? remainingIds[0] : null;
      }
    },

    /**
     * Establece qué video es el actual (si existe).
     */
    setCurrentVideo: (state, action) => {
      const videoId = action.payload;
      if (state.videos[videoId]) {
        state.currentVideoId = videoId;
      }
    },

    /**
     * Agrega un nuevo clip a un video existente.
     */
    addClip: (state, action) => {
      const { videoId, clip } = action.payload;
      state.videos[videoId].clips.push(clip);
    },

    /**
     * Elimina un clip de un video.
     * No permite eliminar el clip por defecto ("full-video").
     */
    deleteClip: (state, action) => {
      const { videoId, clipId } = action.payload;
      const video = state.videos[videoId];
      if (clipId === "full-video") return;

      video.clips = video.clips.filter((c) => c.id !== clipId);

      if (video.currentClipId === clipId) {
        video.currentClipId = "full-video";
      }
    },

    /**
     * Edita los datos de un clip específico dentro de un video.
     */
    editClip: (state, action) => {
      const { videoId, clip } = action.payload;
      const video = state.videos[videoId];
      const index = video.clips.findIndex((c) => c.id === clip.id);
      if (index !== -1) {
        video.clips[index] = clip;
      }
    },

    /**
     * Establece qué clip se está reproduciendo actualmente dentro de un video.
     */
    setCurrentClip: (state, action) => {
      const { videoId, clipId } = action.payload;
      if (state.videos[videoId]) {
        state.videos[videoId].currentClipId = clipId;
      }
    },
  },
});

// Exporta las acciones generadas automáticamente
export const {
  addVideo,
  deleteVideo,
  setCurrentVideo,
  addClip,
  deleteClip,
  editClip,
  setCurrentClip,
} = clipsSlice.actions;

// Exporta el reducer para su uso en el store principal
export default clipsSlice.reducer;
