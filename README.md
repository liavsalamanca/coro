# Coro

Letras sincronizadas para el carro. Proyecto personal.

## Qué hay en cada archivo

| Archivo | Qué hace |
|---|---|
| `index.html` | El esqueleto de la pantalla: logo, tarjeta de la canción, letra y botones. |
| `src/styles.css` | Colores, tipografías y tamaños. Los colores están definidos al inicio. |
| `src/main.js` | Conecta todas las piezas y responde a los botones. |
| `src/lrc.js` | Lee las letras en formato LRC (el de LRCLIB) y sabe qué línea toca. |
| `src/clock.js` | Reloj local que hace avanzar la letra suave entre consultas a Spotify. |
| `src/lyrics-view.js` | Dibuja la letra y mantiene centrada la línea actual. |
| `src/demo-song.js` | Canción inventada para probar (etapa 1). |
| `public/manifest.webmanifest` + `public/icons/` | Permiten guardar Coro en la pantalla de inicio del iPhone. |
| `package.json` | Lista de herramientas que usa el proyecto (solo Vite). |

## Comandos (solo si algún día la corres en un computador)

- `npm install`: descarga las herramientas.
- `npm run dev`: abre la app en modo prueba.
- `npm run build`: prepara la versión final en la carpeta `dist`.

## Seguridad

Este repositorio no guarda claves secretas. Si algún día hiciera falta una,
irá en "Environment Variables" de Vercel, nunca en el código.
