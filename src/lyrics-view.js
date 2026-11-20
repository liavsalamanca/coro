// Dibuja la letra en pantalla y mantiene la línea actual centrada.

import { findLineIndex } from "./lrc.js";

// Si entre dos líneas hay más de este tiempo sin texto, mostramos "puntitos"
const GAP_MS = 6000;

export class LyricsView {
  constructor(container, track, { onLineTap } = {}) {
    this.container = container;
    this.track = track;
    this.onLineTap = onLineTap;
    this.lines = [];
    this.elements = [];
    this.currentIndex = null;

    // Si cambia el tamaño de la pantalla o de la letra, re-centramos
    const observer = new ResizeObserver(() => this.center());
    observer.observe(container);
    observer.observe(track); // cambia cuando agrandas o achicas la letra

    // La letra se mueve solo con nuestro cálculo, nunca con desplazamiento del navegador
    container.addEventListener("scroll", () => {
      container.scrollTop = 0;
    });
  }

  setLines(rawLines) {
    // Agrega "pausas instrumentales" donde hay líneas vacías o silencios largos
    const lines = [];
    if (rawLines.length && rawLines[0].time > 3000) {
      lines.push({ time: 0, text: "", gap: true });
    }
    rawLines.forEach((line, i) => {
      if (!line.text) {
        lines.push({ ...line, gap: true });
        return;
      }
      lines.push(line);
      const next = rawLines[i + 1];
      if (next && next.text && next.time - line.time > GAP_MS * 2) {
        // Línea seguida de un silencio largo: la pausa aparece unos segundos después
        lines.push({ time: line.time + GAP_MS, text: "", gap: true });
      }
    });

    this.lines = lines;
    this.track.replaceChildren();
    this.elements = lines.map((line, i) => {
      const el = document.createElement("p");
      el.className = "line";
      if (line.gap) {
        el.classList.add("gap");
        el.setAttribute("aria-label", "Pausa instrumental");
        el.append(...[0, 1, 2].map(() => document.createElement("span")));
      } else {
        el.textContent = line.text;
      }
      el.addEventListener("click", () => this.onLineTap?.(line.time));
      this.track.append(el);
      return el;
    });
    this.currentIndex = null;
  }

  // Se llama muchas veces por segundo con la posición actual
  update(positionMs) {
    const index = Math.max(0, findLineIndex(this.lines, positionMs));
    if (index === this.currentIndex) return;
    this.currentIndex = index;

    this.elements.forEach((el, i) => {
      const distance = i - index;
      el.classList.toggle("current", distance === 0);
      el.classList.toggle("past", distance < 0);
      el.classList.toggle("far", Math.abs(distance) > 2);
    });
    this.center();
  }

  // Mueve la letra para que la línea actual quede un poco arriba del centro
  center() {
    const el = this.elements[this.currentIndex];
    if (!el) return;
    const anchor = this.container.clientHeight * 0.36;
    const offset = el.offsetTop + el.offsetHeight / 2;
    this.track.style.transform = `translateY(${Math.round(anchor - offset)}px)`;
  }
}
