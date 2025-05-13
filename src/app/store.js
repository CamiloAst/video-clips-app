// Importa la función para configurar el store de Redux desde Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";

// Importa el reducer que maneja la lógica de estado para los clips de video
import clipsReducer from "../features/clips/clipsSlice";

// Intenta recuperar el estado previamente guardado desde localStorage
const saved = localStorage.getItem("clipsState");
let parsed = {};

// Intenta parsear el JSON recuperado desde localStorage.
// En caso de error (por ejemplo, si el JSON está corrupto), se asigna un objeto vacío.
try {
  parsed = saved ? JSON.parse(saved) : {};
} catch {
  parsed = {};
}

// Se establece el estado inicial (preloadedState) con una estructura predeterminada
// Esto garantiza que siempre existan las claves `videos` y `currentVideoId` en el estado,
// lo cual previene errores por claves no definidas en el reducer
const preloadedState = {
  clips: {
    videos: parsed.videos || {}, // Diccionario de videos por ID
    currentVideoId: parsed.currentVideoId || null, // ID del video actualmente seleccionado
  },
};

// Configura el store de Redux utilizando Redux Toolkit.
// Se asigna el reducer bajo la clave `clips`, y se proporciona el estado inicial cargado desde localStorage.
export const store = configureStore({
  reducer: {
    clips: clipsReducer, // Define el "slice" del estado asociado a los clips
  },
  preloadedState, // Estado inicial del store
});

// Suscripción al store para guardar automáticamente el estado cada vez que cambia.
// Esto permite que el estado persista entre recargas de la página.
store.subscribe(() => {
  const state = store.getState(); // Obtiene el estado actual del store
  // Guarda únicamente la parte del estado relacionada con los clips
  localStorage.setItem("clipsState", JSON.stringify(state.clips));
});
