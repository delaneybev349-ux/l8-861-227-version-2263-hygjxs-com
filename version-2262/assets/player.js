import { H as Hls } from './video-vendor.js';

export function startMoviePlayer(source) {
  const video = document.querySelector('.movie-player-video');
  const overlay = document.querySelector('.movie-player-overlay');

  if (!video || !overlay || !source) {
    return;
  }

  let ready = false;
  let hls = null;

  function attachSource() {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function playVideo() {
    attachSource();
    video.controls = true;
    overlay.classList.add('is-hidden');
    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        overlay.classList.remove('is-hidden');
      });
    }
  }

  overlay.addEventListener('click', playVideo);

  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });

  video.addEventListener('error', function () {
    if (hls) {
      hls.destroy();
      hls = null;
      ready = false;
    }
  });
}
