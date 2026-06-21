// No config import needed

export function buildPlaylist() {
  return `
    <h2 class="section-title">Плейлист</h2>
    <div class="section-subtitle">музика Камінó</div>

    <div class="section-subtitle" style="margin-top:8px;">Слухати зараз <svg class="icon" style="font-size:14px;"><use href="#icon-headset"></svg></div>
    <iframe
      style="border-radius:12px;margin-bottom:20px;"
      src="https://open.spotify.com/embed/playlist/6KaNjx2EGlYG3YrmNHV25X?utm_source=generator&theme=0"
      width="100%" height="352" frameborder="0"
      allowfullscreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Camino Português playlist на Spotify">
    </iframe>

    <div style="background:var(--paper);border-radius:4px;padding:16px;margin-top:16px;border:1px solid var(--paper-dark);text-align:center;">
      <p style="font-family:'Caveat',cursive;font-size:20px;color:var(--terracotta);margin-bottom:6px;"><svg class="icon" style="margin-right:5px;"><use href="#icon-headset"></svg> Порада</p>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">
        Закачай плейлист офлайн у Spotify Premium перед вильотом. Сигнал часто зникає
        на прибережних ділянках. І обов'язково: Madredeus на заході сонця в Caminha — це окремий досвід.
      </p>
    </div>`;
}
