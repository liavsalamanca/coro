// Convierte una letra en formato LRC (el que usa LRCLIB) en una lista de líneas.
// Ejemplo de LRC:   [00:12.50] Primera línea de la canción
// Resultado:        [{ time: 12500, text: "Primera línea de la canción" }, ...]
// (time está en milisegundos)

const TIME_TAG = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;

export function parseLrc(lrc) {
  const lines = [];

  for (const raw of lrc.split(/\r?\n/)) {
    const tags = [...raw.matchAll(TIME_TAG)];
    if (tags.length === 0) continue; // líneas de información, como [ar: Artista]

    const text = raw.replace(TIME_TAG, "").trim();

    // Una línea puede tener varias marcas de tiempo si se repite (por ejemplo, un coro)
    for (const [, min, sec, frac = "0"] of tags) {
      const ms = Number(frac.padEnd(3, "0").slice(0, 3));
      lines.push({ time: Number(min) * 60000 + Number(sec) * 1000 + ms, text });
    }
  }

  lines.sort((a, b) => a.time - b.time);
  return lines;
}

// Encuentra qué línea corresponde a un momento de la canción.
// Devuelve -1 si todavía no empieza la primera línea.
export function findLineIndex(lines, positionMs) {
  let lo = 0;
  let hi = lines.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (lines[mid].time <= positionMs) {
      found = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return found;
}
