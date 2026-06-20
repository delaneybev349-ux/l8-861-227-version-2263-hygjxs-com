(function () {
    function setupMoviePlayer(streamUrl) {
        var video = document.getElementById("movie-player");
        var trigger = document.getElementById("play-trigger");
        var hls = null;
        var attached = false;

        if (!video || !streamUrl) {
            return;
        }

        function hideTrigger() {
            if (trigger) {
                trigger.classList.add("is-hidden");
            }
        }

        function attachStream() {
            if (attached) {
                return Promise.resolve();
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return Promise.resolve();
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                return new Promise(function (resolve) {
                    var settled = false;
                    function done() {
                        if (!settled) {
                            settled = true;
                            resolve();
                        }
                    }
                    hls.on(window.Hls.Events.MANIFEST_PARSED, done);
                    hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                        if (data && data.fatal) {
                            done();
                        }
                    });
                    window.setTimeout(done, 1800);
                });
            }

            video.src = streamUrl;
            return Promise.resolve();
        }

        function startPlayback() {
            hideTrigger();
            attachStream().then(function () {
                return video.play();
            }).catch(function () {});
        }

        if (trigger) {
            trigger.addEventListener("click", startPlayback);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener("play", hideTrigger);

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
}());
