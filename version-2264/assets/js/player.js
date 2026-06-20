function initMoviePlayer(playerId, sourceUrl) {
  var video = document.getElementById(playerId);

  if (!video) {
    return;
  }

  var shell = video.closest('.player-shell');
  var button = shell ? shell.querySelector('[data-play-button]') : null;
  var attached = false;

  function attach() {
    if (attached) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      video.hlsPlayer = hls;
    } else {
      video.src = sourceUrl;
    }

    attached = true;
  }

  function start() {
    attach();

    if (shell) {
      shell.classList.add('is-playing');
    }

    video.controls = true;
    var promise = video.play();

    if (promise && promise.catch) {
      promise.catch(function () {
        if (shell) {
          shell.classList.remove('is-playing');
        }
      });
    }
  }

  if (button) {
    button.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', function () {
    if (shell) {
      shell.classList.add('is-playing');
    }
  });

  video.addEventListener('pause', function () {
    if (shell && video.currentTime === 0) {
      shell.classList.remove('is-playing');
    }
  });
}
