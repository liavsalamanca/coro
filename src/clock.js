// Reloj local de la canción.
//
// Spotify solo nos dirá cada pocos segundos "vas en el segundo X".
// Entre una respuesta y otra, este reloj sigue contando por su cuenta
// usando el reloj del celular, para que la letra avance suave.
// Cada vez que llegue un dato nuevo, se "corrige" con sync().

export class PlaybackClock {
  constructor() {
    this.basePosition = 0; // en qué milisegundo de la canción íbamos...
    this.baseTime = performance.now(); // ...y en qué momento lo supimos
    this.playing = false;
    this.duration = 0;
  }

  // Posición actual estimada, en milisegundos
  get position() {
    const elapsed = this.playing ? performance.now() - this.baseTime : 0;
    const pos = this.basePosition + elapsed;
    return this.duration ? Math.min(pos, this.duration) : pos;
  }

  // Corrige el reloj con un dato nuevo
  sync({ position, playing, duration }) {
    this.basePosition = position;
    this.baseTime = performance.now();
    if (playing !== undefined) this.playing = playing;
    if (duration !== undefined) this.duration = duration;
  }

  play() {
    if (this.playing) return;
    this.sync({ position: this.position, playing: true });
  }

  pause() {
    if (!this.playing) return;
    this.sync({ position: this.position, playing: false });
  }

  seek(position) {
    this.sync({ position: Math.max(0, position) });
  }
}
