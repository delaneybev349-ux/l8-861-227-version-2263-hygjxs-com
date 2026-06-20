(function () {
    function initMoviePlayer(config) {
        var video = document.getElementById(config.videoId);
        var overlay = document.getElementById(config.overlayId);
        var started = false;
        var hls = null;

        if (!video || !overlay || !config.stream) {
            return;
        }

        function attachStream() {
            if (started) {
                return;
            }
            started = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = config.stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(config.stream);
                hls.attachMedia(video);
            } else {
                video.src = config.stream;
            }
        }

        function play() {
            attachStream();
            overlay.classList.add("is-hidden");
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    overlay.classList.remove("is-hidden");
                });
            }
        }

        overlay.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (!started || video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            overlay.classList.add("is-hidden");
        });
        video.addEventListener("ended", function () {
            overlay.classList.remove("is-hidden");
        });
    }

    window.initMoviePlayer = initMoviePlayer;
}());
