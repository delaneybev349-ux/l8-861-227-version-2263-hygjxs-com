(function () {
  function initMoviePlayer(source) {
    const video = document.getElementById("movie-player");
    const start = document.getElementById("player-start");
    if (!video || !source) {
      return;
    }

    let hls = null;

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    const showButton = function () {
      if (start && video.paused) {
        start.classList.remove("is-hidden");
      }
    };

    const hideButton = function () {
      if (start) {
        start.classList.add("is-hidden");
      }
    };

    const play = function () {
      hideButton();
      const request = video.play();
      if (request && typeof request.catch === "function") {
        request.catch(function () {
          showButton();
        });
      }
    };

    if (start) {
      start.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", hideButton);
    video.addEventListener("pause", showButton);
    video.addEventListener("ended", showButton);

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
