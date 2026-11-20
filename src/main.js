// Punto de partida de la app: conecta todas las piezas.

import "./styles.css";
import { parseLrc } from "./lrc.js";
import { PlaybackClock } from "./clock.js";
import { LyricsView } from "./lyrics-view.js";
import { demoSong } from "./demo-song.js";

const $ = (id) => document.getElementById(id);

// ---------- Tamaño de la letra ----------
const SIZE_MIN = 0.85;
const SIZE_MAX = 1.5;
const SIZE_STEP = 0.1;
let lyricScale = readSavedScale();

function readSavedScale() {
  try {
    const saved = Number(localStorage.getItem("coro.lyricScale"));
    if (saved >= SIZE_MIN && saved <= SIZE_MAX) return saved;
  } catch {}
  return 1;
}

function applyScale() {
  document.documentElement.style.setProperty("--lyric-scale", lyricScale);
  $("size-down").disabled = lyricScale <= SIZE_MIN + 0.001;
  $("size-up").disabled = lyricScale >= SIZE_MAX - 0.001;
  try {
    localStorage.setItem("coro.lyricScale", String(lyricScale));
  } catch {}
}

function changeScale(delta) {
  lyricScale = Math.round((lyricScale + delta) * 100) / 100;
  lyricScale = Math.min(SIZE_MAX, Math.max(SIZE_MIN, lyricScale));
  applyScale();
}

$("size-down").addEventListener("click", () => changeScale(-SIZE_STEP));
$("size-up").addEventListener("click", () => changeScale(SIZE_STEP));
applyScale();

// ---------- Canción de prueba ----------
const clock = new PlaybackClock();
const view = new LyricsView($("lyrics"), $("lyrics-track"), {
  onLineTap: (time) => clock.seek(time), // tocar una línea salta a ella
});

function loadSong(song) {
  $("song-title").textContent = song.title;
  $("song-artist").textContent = song.artist;
  $("time-total").textContent = formatTime(song.duration);
  view.setLines(parseLrc(song.syncedLyrics));
  clock.sync({ position: 0, playing: false, duration: song.duration });
}

loadSong(demoSong);

// ---------- Botones de reproducción ----------
const playBtn = $("play");

function refreshPlayButton() {
  playBtn.classList.toggle("playing", clock.playing);
  playBtn.setAttribute("aria-label", clock.playing ? "Pausar" : "Reproducir");
}

playBtn.addEventListener("click", () => {
  if (clock.playing) {
    clock.pause();
  } else {
    if (clock.position >= clock.duration) clock.seek(0);
    clock.play();
  }
  refreshPlayButton();
});

$("restart").addEventListener("click", () => clock.seek(0));

// Tocar la barra de progreso salta a ese punto
$("progress").addEventListener("click", (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const ratio = (event.clientX - rect.left) / rect.width;
  clock.seek(ratio * clock.duration);
});

// ---------- Bucle de animación (unas 60 veces por segundo) ----------
let lastSecond = -1;

function frame() {
  const position = clock.position;

  // Al terminar la canción de prueba, vuelve a empezar
  if (clock.playing && position >= clock.duration) {
    clock.seek(0);
  }

  view.update(position);
  $("progress-fill").style.width = `${(position / clock.duration) * 100}%`;

  const second = Math.floor(position / 1000);
  if (second !== lastSecond) {
    lastSecond = second;
    $("time-current").textContent = formatTime(position);
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
refreshPlayButton();

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
