# React Video Clips App 🎬

Esta aplicación es una prueba técnica diseñada para demostrar el manejo de tecnologías frontend modernas con React.js, Redux Toolkit y media fragments en HTML5.

Permite cargar un video, dividirlo en clips, gestionarlos (agregar, editar, eliminar), visualizarlos en una lista, reproducir fragmentos y navegar entre clips. Todo con una interfaz moderna, responsiva y fácil de usar.

---

## 🚀 Tecnologías utilizadas

- ⚛️ **React.js** (con hooks funcionales)
- 🧠 **Redux Toolkit** para manejo de estado global
- 📹 **HTML5 Video + Media Fragments**
- 💅 **CSS personalizado responsivo**
- 🔄 **Persistencia en localStorage**
- 🔍 **React Router v6** para navegación

---

## 📂 Estructura del proyecto

```
├── public/
│   └── icons/                  # Íconos de miniaturas de video
├── src/
│   ├── app/
│   │   └── store.js            # Configuración del store de Redux
│   ├── components/             # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── ClipList.jsx
│   │   ├── ClipForm.jsx
│   │   ├── EditClipForm.jsx
│   │   ├── VideoPlayer.jsx
│   │   └── VideoLibrary.jsx
│   ├── features/
│   │   └── clips/
│   │       └── clipsSlice.js   # Slice de Redux para clips y videos
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx                # Punto de entrada de React
```

---

## 🧪 Funcionalidades requeridas

✅ Reproductor HTML5 que usa media fragments
✅ Lista de clips
✅ Video completo como primer elemento
✅ Formulario para añadir clips (nombre, inicio, fin)
✅ Edición y eliminación de clips
✅ Reproducción de fragmentos individuales

---

## 🌟 Bonus implementados

✅ Transición automática al siguiente clip con retardo y spinner
✅ Buscador por nombre o etiqueta con resultados dinámicos
✅ Marcadores visuales en la línea de tiempo del reproductor
✅ Hotkeys: flechas izquierda/derecha para cambiar de clip
✅ Galería de videos con miniaturas e íconos seleccionables
✅ Persistencia total en localStorage

---

## ▶️ Cómo ejecutar

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/video-clips-app.git
cd video-clips-app
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta la app en modo desarrollo:

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) para verla en el navegador.

---

## ✍️ Autores

- Camilo Astudillo – Desarrollador Frontend
- Prueba Técnica ReactJS para evaluación técnica
